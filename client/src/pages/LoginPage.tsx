import { useLogin } from "@/hooks/useLoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginFormNew";
import { OtpForm } from "@/components/auth/OtpFormNew";

export default function LoginPage() {
 const {
 step,
 error,
 isLoading,
 showSuccessDialog,
 setShowSuccessDialog,
 handleLogin,
 handleVerifyOtp
 } = useLogin();

 return (
 <>
 <div className="flex min-h-screen items-center justify-center bg-background p-4">
 <Card className="w-full max-w-sm md:max-w-md overflow-hidden">
 <CardHeader className="text-center">
 <CardTitle className="text-xl sm:text-xl font-bold">
 Selamat Datang Kembali!
 </CardTitle>
 <CardDescription className="mt-1 text-sm">
 Masukkan data diri anda untuk melanjutkan
 </CardDescription>
 </CardHeader>
 
 <CardContent className="p-4 sm:p-5 pt-0">
 <AnimatePresence mode="wait">
 {step === "login" ? (
 <LoginForm 
 key="login"
 onSubmit={handleLogin}
 isLoading={isLoading}
 error={error}
 />
 ) : (
 <OtpForm 
 key="otp"
 onSubmit={handleVerifyOtp}
 isLoading={isLoading}
 error={error}
 />
 )}
 </AnimatePresence>
 </CardContent>
 </Card>
 </div>

 <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
 <DialogContent className="sm:max-w-xs">
 <DialogHeader className="text-center pb-2">
 <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-success/20 dark:bg-success/20 mb-2">
 <CheckCircle className="h-5 w-5 text-success dark:text-success/80" />
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
