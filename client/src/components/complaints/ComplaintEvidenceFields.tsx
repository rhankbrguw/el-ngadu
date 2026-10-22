import { PENGADUAN_STRINGS } from "@/lib/constants/complaints";
import { FileUploadInput } from "@/components/complaints/FileUploadInput";
import { Image as ImageIcon } from "lucide-react";
import type { useCreateComplaint } from "@/hooks/useCreateComplaint";

interface ComplaintEvidenceFieldsProps {
  fileUpload: ReturnType<typeof useCreateComplaint>["fileUpload"];
  isLoading: boolean;
}

export function ComplaintEvidenceFields({ fileUpload, isLoading }: ComplaintEvidenceFieldsProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5">
      <div className="flex items-center gap-2 pb-1 text-sm font-semibold text-foreground">
        <ImageIcon className="h-4 w-4 text-primary" />
        <span>{PENGADUAN_STRINGS.SECTION_EVIDENCE}</span>
      </div>
      <FileUploadInput
        file={fileUpload.file}
        dragActive={fileUpload.dragActive}
        isLoading={isLoading}
        onDrag={fileUpload.handleDrag}
        onDrop={fileUpload.handleDrop}
        onFileSelect={fileUpload.handleFileSelect}
        onRemoveFile={fileUpload.removeFile}
      />
      <p className="text-xs text-muted-foreground">{PENGADUAN_STRINGS.INFO_FOTO}</p>
    </div>
  );
}
