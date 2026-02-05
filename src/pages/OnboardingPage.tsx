import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Mic, Shield, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type OnboardingStep = "welcome" | "privacy" | "microphone" | "guide";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);

  // If user is logged in and has completed onboarding, redirect
  // For now, we'll just check if they're logged in
  if (user) {
    // Check localStorage for onboarding completion
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (onboardingComplete) {
      navigate("/", { replace: true });
      return null;
    }
  }

  const handleNext = () => {
    switch (step) {
      case "welcome":
        setStep("privacy");
        break;
      case "privacy":
        setStep("microphone");
        break;
      case "microphone":
        setStep("guide");
        break;
      case "guide":
        localStorage.setItem("onboardingComplete", "true");
        navigate(user ? "/" : "/auth");
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case "privacy":
        setStep("welcome");
        break;
      case "microphone":
        setStep("privacy");
        break;
      case "guide":
        setStep("microphone");
        break;
    }
  };

  const handleSkip = () => {
    localStorage.setItem("onboardingComplete", "true");
    navigate(user ? "/" : "/auth");
  };

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicPermissionGranted(true);
    } catch (error) {
      console.error("Microphone permission denied:", error);
    }
  };

  const canProceed = () => {
    switch (step) {
      case "welcome":
        return true;
      case "privacy":
        return agreedTerms && agreedPrivacy;
      case "microphone":
        return true; // Can skip, but encourage permission
      case "guide":
        return true;
    }
  };

  const progressWidth = {
    welcome: "25%",
    privacy: "50%",
    microphone: "75%",
    guide: "100%",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: progressWidth[step] }}
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between p-4">
        {step !== "welcome" ? (
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
        <Button variant="ghost" onClick={handleSkip}>
          건너뛰기
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {step === "welcome" && (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary flex items-center justify-center animate-breathe">
              <Sparkles className="h-12 w-12 text-primary-foreground" />
            </div>
            <h1 className="text-h1 text-foreground mb-4">Sound Mind에 오신 것을 환영해요</h1>
            <p className="text-body text-muted-foreground max-w-sm">
              당신의 목소리로 마음 상태를 이해하고,
              <br />
              맞춤 명상으로 더 나은 하루를 만들어요.
            </p>
          </div>
        )}

        {step === "privacy" && (
          <div className="w-full max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-h1 text-foreground text-center mb-2">약관 동의</h1>
            <p className="text-body text-muted-foreground text-center mb-8">
              안전한 서비스 이용을 위해 동의해주세요.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                <Checkbox
                  id="terms"
                  checked={agreedTerms}
                  onCheckedChange={(checked) => setAgreedTerms(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="terms" className="text-body-strong cursor-pointer">
                    이용약관 동의 (필수)
                  </Label>
                  <p className="text-caption text-muted-foreground mt-1">
                    서비스 이용에 필요한 기본 약관입니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-card rounded-lg border">
                <Checkbox
                  id="privacy"
                  checked={agreedPrivacy}
                  onCheckedChange={(checked) => setAgreedPrivacy(checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="privacy" className="text-body-strong cursor-pointer">
                    개인정보 처리방침 동의 (필수)
                  </Label>
                  <p className="text-caption text-muted-foreground mt-1">
                    음성 데이터는 분석 후 안전하게 저장되며, 
                    언제든 삭제할 수 있어요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "microphone" && (
          <div className="text-center w-full max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center">
              <Mic className={cn("h-10 w-10", micPermissionGranted ? "text-success-600" : "text-primary")} />
            </div>
            <h1 className="text-h1 text-foreground mb-2">마이크 권한</h1>
            <p className="text-body text-muted-foreground mb-8">
              음성을 녹음하여 마음 상태를 분석해요.
              <br />
              녹음은 분석 외에 사용되지 않아요.
            </p>

            {micPermissionGranted ? (
              <div className="p-4 bg-success-50 rounded-lg text-success-600 mb-4">
                ✓ 마이크 권한이 허용되었어요
              </div>
            ) : (
              <Button onClick={requestMicPermission} size="lg" className="w-full mb-4">
                <Mic className="mr-2 h-5 w-5" />
                마이크 권한 허용하기
              </Button>
            )}

            <p className="text-caption text-muted-foreground">
              나중에 설정에서 변경할 수 있어요.
            </p>
          </div>
        )}

        {step === "guide" && (
          <div className="text-center w-full max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-100 flex items-center justify-center">
              <div className="flex items-end gap-1 h-8">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-primary rounded-full animate-waveform"
                    style={{ 
                      height: `${20 + i * 8}px`,
                      animationDelay: `${i * 100}ms` 
                    }}
                  />
                ))}
              </div>
            </div>
            <h1 className="text-h1 text-foreground mb-2">준비 완료!</h1>
            <p className="text-body text-muted-foreground mb-8">
              조용한 곳에서 10~20초 정도
              <br />
              오늘 하루에 대해 이야기해보세요.
            </p>

            <div className="text-left space-y-3 p-4 bg-card rounded-lg border mb-4">
              <p className="text-caption text-muted-foreground">💡 녹음 팁</p>
              <ul className="text-body text-foreground space-y-2">
                <li>• 편안하게 자연스러운 목소리로</li>
                <li>• 오늘 느낀 감정을 자유롭게</li>
                <li>• 완벽하지 않아도 괜찮아요</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 pt-0">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          size="lg"
          className="w-full"
        >
          {step === "guide" ? "시작하기" : "다음"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
