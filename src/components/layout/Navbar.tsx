import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LayoutDashboard, LogOut, UserRound, Settings, Gauge } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/student/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useStorageUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

const BASE_LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/news", label: "الأخبار" },
  { to: "/schedule", label: "الجدول الدراسي" },
  { to: "/unicourses", label: "UniCourses" },
] as const;

const DASHBOARD_LINK = { to: "/dashboard", label: "Dashboard" } as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const LINKS = user ? ([...BASE_LINKS, DASHBOARD_LINK] as const) : BASE_LINKS;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const avatar = useStorageUrl("avatars", profile?.avatar_url);
  const initials = (profile?.full_name || user?.email || "؟").trim().charAt(0);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo size={38} />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-secondary hover:text-primary",
                  pathname === l.to && "bg-secondary text-primary",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {user && <NotificationBell />}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none ring-ring focus-visible:ring-2">
                <Avatar className="size-10 border border-border">
                  {avatar && <AvatarImage src={avatar} alt="صورتك الشخصية" />}
                  <AvatarFallback className="bg-secondary text-sm font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="truncate text-sm font-bold">{profile?.full_name || "طالب HTI"}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex w-full items-center gap-2">
                    <UserRound className="size-4" /> الملف الشخصي
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex w-full items-center gap-2">
                    <Gauge className="size-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex w-full items-center gap-2">
                    <Settings className="size-4" /> الإعدادات
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex w-full items-center gap-2">
                      <LayoutDashboard className="size-4" /> لوحة تحكم الإدارة
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void signOut()} className="gap-2">
                  <LogOut className="size-4" /> تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">تسجيل الدخول</Link>
            </Button>
          )}

          <button
            type="button"
            aria-label="القائمة"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-primary lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="animate-fade-up border-t border-border bg-card lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            <Logo size={34} className="mb-2" />
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary",
                  pathname === l.to && "bg-secondary text-primary",
                )}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <>
                <div className="my-2 h-px bg-border" />
                {[
                  { to: "/dashboard", label: "مهامي" },
                  { to: "/subjects", label: "موادي" },
                  { to: "/notes", label: "ملاحظاتي" },
                  { to: "/dashboard", label: "الإشعارات" },
                  { to: "/profile", label: "الملف الشخصي" },
                ].map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary",
                      pathname === l.to && "bg-secondary text-primary",
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                  className="rounded-xl px-4 py-3 text-start text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary"
                >
                  تسجيل الخروج
                </button>
              </>
            )}
            {!user && (
              <Button asChild className="mt-2">
                <Link to="/auth" onClick={() => setOpen(false)}>
                  تسجيل الدخول
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
