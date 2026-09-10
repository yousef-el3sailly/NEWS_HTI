import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { friendlyError, formatSpecialization } from "@/lib/format";
import { SPECIALIZATION_OPTIONS, BATCH_OPTIONS } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — NEWS" },
      { name: "description", content: "سجّل دخولك أو أنشئ حسابك في مجتمع طلاب HTI." },
      { property: "og:title", content: "تسجيل الدخول — NEWS" },
      { property: "og:description", content: "سجّل دخولك أو أنشئ حسابك في مجتمع طلاب HTI." },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email({ message: "بريد إلكتروني غير صالح" }).max(255),
  password: z.string().min(6, { message: "كلمة المرور 6 أحرف على الأقل" }).max(72),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(3, { message: "الاسم قصير جداً" }).max(100),
  specialization: z.string().trim().min(1, { message: "اختر التخصص" }),
  batch: z.string().trim().min(1, { message: "اختر الدفعة" }),
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) void navigate({ to: "/", replace: true });
  }, [loading, session, navigate]);

  const [signIn, setSignIn] = useState({ email: "", password: "" });
  const [signUp, setSignUp] = useState({
    fullName: "",
    email: "",
    password: "",
    specialization: "",
    batch: "",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse(signIn);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "بيانات غير صحيحة");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      toast.error(friendlyError(error));
      return;
    }
    toast.success("أهلاً بعودتك 👋");
    void navigate({ to: "/", replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse(signUp);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "بيانات غير صحيحة");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: parsed.data.fullName,
          specialization: parsed.data.specialization,
          batch: parsed.data.batch,
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(friendlyError(error));
      return;
    }
    toast.success("تم إنشاء حسابك بنجاح 🎉");
    void navigate({ to: "/", replace: true });
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("تعذّر تسجيل الدخول بجوجل، حاول تاني.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/", replace: true });
  };

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size={64} withText={false} />
          <h1 className="mt-4 text-2xl font-extrabold text-foreground">مرحباً بك في NEWS</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            انضم لمجتمع طلاب HTI وابدأ تنظّم دراستك.
          </p>
        </div>

        <div className="surface-card p-6">
          <Tabs defaultValue="signin">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">حساب جديد</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="si-email">البريد الإلكتروني</Label>
                  <Input
                    id="si-email"
                    type="email"
                    autoComplete="email"
                    value={signIn.email}
                    onChange={(e) => setSignIn({ ...signIn, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="si-password">كلمة المرور</Label>
                  <Input
                    id="si-password"
                    type="password"
                    autoComplete="current-password"
                    value={signIn.password}
                    onChange={(e) => setSignIn({ ...signIn, password: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
                  دخول
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="su-name">الاسم بالكامل</Label>
                  <Input
                    id="su-name"
                    value={signUp.fullName}
                    onChange={(e) => setSignUp({ ...signUp, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">البريد الإلكتروني</Label>
                  <Input
                    id="su-email"
                    type="email"
                    autoComplete="email"
                    value={signUp.email}
                    onChange={(e) => setSignUp({ ...signUp, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>التخصص</Label>
                    <Select
                      value={signUp.specialization}
                      onValueChange={(v) => setSignUp({ ...signUp, specialization: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALIZATION_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {formatSpecialization(s)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الدفعة</Label>
                    <Select
                      value={signUp.batch}
                      onValueChange={(v) => setSignUp({ ...signUp, batch: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        {BATCH_OPTIONS.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-password">كلمة المرور</Label>
                  <Input
                    id="su-password"
                    type="password"
                    autoComplete="new-password"
                    value={signUp.password}
                    onChange={(e) => setSignUp({ ...signUp, password: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <UserPlus className="size-4" />
                  )}
                  إنشاء الحساب
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">أو</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={busy}>
            المتابعة باستخدام Google
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          بالمتابعة أنت توافق على قواعد مجتمع{" "}
          <Link to="/about" className="font-semibold text-primary">
            NEWS
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
