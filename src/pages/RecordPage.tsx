import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Square, Play, Pause, Activity, History, Leaf, User, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav"; // Import BottomNav directly if needed, or use MainLayout logic

type ScreenState = "idle" | "recording" | "paused" | "processing";

export default function RecordPage() {
  const MIN_RECORD_SECONDS = 10;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [screenState, setScreenState] = useState<ScreenState>("idle");
  const [showTips, setShowTips] = useState(false);

  const {
    isRecording,
    isPaused,
    seconds,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    hasPermission,
    requestPermission,
    error,
  } = useAudioRecorder();

  const handleMainButtonPress = async () => {
    if (screenState === "idle") {
      // Check permission first
      if (hasPermission === false) {
        const granted = await requestPermission();
        if (!granted) return;
      }

      await startRecording();
      setScreenState("recording");
    } else if (screenState === "recording") {
      // Stop and process
      const duration = seconds;
      setScreenState("processing");
      const blob = await stopRecording();

      if (blob) {
        if (duration < MIN_RECORD_SECONDS) {
          setScreenState("idle");
          toast.error("최소 10초 이상 녹음해야 분석할 수 있어요.");
          return;
        }
        await processRecording(blob, duration);
      } else {
        setScreenState("idle");
        toast.error("녹음 데이터를 생성할 수 없습니다. 다시 시도해주세요.");
      }
    } else if (screenState === "paused") {
      resumeRecording();
      setScreenState("recording");
    }
  };

  const handlePause = () => {
    if (isPaused) {
      resumeRecording();
      setScreenState("recording");
    } else {
      pauseRecording();
      setScreenState("paused");
    }
  };

  const processRecording = async (blob: Blob, duration: number) => {
    try {
      let currentUser = user;
      let isGuest = false;

      // Guest handling logic
      if (!currentUser) {
        isGuest = true;
      }

      let recordingId: string | null = null;

      if (currentUser && !isGuest) {
        const { data: recording, error: recordingError } = await supabase
          .from("recordings")
          .insert({
            user_id: currentUser.id,
            duration_seconds: duration,
            status: "analyzing",
          })
          .select()
          .single();

        if (recordingError) throw recordingError;
        recordingId = recording.id;
      }

      const readBlobAsBase64 = (input: Blob) =>
        new Promise<{ base64Audio: string; mimeType: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            try {
              const result = reader.result as string | null;
              if (!result) {
                reject(new Error("녹음된 음성 데이터를 읽을 수 없습니다."));
                return;
              }
              const base64Audio = result.split(",")[1];
              if (!base64Audio) {
                reject(new Error("녹음된 데이터를 변환할 수 없습니다."));
                return;
              }
              resolve({
                base64Audio,
                mimeType: input.type || "audio/webm",
              });
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = () => reject(new Error("녹음된 음성 데이터를 읽을 수 없습니다."));
          reader.readAsDataURL(input);
        });

      const { base64Audio, mimeType } = await readBlobAsBase64(blob);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase 환경 변수를 찾을 수 없습니다. .env 파일을 확인해주세요.");
      }

      // Direct fetch to avoid gateway issues observed with invoke()
      const res = await fetch(`${supabaseUrl}/functions/v1/analyze-voice`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio: base64Audio,
          mimeType: mimeType,
          duration,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        let message = "분석 요청을 처리할 수 없습니다.";
        try {
          const parsed = JSON.parse(text);
          if (parsed?.error) message = parsed.error;
        } catch {
          if (text) message = text;
        }
        throw new Error(message);
      }

      const analysis = await res.json();

      if (currentUser && !isGuest && recordingId) {
        const { data: analysisData, error: analysisError } = await supabase
          .from("analyses")
          .insert({
            recording_id: recordingId,
            user_id: currentUser.id,
            overall_score: analysis.overall_score,
            tension_score: analysis.tension_score,
            vitality_score: analysis.vitality_score,
            focus_score: analysis.focus_score,
            recovery_score: analysis.recovery_score,
            summary: analysis.summary,
            advice: analysis.advice,
          })
          .select()
          .single();

        if (analysisError) throw analysisError;

        await supabase
          .from("recordings")
          .update({ status: "completed" })
          .eq("id", recordingId);

        navigate(`/result/${analysisData.id}`);
      } else {
        navigate(`/result/guest`, { state: { analysis } });
      }

    } catch (error: any) {
      console.error("Error processing recording:", error);
      setScreenState("idle");
      toast.error(error.message ?? "네트워크 응답을 처리할 수 없습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-beige text-primary font-sans relative overflow-hidden flex flex-col items-center">
        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-300/10 rounded-full blur-3xl -z-10" />

        {/* Header */}
        <div className="w-full flex items-center justify-between p-6 z-10 max-w-md">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 backdrop-blur-sm">
                <Leaf className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">SoundMind</h1>
            <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-primary/5 cursor-pointer backdrop-blur-sm" onClick={() => navigate('/settings')}>
                <User className="w-6 h-6 text-primary" />
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-md px-6">
            
            {/* Permission Request State */}
            {hasPermission === false && !isRecording && (
                <div className="flex flex-col items-center text-center z-20">
                     <div className="w-20 h-20 rounded-full bg-warning-50 flex items-center justify-center mb-6">
                        <Mic className="h-10 w-10 text-warning-600" />
                     </div>
                     <h2 className="text-2xl font-bold mb-2 text-primary">Microphone permission required</h2>
                     <p className="text-primary/60 mb-6">Please allow microphone access to start recording.</p>
                     <button onClick={requestPermission} className="px-6 py-3 bg-primary text-beige rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                        Allow access
                     </button>
                </div>
            )}

            {/* Normal State */}
            {(hasPermission !== false || isRecording) && (
                <>
                    {/* Status Text */}
                    <div className="text-center mb-16 z-20 transition-all duration-500">
                        <h2 className="text-3xl font-bold mb-3 text-primary tracking-tight">
                            {screenState === "idle" ? "Open up your mind" :
                             screenState === "recording" ? "Recording" :
                             screenState === "processing" ? "Analyzing" : "Paused"}
                        </h2>
                        <p className="text-primary/60 font-medium text-lg">
                            {screenState === "idle" ? "How was your day?" :
                             screenState === "recording" ? "Speak comfortably." :
                             screenState === "processing" ? "Please wait a moment..." : "Press the button to resume."}
                        </p>
                    </div>

                    {/* Pulse Button Container */}
                    <div className="relative flex items-center justify-center mb-12">
                        {/* Outer Rings - Animated */}
                        <div className={cn("absolute rounded-full border border-primary/10 transition-all duration-1000 ease-out", 
                            isRecording ? "w-80 h-80 opacity-100 animate-pulse-soft" : "w-64 h-64 opacity-50 scale-90")} />
                        <div className={cn("absolute rounded-full bg-primary/5 transition-all duration-1000 ease-out delay-75", 
                            isRecording ? "w-72 h-72 opacity-100 animate-pulse-soft" : "w-56 h-56 opacity-0 scale-90")} />

                        {/* Main Button */}
                        <button
                            onClick={handleMainButtonPress}
                            disabled={screenState === 'processing'}
                            className={cn(
                                "relative z-30 w-56 h-56 rounded-full shadow-2xl flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-[1.02] active:scale-95",
                                isRecording ? "bg-forest shadow-forest/30" : "bg-primary shadow-primary/30",
                                screenState === 'processing' && "opacity-80 scale-95 cursor-wait"
                            )}
                        >
                            {screenState === 'processing' ? (
                                <Loader2 className="w-16 h-16 text-beige animate-spin" />
                            ) : isRecording ? (
                                <>
                                    <Square className="w-14 h-14 mb-4 text-beige fill-current" />
                                    <span className="text-xl font-bold text-beige tracking-wide">Stop</span>
                                </>
                            ) : (
                                <>
                                    <Mic className="w-16 h-16 mb-4 text-beige" />
                                    <span className="text-xl font-bold text-beige tracking-wide">Record</span>
                                </>
                            )}

                        </button>
                    </div>

                    {/* Timer & Controls */}
                    <div className="h-20 flex items-center justify-center gap-6 z-20">
                         {screenState === 'idle' ? (
                             <button 
                                onClick={() => setShowTips(!showTips)}
                                className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-sm font-medium px-4 py-2 rounded-full hover:bg-primary/5"
                             >
                                <Info className="w-4 h-4" />
                                <span>Show recording tips</span>
                             </button>
                         ) : (screenState === "recording" || screenState === "paused") && (
                             <div className="flex items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                 <button onClick={handlePause} className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center text-primary border border-primary/10 hover:bg-white transition-colors">
                                     {isPaused ? <Play className="w-5 h-5 ml-1" /> : <Pause className="w-5 h-5" />}
                                 </button>
                                 <div className="text-3xl font-mono font-bold text-primary tabular-nums">
                                    {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
                                 </div>
                             </div>
                         )}
                    </div>
                </>
            )}

            {/* Tips Popover */}
            {showTips && screenState === 'idle' && (
                <div className="absolute bottom-32 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-primary/5 max-w-xs text-center z-40 animate-in zoom-in-95 duration-200">
                    <p className="text-sm text-primary font-medium mb-1">Recording tips</p>
                    <p className="text-xs text-primary/70 leading-relaxed">
                        Record in a quiet place for at least 10 seconds.
                        <br/>Speak naturally for a clearer analysis.
                    </p>
                </div>
            )}

        </div>

        {/* Bottom Cards Removed */}

        {/* Bottom Navigation spacer if needed, or include BottomNav */}
        <div className="w-full max-w-md fixed bottom-0">
             <BottomNav />
        </div>
    </div>
  );
}


