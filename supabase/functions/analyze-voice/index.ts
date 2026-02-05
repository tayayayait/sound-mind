import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, mimeType, duration } = await req.json();

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    if (!GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY is not configured");
      throw new HttpError(500, "API Key configuration missing. Please add GOOGLE_API_KEY to Supabase Secrets.");
    }

    if (!audio) {
      throw new HttpError(400, "Audio data is missing");
    }

    if (typeof duration !== "number" || Number.isNaN(duration)) {
      throw new HttpError(400, "Audio duration is missing or invalid.");
    }

    if (duration < 10) {
      throw new HttpError(422, "녹음이 너무 짧거나 조용합니다. 10초 이상 말씀해 주세요.");
    }

    const systemPrompt = `당신은 마음 상태 분석 전문가입니다. 사용자의 음성을 분석하여 감정 상태를 평가합니다.

중요: 모든 점수(0~100)는 50점으로 고정하지 말고, 사용자의 목소리 톤, 속도, 내용에 따라 실제 느껴지는 감정 상태를 반영하여 다양하게 측정하세요.
- 50점은 "중립"이 아닙니다. 확실한 근거를 가지고 점수를 부여하세요.
- 같은 점수가 반복되지 않도록 세밀하게 분석하세요.

분석 원칙:
1. 비판단적 언어 사용: "좋음/나쁨" 대신 "경향/변화/추천" 중심으로 표현
2. 음성의 톤, 속도, 강약 등 비언어적 요소도 텍스트 내용과 함께 고려하여 분석
3. 따뜻하고 안정적인 톤 유지

반드시 다음 JSON 형식으로만 응답하세요. 다른 설명은 포함하지 마세요:
{
  "overall_score": 0-100 사이 숫자 (마음 안정 지수, 전반적인 평온함 정도),
  "tension_score": 0-100 사이 숫자 (0=완전 이완, 100=극도의 긴장),
  "vitality_score": 0-100 사이 숫자 (0=무기력, 100=에너지 넘침),
  "focus_score": 0-100 사이 숫자 (0=산만함, 100=매우 집중됨),
  "recovery_score": 0-100 사이 숫자 (0=휴식 필요, 100=충분히 회복됨),
  "transcript": "사용자가 말한 내용 받아쓰기 (10자 이상)",
  "summary": "한 문장으로 된 오늘의 상태 요약 (예: '오늘은 다소 지쳐 보이지만 내면의 힘이 느껴져요')",
  "advice": "구체적이고 실천 가능한 부드러운 조언"
}`;

    // Gemini API Endpoint (use latest alias to avoid model deprecation 404)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_API_KEY}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            {
              inline_data: {
                mime_type: mimeType || "audio/webm",
                data: audio
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    console.log("Sending request to Gemini API...");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", response.status, errorText);
      
      if (response.status === 400) {
        throw new HttpError(400, "잘못된 요청입니다. 오디오 형식을 확인해주세요.");
      } else if (response.status === 403) {
        throw new HttpError(403, "API 키 권한이 유효하지 않습니다.");
      } else {
        throw new HttpError(502, `AI 서비스 응답 실패: (${response.status})`);
      }
    }

    const data = await response.json();
    console.log("Gemini response received");

    // Extract JSON from response
    let analysis;
    try {
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error("No content generated");
      }
      
      console.log("Raw Gemini Response Content:", content); // Debug log

      // Clean potential markdown code blocks if present (though responseMimeType should handle it)
      const cleanContent = content.replace(/```json\n|\n```/g, "").trim();
      analysis = JSON.parse(cleanContent);
      const scoreFields = [
        "overall_score",
        "tension_score",
        "vitality_score",
        "focus_score",
        "recovery_score",
      ];
      for (const field of scoreFields) {
        const value = analysis?.[field];
        if (typeof value !== "number" || Number.isNaN(value) || value < 0 || value > 100) {
          throw new HttpError(500, `Invalid score for ${field}`);
        }
      }
      const transcript = typeof analysis?.transcript === "string" ? analysis.transcript.trim() : "";
      if (transcript.length < 10) {
        throw new HttpError(422, "음성이 명확하지 않습니다. 10자 이상 텍스트가 식별되어야 합니다.");
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", data);
      throw new Error("분석 결과를 처리하는 도중 오류가 발생했습니다.");
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("analyze-voice function error:", error);
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : "? ? ?? ??? ??????.";
    return new Response(
      JSON.stringify({ error: message }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
