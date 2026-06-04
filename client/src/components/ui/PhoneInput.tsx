import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PhoneInputProps
 extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
 onChange?: (value: string) => void;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
 ({ className, onChange, value, ...props }, ref) => {
 // Convert incoming raw string into formatted +62 string if needed
 const formatValue = (val: string) => {
 if (!val) return "";
 // Remove all non-digits
 let digits = val.replace(/\D/g, "");
 
 // If it starts with 0, remove it (because we prepend 62)
 if (digits.startsWith("0")) {
 digits = digits.substring(1);
 }
 // If it starts with 62, don't duplicate
 if (digits.startsWith("62")) {
 digits = digits.substring(2);
 }

 if (digits.length === 0) return "";

 // Format as +62-8XX-XXXX-XXXX
 let formatted = "+62";
 if (digits.length > 0) {
 formatted += "-" + digits.substring(0, 3);
 }
 if (digits.length > 3) {
 formatted += "-" + digits.substring(3, 7);
 }
 if (digits.length > 7) {
 formatted += "-" + digits.substring(7, 12);
 }
 return formatted;
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const raw = e.target.value;
 // Remove all non-digit characters to keep raw value pure
 let digits = raw.replace(/\D/g, "");
 
 // Handle the leading 0 scenario for raw value
 if (digits.startsWith("0")) {
 digits = digits.substring(1);
 }
 if (digits.startsWith("62")) {
 digits = digits.substring(2);
 }

 // Store raw value with 62 prepended for backend
 const backendValue = digits ? "62" + digits : "";
 
 if (onChange) {
 onChange(backendValue);
 }
 };

 // Format the display value based on the pure backend value
 const displayValue = formatValue(value as string);

 return (
 <Input
 type="tel"
 ref={ref}
 value={displayValue}
 onChange={handleChange}
 placeholder="+62-8XX-XXXX-XXXX"
 className={cn("font-mono", className)}
 {...props}
 />
 );
 }
);

PhoneInput.displayName = "PhoneInput";
