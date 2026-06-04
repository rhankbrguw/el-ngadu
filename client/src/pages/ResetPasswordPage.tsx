import { useState, type FormEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordInput } from "@/components/common/PasswordInput";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/complaintUtils";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Tautan reset password tidak valid.");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await resetPasswordService(password, token);
      setSuccessMsg(response.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <Card className="w-full max-w-sm md:max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-xl font-bold">
            Atur Ulang Password
          </CardTitle>
          <CardDescription className="mt-1 text-sm">
            Masukkan kata sandi baru Anda
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-3 sm:space-y-3 p-4 sm:p-5">
            {!token && (
               <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 font-medium text-destructive text-sm text-center">
                 Tautan reset tidak valid atau tidak ditemukan.
               </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">
                Kata Sandi Baru
              </Label>
              <PasswordInput
                id="password"
                placeholder="Minimal 8 karakter"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !token}
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm">
                Konfirmasi Kata Sandi
              </Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Ulangi kata sandi baru"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading || !token}
                className="h-10 text-sm"
              />
            </div>
            {error && (
              <div
                role="alert"
                className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 font-medium text-destructive text-sm"
              >
                {error}
              </div>
            )}
            {successMsg && (
              <div
                role="alert"
                className="rounded-md border border-green-500/20 bg-green-500/10 p-2.5 font-medium text-green-700 text-sm dark:text-green-400"
              >
                {successMsg}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 px-4 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-2">
            <Button
              type="submit"
              className="w-full h-10 text-sm font-semibold"
              disabled={isLoading || !!successMsg || !token}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Batal reset?{" "}
              <Link
                to="/login"
                className="font-medium underline hover:text-primary"
              >
                Kembali ke Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
