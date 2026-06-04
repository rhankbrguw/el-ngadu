import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/common/PasswordInput";
import { AUTH_STRINGS } from "@/lib/constants/auth";

/**
 * Properties for the RegisterFormFields component.
 */
interface RegisterFormFieldsProps {
  /** The current values of the form data */
  formData: {
    nik: string;
    nama: string;
    username: string;
    password: string;
    telp: string;
  };
  /** Validation errors for the form fields */
  errors: Record<string, string | undefined>;
  /** Indicates if the form is currently submitting */
  isLoading: boolean;
  /** Handler for input changes */
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Renders the input fields for the registration form.
 *
 * @param props - The properties for the component.
 * @returns The rendered form fields.
 */
export function RegisterFormFields({
  formData,
  errors,
  isLoading,
  handleChange,
}: RegisterFormFieldsProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="nik">{AUTH_STRINGS.NIK_LABEL}</Label>
        <Input
          id="nik"
          placeholder={AUTH_STRINGS.NIK_PLACEHOLDER}
          required
          value={formData.nik}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.nik && <p className="text-xs text-destructive">{errors.nik}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="nama">{AUTH_STRINGS.NAME_LABEL}</Label>
        <Input
          id="nama"
          placeholder={AUTH_STRINGS.NAME_PLACEHOLDER}
          required
          value={formData.nama}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.nama && (
          <p className="text-xs text-destructive">{errors.nama}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="username">{AUTH_STRINGS.USERNAME_LABEL}</Label>
        <Input
          id="username"
          placeholder={AUTH_STRINGS.USERNAME_PLACEHOLDER}
          required
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">{AUTH_STRINGS.PASSWORD_LABEL}</Label>
        <PasswordInput
          id="password"
          placeholder={AUTH_STRINGS.PASSWORD_PLACEHOLDER}
          required
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="telp">{AUTH_STRINGS.TELP_LABEL}</Label>
        <Input
          id="telp"
          type="tel"
          placeholder={AUTH_STRINGS.TELP_PLACEHOLDER}
          required
          value={formData.telp}
          onChange={handleChange}
          disabled={isLoading}
        />
        {errors.telp && (
          <p className="text-xs text-destructive">{errors.telp}</p>
        )}
      </div>

      {errors.form && (
        <p className="text-center text-sm font-medium text-destructive">
          {errors.form}
        </p>
      )}
    </>
  );
}
