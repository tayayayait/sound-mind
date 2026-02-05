import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface MainLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function MainLayout({ children, showNav = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-neutral-10">
      <main className={showNav ? "pb-20" : ""}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
