import { motion } from "framer-motion";
import { usePasswordChange } from "@/hooks/usePasswordChange";
import { Button } from "@/components/ui/button";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/common/PasswordInput";
import { Loader2 } from "lucide-react";
import { APP_MESSAGES } from "@/lib/constants/messages";

interface PasswordFieldsProps {
  form: ReturnType<typeof usePasswordChange>["form"];
}

const OldPasswordField = ({ form }: PasswordFieldsProps) => (
  <FormField
    control={form.control}
    name="old_password"
    render={({ field }) => (
      <FormItem>
        <FormLabel>{APP_MESSAGES.AUTH.OLD_PASSWORD}</FormLabel>
        <FormControl><PasswordInput placeholder={APP_MESSAGES.PROFILE.PLACEHOLDER_PASSWORD} {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const NewPasswordFields = ({ form }: PasswordFieldsProps) => (
  <>
    <FormField
      control={form.control}
      name="new_password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{APP_MESSAGES.AUTH.NEW_PASSWORD}</FormLabel>
          <FormControl><PasswordInput placeholder={APP_MESSAGES.PROFILE.PLACEHOLDER_MIN_8} {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="confirm_password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{APP_MESSAGES.AUTH.CONFIRM_PASSWORD}</FormLabel>
          <FormControl><PasswordInput placeholder={APP_MESSAGES.PROFILE.PLACEHOLDER_NEW_PASSWORD} {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

export default function PasswordChangeForm() {
  const { form, onSubmit, isLoading } = usePasswordChange();

  return (
    <Form {...form}>
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OldPasswordField form={form} />
          <div className="hidden sm:block" />
          <NewPasswordFields form={form} />
        </div>
        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
        )}
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {APP_MESSAGES.PROFILE.BTN_CHANGE_PASSWORD}
          </Button>
        </div>
      </motion.form>
    </Form>
  );
}

