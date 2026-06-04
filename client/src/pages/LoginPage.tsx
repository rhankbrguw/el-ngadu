import { Link } from "react-router-dom";
import { useLogin } from "@/hooks/useLoginForm";
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
import { PasswordInput } from "@/components/common/PasswordInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const {
    formData,
    otpCode,
    setOtpCode,
    step,
    error,
    isLoading,
    showSuccessDialog,
    setShowSuccessDialog,
    handleChange,
    handleLogin,
    handleVerifyOtp
  } = useLogin();

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
        <Card className="w-full max-w-sm md:max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-xl font-bold">
              Selamat Datang Kembali!
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              Masukkan data diri anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          {step === "login" ? (
            <form onSubmit={handleLogin} noValidate>
              <CardContent className="space-y-3 sm:space-y-3 p-4 sm:p-5">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-sm">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username anda"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="username"
                    className="h-10 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm">
                    Password
                  </Label>
                  <PasswordInput
                    id="password"
                    placeholder="Masukkan password anda"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="current-password"
                    className="h-10 text-sm"
                  />
                  <div className="flex justify-end pt-0.5">
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-muted-foreground hover:text-primary hover:underline"
                    >
                      Lupa Password?
                    </Link>
                  </div>
                </div>
                {error && (
                  <div
                    role="alert"
                    className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 font-medium text-destructive text-sm"
                  >
                    {error}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-3 px-4 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-2">
                <Button
                  type="submit"
                  className="w-full h-10 text-sm font-semibold"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Memproses..." : "Masuk"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Belum punya akun?{" "}
                  <Link
                    to="/register"
                    className="font-medium underline hover:text-primary"
                  >
                    Daftar di sini
                  </Link>
                </p>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} noValidate>
              <CardContent className="space-y-3 sm:space-y-3 p-4 sm:p-5">
                <div className="space-y-1.5">
                  <Label htmlFor="otpCode" className="text-sm text-center block mb-2">
                    Kode OTP telah dikirim ke email Anda.
                  </Label>
                  <Input
                    id="otpCode"
                    type="text"
                    placeholder="Masukkan 6 digit OTP"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                    disabled={isLoading}
                    className="h-10 text-center tracking-[0.5em] font-bold text-lg placeholder:tracking-normal placeholder:font-normal placeholder:text-sm"
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
              </CardContent>
              <CardFooter className="flex flex-col gap-3 px-4 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-2">
                <Button
                  type="submit"
                  className="w-full h-10 text-sm font-semibold"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-base">Login Berhasil!</DialogTitle>
            <DialogDescription className="text-sm">
              Anda akan diarahkan dalam sesaat...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
