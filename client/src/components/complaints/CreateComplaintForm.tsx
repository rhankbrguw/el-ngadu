import { motion } from "framer-motion";
import { useCreateComplaint } from "@/hooks/useCreateComplaint";
import { PENGADUAN_STRINGS } from "@/lib/constants/complaints";
import { ComplaintPrimaryFields } from "@/components/complaints/ComplaintPrimaryFields";
import { ComplaintLocationFields } from "@/components/complaints/ComplaintLocationFields";
import { ComplaintMetaFields } from "@/components/complaints/ComplaintMetaFields";
import { ComplaintEvidenceFields } from "@/components/complaints/ComplaintEvidenceFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader2, AlertCircle } from "lucide-react";

const FormErrorBanner = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 flex items-center gap-2">
    <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
    <p className="text-xs sm:text-sm font-medium text-destructive">{message}</p>
  </div>
);

const FormCardHeader = () => (
  <CardHeader className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border/40 space-y-1">
    <CardTitle className="text-base sm:text-lg font-semibold">
      {PENGADUAN_STRINGS.FORM_TITLE}
    </CardTitle>
    <CardDescription className="text-xs sm:text-sm">
      {PENGADUAN_STRINGS.FORM_DESCRIPTION}
    </CardDescription>
  </CardHeader>
);

const FormCardFooter = ({ isLoading }: { isLoading: boolean }) => (
  <CardFooter className="px-5 sm:px-6 pb-6 pt-3 border-t border-border/40">
    <Button type="submit" size="lg" className="w-full font-semibold shadow-xs" disabled={isLoading}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? PENGADUAN_STRINGS.BTN_SUBMIT_LOADING : PENGADUAN_STRINGS.BTN_SUBMIT}
    </Button>
  </CardFooter>
);

export function CreateComplaintForm() {
  const { form, formError, fileUpload, onSubmit, isLoading } = useCreateComplaint();

  return (
    <Card className="border shadow-xs">
      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={onSubmit}>
        <FormCardHeader />
        <CardContent className="px-4 sm:px-6 py-6 space-y-4">
          <Form {...form}>
            <ComplaintPrimaryFields form={form} isLoading={isLoading} />
            <ComplaintLocationFields form={form} isLoading={isLoading} />
            <ComplaintMetaFields form={form} isLoading={isLoading} />
          </Form>
          <ComplaintEvidenceFields fileUpload={fileUpload} isLoading={isLoading} />
          {formError && <FormErrorBanner message={formError} />}
        </CardContent>
        <FormCardFooter isLoading={isLoading} />
      </motion.form>
    </Card>
  );
}
