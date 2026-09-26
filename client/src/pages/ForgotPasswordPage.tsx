import { Link } from "react-router-dom";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { Button } from "@/components/ui/button";
import {
 Card,
 CardContent,
 CardDescription,
 CardFooter,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { APP_MESSAGES } from "@/lib/constants/messages";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ForgotFieldsProps {
  email: string;
  setEmail: (v: string) => void;
  isLoading: boolean;
  error: string | null;
  successMsg: string | null;
}

const ForgotPasswordFormFields = ({ email, setEmail, isLoading, error, successMsg }: ForgotFieldsProps) => (
  <CardContent className="space-y-3 sm:space-y-3 p-4 sm:p-5">
    <div className="space-y-1.5">
      <Label htmlFor="email" className="text-sm">{APP_MESSAGES.AUTH.EMAIL_LABEL}</Label>
      <Input
        id="email"
        type="email"
        placeholder={APP_MESSAGES.AUTH.PLACEHOLDER_EMAIL}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        className="h-10 text-sm"
      />
    </div>
    {error && (
      <div role="alert" className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 font-medium text-destructive text-sm">
        {error}
      </div>
    )}
    {successMsg && (
      <div role="alert" className="rounded-md border border-success/20 bg-success/10 p-2.5 font-medium text-success-foreground text-sm dark:text-success/80">
        {successMsg}
      </div>
    )}
  </CardContent>
);

const ForgotPasswordFooter = ({ isLoading, isSuccess }: { isLoading: boolean; isSuccess: boolean }) => (
  <CardFooter className="flex flex-col gap-3 px-4 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-2">
    <Button type="submit" className="w-full h-10 text-sm font-semibold" disabled={isLoading || isSuccess}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? APP_MESSAGES.COMMON.WAIT : "Kirim Tautan Reset"}
    </Button>
    <p className="text-sm text-center text-muted-foreground">
      Ingat password Anda?{" "}
      <Link to="/login" className="font-medium underline hover:text-primary">
        Kembali ke Login
      </Link>
    </p>
  </CardFooter>
);

export default function ForgotPasswordPage() {
  const { email, setEmail, error, successMsg, isLoading, handleSubmit } = useForgotPassword();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm md:max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-xl font-bold">{APP_MESSAGES.AUTH.FORGOT_PASSWORD_TITLE || "Lupa Password"}</CardTitle>
          <CardDescription className="mt-1 text-sm">{APP_MESSAGES.AUTH.FORGOT_PASSWORD_DESC || "Masukkan alamat email yang terdaftar pada akun Anda"}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <ForgotPasswordFormFields email={email} setEmail={setEmail} isLoading={isLoading} error={error} successMsg={successMsg} />
          <ForgotPasswordFooter isLoading={isLoading} isSuccess={!!successMsg} />
        </form>
      </Card>
    </div>
  );
}

