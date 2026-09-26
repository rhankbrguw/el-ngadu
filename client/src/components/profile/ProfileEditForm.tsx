import { motion } from "framer-motion";
import { useProfileEdit } from "@/hooks/useProfileEdit";
import { Button } from "@/components/ui/button";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Loader2 } from "lucide-react";
import { APP_MESSAGES } from "@/lib/constants/messages";

interface ProfileFieldsProps {
  form: ReturnType<typeof useProfileEdit>["form"];
  user: ReturnType<typeof useProfileEdit>["user"];
}

const ProfileNameField = ({ form, user }: ProfileFieldsProps) => (
  user?.userType === APP_MESSAGES.ROLES.CITIZEN ? (
    <FormField
      control={form.control}
      name="nama"
      render={({ field }) => (
        <FormItem><FormLabel>{APP_MESSAGES.AUTH.NAME_LABEL}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )}
    />
  ) : (
    <FormField
      control={form.control}
      name="nama_petugas"
      render={({ field }) => (
        <FormItem><FormLabel>{APP_MESSAGES.AUTH.NAME_LABEL}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )}
    />
  )
);

const ProfileContactFields = ({ form }: { form: ReturnType<typeof useProfileEdit>["form"] }) => (
  <>
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem><FormLabel>{APP_MESSAGES.AUTH.USERNAME}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="telp"
      render={({ field }) => (
        <FormItem><FormLabel>{APP_MESSAGES.AUTH.TELP_LABEL}</FormLabel><FormControl><PhoneInput value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem><FormLabel>{APP_MESSAGES.AUTH.EMAIL_LABEL}</FormLabel><FormControl><Input {...field} type="email" placeholder={APP_MESSAGES.PROFILE.PLACEHOLDER_EMAIL} /></FormControl><FormMessage /></FormItem>
      )}
    />
  </>
);

export default function ProfileEditForm() {
  const { form, user, onSubmit, isLoading } = useProfileEdit();

  return (
    <Form {...form}>
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileNameField form={form} user={user} />
          <ProfileContactFields form={form} />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {APP_MESSAGES.PROFILE.BTN_SAVE_PROFILE}
          </Button>
        </div>
      </motion.form>
    </Form>
  );
}

