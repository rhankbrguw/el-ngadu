import React from "react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/common/PasswordInput";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { AUTH_STRINGS } from "@/lib/constants/auth";
import {
 FormField,
 FormItem,
 FormLabel,
 FormControl,
 FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { RegisterFormValues } from "@/lib/validators/auth";

interface RegisterFormFieldsProps {
 form: UseFormReturn<RegisterFormValues>;
 isLoading: boolean;
}

export function RegisterFormFields({
 form,
 isLoading,
}: RegisterFormFieldsProps) {
 return (
 <>
 <FormField
 control={form.control}
 name="nik"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{AUTH_STRINGS.NIK_LABEL}</FormLabel>
 <FormControl>
 <Input
 placeholder={AUTH_STRINGS.NIK_PLACEHOLDER}
 disabled={isLoading}
 {...field}
 onChange={(e) => {
 const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
 field.onChange(val);
 }}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="nama"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{AUTH_STRINGS.NAME_LABEL}</FormLabel>
 <FormControl>
 <Input
 placeholder={AUTH_STRINGS.NAME_PLACEHOLDER}
 disabled={isLoading}
 {...field}
 onChange={(e) => {
 const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
 field.onChange(val);
 }}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="username"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{AUTH_STRINGS.USERNAME_LABEL}</FormLabel>
 <FormControl>
 <Input
 placeholder={AUTH_STRINGS.USERNAME_PLACEHOLDER}
 disabled={isLoading}
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="email"
 render={({ field }) => (
 <FormItem>
 <FormLabel>Email</FormLabel>
 <FormControl>
 <Input
 type="email"
 placeholder="contoh@gmail.com"
 disabled={isLoading}
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="password"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{AUTH_STRINGS.PASSWORD_LABEL}</FormLabel>
 <FormControl>
 <PasswordInput
 placeholder={AUTH_STRINGS.PASSWORD_PLACEHOLDER}
 disabled={isLoading}
 {...field}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="telp"
 render={({ field }) => (
 <FormItem>
 <FormLabel>{AUTH_STRINGS.TELP_LABEL}</FormLabel>
 <FormControl>
 <PhoneInput
 disabled={isLoading}
 {...field}
 onChange={(val) => {
 const filtered = val.replace(/[^0-9]/g, "").slice(0, 15);
 field.onChange(filtered);
 }}
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </>
 );
}
