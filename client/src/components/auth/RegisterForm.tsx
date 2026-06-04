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
import { Loader2 } from "lucide-react";
import { RegisterFormFields } from "./RegisterFormFields";
import { RegisterSuccessDialog } from "./RegisterSuccessDialog";
import { AUTH_STRINGS } from "@/lib/constants/auth";

/**
 * The main registration form component for new users.
 *
 * @returns The rendered registration form with its success dialog.
 */
export function RegisterForm() {
  const {
    formData,
    errors,
    isLoading,
    showSuccessDialog,
    handleChange,
    handleRegister,
    setShowSuccessDialog,
    handleDialogRedirect,
  } = useRegisterForm();

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{AUTH_STRINGS.REGISTER_TITLE}</CardTitle>
          <CardDescription>
            {AUTH_STRINGS.REGISTER_DESC}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="grid gap-4 p-4 pt-0">
            <RegisterFormFields
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              handleChange={handleChange}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 p-4">
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
        </form>
      </Card>

      <RegisterSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onContinue={handleDialogRedirect}
      />
    </>
  );
}
