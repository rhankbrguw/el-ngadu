import { Link } from "react-router-dom";
import { useRegisterForm } from "@/hooks/useRegisterForm";
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
import { RegisterFormFields } from "./RegisterFormFields";
import { RegisterSuccessDialog } from "./RegisterSuccessDialog";
import { AUTH_STRINGS } from "@/lib/constants/auth";
import { Form } from "@/components/ui/form";
import { motion } from "framer-motion";

export function RegisterForm() {
 const {
 form,
 otpCode,
 setOtpCode,
 step,
 serverError,
 isLoading,
 showSuccessDialog,
 onSubmit,
 handleVerifyOtp,
 setShowSuccessDialog,
 handleDialogRedirect,
 } = useRegisterForm();

 return (
 <>
 <Card className="w-full max-w-sm md:max-w-md">
 <CardHeader className="text-center">
 <CardTitle className="text-xl">{AUTH_STRINGS.REGISTER_TITLE}</CardTitle>
 <CardDescription>
 {AUTH_STRINGS.REGISTER_DESC}
 </CardDescription>
 </CardHeader>
 {step === "register" ? (
 <Form {...form}>
 <motion.form
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 onSubmit={form.handleSubmit(onSubmit)}
 >
 <CardContent className="grid gap-4 p-4 pt-0">
 <RegisterFormFields form={form} isLoading={isLoading} />
 {serverError && (
 <p className="text-center text-sm font-medium text-destructive">
 {serverError}
 </p>
 )}
 </CardContent>
 <CardFooter className="flex flex-col gap-4 px-4 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-2">
 <Button type="submit" className="w-full" disabled={isLoading}>
 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
 {isLoading ? AUTH_STRINGS.BTN_PROCESSING : AUTH_STRINGS.BTN_REGISTER}
 </Button>
 <p className="text-center text-xs text-muted-foreground">
 {AUTH_STRINGS.ALREADY_HAVE_ACCOUNT}
 <Link
 to="/login"
 className="font-medium underline hover:text-primary"
 >
 {AUTH_STRINGS.LOGIN_LINK}
 </Link>
 </p>
 </CardFooter>
 </motion.form>
 </Form>
 ) : (
 <motion.form
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 onSubmit={handleVerifyOtp}
 noValidate
 >
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
 {serverError && (
 <div
 role="alert"
 className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 font-medium text-destructive text-sm"
 >
 {serverError}
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
 </motion.form>
 )}
 </Card>

 <RegisterSuccessDialog
 open={showSuccessDialog}
 onOpenChange={setShowSuccessDialog}
 onContinue={handleDialogRedirect}
 />
 </>
 );
}
