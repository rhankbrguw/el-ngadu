import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createPengaduanService } from "@/services/complaintService";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getErrorMessage } from "@/lib/complaintUtils";
import { PENGADUAN_STRINGS } from "@/lib/constants/complaints";

import { FileUploadInput } from "@/components/complaints/FileUploadInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";

/**
 * Form component to create a new pengaduan (complaint).
 * Handles file uploading, form state, and submission.
 */
export function CreateComplaintForm() {
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    file,
    dragActive,
    handleFileSelect,
    handleDrag,
    handleDrop,
    removeFile,
  } = useFileUpload();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user?.userType !== "masyarakat") {
      const msg = PENGADUAN_STRINGS.ERROR_ONLY_MASYARAKAT;
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      await createPengaduanService({
        judul,
        isi,
        foto_bukti: file || undefined,
      });
      toast.success(PENGADUAN_STRINGS.SUCCESS_CREATED);
      navigate("/dashboard/history");
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage);
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-xl font-semibold">
            {PENGADUAN_STRINGS.FORM_TITLE}
          </CardTitle>
          <CardDescription>
            {PENGADUAN_STRINGS.FORM_DESCRIPTION}
          </CardDescription>
        </CardHeader>
        <CardContent className="-mt-2 space-y-3 p-4">
          <div className="space-y-2">
            <Label htmlFor="judul">{PENGADUAN_STRINGS.LABEL_JUDUL}</Label>
            <Input
              id="judul"
              type="text"
              placeholder={PENGADUAN_STRINGS.PLACEHOLDER_JUDUL}
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isi">{PENGADUAN_STRINGS.LABEL_ISI}</Label>
            <Textarea
              id="isi"
              placeholder={PENGADUAN_STRINGS.PLACEHOLDER_ISI}
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              disabled={isLoading}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{PENGADUAN_STRINGS.LABEL_FOTO}</Label>
            <FileUploadInput
              file={file}
              dragActive={dragActive}
              isLoading={isLoading}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
              onRemoveFile={removeFile}
            />
            <p className="text-xs text-muted-foreground">
              {PENGADUAN_STRINGS.INFO_FOTO}
            </p>
          </div>

          {formError && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm font-medium text-destructive">
                  {formError}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="px-4 pb-6">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !judul.trim() || !isi.trim()}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading
              ? PENGADUAN_STRINGS.BTN_SUBMIT_LOADING
              : PENGADUAN_STRINGS.BTN_SUBMIT}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
