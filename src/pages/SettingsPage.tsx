import { MainLayout } from "@/components/layout/MainLayout";
import { AppBar } from "@/components/layout/AppBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Bell,
  Mic,
  Shield,
  HelpCircle,
  Phone,
  LogOut,
  Trash2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingItem({ icon, label, description, action, onClick, danger }: SettingItemProps) {
  const content = (
    <div className="flex items-center gap-4 p-4">
      <div className={`${danger ? "text-destructive" : "text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-body-strong ${danger ? "text-destructive" : "text-foreground"}`}>
          {label}
        </p>
        {description && (
          <p className="text-caption text-muted-foreground">{description}</p>
        )}
      </div>
      {action || (onClick && <ChevronRight className="h-5 w-5 text-muted-foreground" />)}
    </div>
  );

  if (onClick) {
    return (
      <button className="w-full text-left hover:bg-secondary/50 transition-colors" onClick={onClick}>
        {content}
      </button>
    );
  }

  return content;
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleDeleteAccount = () => {
    // This would require additional implementation
    console.log("Delete account requested");
  };

  return (
    <MainLayout>
      <AppBar title="설정" />
      
      <div className="px-4 py-4 space-y-4">
        {/* Account Section */}
        <Card className="shadow-elevation-1">
          <CardContent className="p-0">
            <SettingItem
              icon={<User className="h-5 w-5" />}
              label="계정"
              description={user?.email || "로그인이 필요합니다"}
              onClick={!user ? () => navigate("/auth") : undefined}
            />
          </CardContent>
        </Card>

        {/* Permissions Section */}
        <Card className="shadow-elevation-1">
          <CardContent className="p-0">
            <SettingItem
              icon={<Mic className="h-5 w-5" />}
              label="마이크 권한"
              description="음성 녹음에 필요합니다"
              action={<Switch defaultChecked />}
            />
            <Separator />
            <SettingItem
              icon={<Bell className="h-5 w-5" />}
              label="알림"
              description="명상 리마인더, 분석 완료 알림"
              action={<Switch />}
            />
          </CardContent>
        </Card>

        {/* Privacy Section */}
        <Card className="shadow-elevation-1">
          <CardContent className="p-0">
            <SettingItem
              icon={<Shield className="h-5 w-5" />}
              label="개인정보 관리"
              description="데이터 내보내기, 삭제"
              onClick={() => {}}
            />
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="shadow-elevation-1">
          <CardContent className="p-0">
            <SettingItem
              icon={<HelpCircle className="h-5 w-5" />}
              label="도움말 / FAQ"
              onClick={() => {}}
            />
            <Separator />
            <SettingItem
              icon={<Phone className="h-5 w-5" />}
              label="위기 상황 시 도움받기"
              description="전문 상담 기관 연락처"
              action={<ExternalLink className="h-4 w-4 text-muted-foreground" />}
              onClick={() => {}}
            />
          </CardContent>
        </Card>

        {/* Account Actions */}
        {user && (
          <Card className="shadow-elevation-1">
            <CardContent className="p-0">
              <SettingItem
                icon={<LogOut className="h-5 w-5" />}
                label="로그아웃"
                onClick={handleSignOut}
              />
              <Separator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div>
                    <SettingItem
                      icon={<Trash2 className="h-5 w-5" />}
                      label="계정 삭제"
                      description="모든 데이터가 영구적으로 삭제됩니다"
                      danger
                      onClick={() => {}}
                    />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>정말 계정을 삭제할까요?</AlertDialogTitle>
                    <AlertDialogDescription>
                      이 작업은 되돌릴 수 없습니다. 모든 녹음 기록과 분석 결과가 
                      영구적으로 삭제됩니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        )}

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-caption text-muted-foreground">Sound Mind v1.0.0</p>
        </div>
      </div>
    </MainLayout>
  );
}
