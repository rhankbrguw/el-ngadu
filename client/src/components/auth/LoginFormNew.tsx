import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/common/PasswordInput";
import { loginSchema } from "@/lib/validators/auth";
import type { LoginFormValues } from "@/lib/validators/auth";

interface LoginFormProps {
 onSubmit: (data: LoginFormValues) => void;
 isLoading: boolean;
 error: string | null;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
 const {
 register,
 handleSubmit,
 formState: { errors },
 } = useForm<LoginFormValues>({
 resolver: zodResolver(loginSchema),
 });

 return (
 <motion.form
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 20 }}
 onSubmit={handleSubmit(onSubmit)}
 noValidate
 className="space-y-4"
 >
 <div className="space-y-1.5">
 <Label htmlFor="username" className="text-sm">Username</Label>
 <Input
 id="username"
 placeholder="Masukkan username anda"
 disabled={isLoading}
 autoComplete="username"
 className="h-10 text-sm"
 {...register("username")}
 />
 {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
 </div>

 <div className="space-y-1.5">
 <Label htmlFor="password" className="text-sm">Password</Label>
 <PasswordInput
 id="password"
 placeholder="Masukkan password anda"
 disabled={isLoading}
 autoComplete="current-password"
 className="h-10 text-sm"
 {...register("password")}
 />
 {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
 <div className="flex justify-end pt-1">
 <Link to="/forgot-password" className="text-xs font-medium text-muted-foreground hover:text-primary hover:underline">
 Lupa Password?
 </Link>
 </div>
 </div>

 {error && (
 <div role="alert" className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 font-medium text-destructive text-sm">
 {error}
 </div>
 )}

 <div className="pt-2">
 <Button type="submit" className="w-full h-10 text-sm font-semibold" disabled={isLoading}>
 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
 {isLoading ? "Memproses..." : "Masuk"}
 </Button>
 </div>

 <p className="text-sm text-center text-muted-foreground pt-2">
 Belum punya akun?{" "}
 <Link to="/register" className="font-medium underline hover:text-primary">
 Daftar di sini
 </Link>
 </p>
 </motion.form>
 );
}
