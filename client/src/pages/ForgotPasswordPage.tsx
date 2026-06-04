import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordService } from "@/services/authService";
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
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/complaintUtils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await forgotPasswordService(email);
      setSuccessMsg(response.message);
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
            Lupa Password
          </CardTitle>
          <CardDescription className="mt-1 text-sm">
            Masukkan alamat email yang terdaftar pada akun Anda
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-3 sm:space-y-3 p-4 sm:p-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
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
              disabled={isLoading || !!successMsg}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Memproses..." : "Kirim Tautan Reset"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Ingat password Anda?{" "}
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
