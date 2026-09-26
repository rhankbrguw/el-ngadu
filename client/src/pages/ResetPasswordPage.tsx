import { Link } from "react-router-dom";
import { useResetPassword } from "@/hooks/useResetPassword";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/common/PasswordInput";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ResetFieldsProps {
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  isLoading: boolean;
  token: string | null;
  error: string | null;
  successMsg: string | null;
}

const ResetPasswordFormFields = ({ password, setPassword, confirmPassword, setConfirmPassword, isLoading, token, error, successMsg }: ResetFieldsProps) => (
  <CardContent className="space-y-3 sm:space-y-3 p-4 sm:p-5">
    {!token && (
      <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 font-medium text-destructive text-sm text-center">
        Tautan reset tidak valid atau tidak ditemukan.
      </div>
    )}
    <div className="space-y-1.5">
      <Label htmlFor="password" className="text-sm">{APP_MESSAGES.AUTH.NEW_PASSWORD}</Label>
      <PasswordInput id="password" placeholder={APP_MESSAGES.AUTH.PLACEHOLDER_MIN_8} required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading || !token} className="h-10 text-sm" />
    </div>
    <div className="space-y-1.5">
      <Label htmlFor="confirmPassword" className="text-sm">{APP_MESSAGES.AUTH.CONFIRM_PASSWORD}</Label>
      <PasswordInput id="confirmPassword" placeholder={APP_MESSAGES.AUTH.PLACEHOLDER_REPEAT_NEW_PASS} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading || !token} className="h-10 text-sm" />
    </div>
    {error && <div role="alert" className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 font-medium text-destructive text-sm">{error}</div>}
    {successMsg && <div role="alert" className="rounded-md border border-success/20 bg-success/10 p-2.5 font-medium text-success-foreground text-sm dark:text-success/80">{successMsg}</div>}
  </CardContent>
);

const ResetPasswordFooter = ({ isLoading, isSuccess, hasToken }: { isLoading: boolean; isSuccess: boolean; hasToken: boolean }) => (
  <CardFooter className="flex flex-col gap-3 px-4 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-2">
    <Button type="submit" className="w-full h-10 text-sm font-semibold" disabled={isLoading || isSuccess || !hasToken}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? APP_MESSAGES.COMMON.WAIT : "Simpan Password Baru"}
    </Button>
    <p className="text-sm text-center text-muted-foreground">
      Batal reset? <Link to="/login" className="font-medium underline hover:text-primary">Kembali ke Login</Link>
    </p>
  </CardFooter>
);

export default function ResetPasswordPage() {
  const reset = useResetPassword();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm md:max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-xl font-bold">Atur Ulang Password</CardTitle>
          <CardDescription className="mt-1 text-sm">Masukkan kata sandi baru Anda</CardDescription>
        </CardHeader>
        <form onSubmit={reset.handleSubmit} noValidate>
          <ResetPasswordFormFields
            password={reset.password}
            setPassword={reset.setPassword}
            confirmPassword={reset.confirmPassword}
            setConfirmPassword={reset.setConfirmPassword}
            isLoading={reset.isLoading}
            token={reset.token}
            error={reset.error}
            successMsg={reset.successMsg}
          />
          <ResetPasswordFooter isLoading={reset.isLoading} isSuccess={!!reset.successMsg} hasToken={!!reset.token} />
        </form>
      </Card>
    </div>
  );
}

