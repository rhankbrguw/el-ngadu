import type { UseFormReturn } from "react-hook-form";
import type { PetugasPayload } from "@/lib/validators";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "@/components/common/PasswordInput";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { PETUGAS_DIALOG_STRINGS } from "@/lib/constants/admin";

/**
 * Props for the OfficerDialogForm component.
 */
interface OfficerDialogFormProps {
  /** The initialized hook form instance for PetugasPayload */
  form: UseFormReturn<PetugasPayload>;
  /** Callback fired when the form is submitted */
  onSubmit: (data: PetugasPayload) => Promise<void>;
  /** Indicates whether the form is in edit mode */
  isEditMode: boolean;
}

/**
 * Form component for adding or editing a Petugas.
 */
export function OfficerDialogForm({
  form,
  onSubmit,
  isEditMode,
}: OfficerDialogFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 pt-4">
        <FormField
          control={form.control}
          name="nama_petugas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{PETUGAS_DIALOG_STRINGS.LABEL_NAMA}</FormLabel>
              <FormControl>
                <Input placeholder={PETUGAS_DIALOG_STRINGS.PLACEHOLDER_NAMA} {...field} />
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
              <FormLabel>{PETUGAS_DIALOG_STRINGS.LABEL_USERNAME}</FormLabel>
              <FormControl>
                <Input placeholder={PETUGAS_DIALOG_STRINGS.PLACEHOLDER_USERNAME} {...field} />
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
              <FormLabel>{PETUGAS_DIALOG_STRINGS.LABEL_PASSWORD}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={
                    isEditMode
                      ? PETUGAS_DIALOG_STRINGS.PLACEHOLDER_PASSWORD_EDIT
                      : PETUGAS_DIALOG_STRINGS.PLACEHOLDER_PASSWORD_ADD
                  }
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
              <FormLabel>{PETUGAS_DIALOG_STRINGS.LABEL_TELP}</FormLabel>
              <FormControl>
                <Input placeholder={PETUGAS_DIALOG_STRINGS.PLACEHOLDER_TELP} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{PETUGAS_DIALOG_STRINGS.LABEL_LEVEL}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={PETUGAS_DIALOG_STRINGS.PLACEHOLDER_LEVEL} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="petugas">{PETUGAS_DIALOG_STRINGS.LEVEL_PETUGAS}</SelectItem>
                  <SelectItem value="admin">{PETUGAS_DIALOG_STRINGS.LEVEL_ADMIN}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {PETUGAS_DIALOG_STRINGS.BUTTON_SAVE}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
