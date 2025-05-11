"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadAttachment, deleteAttachment } from "@/actions/attachments";

interface NoteAttachment {
  id: number;
  note_id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: string;
  updated_at: string;
}

interface NoteAttachmentsProps {
  noteId: string;
  initialAttachments?: NoteAttachment[];
}

export function NoteAttachments({
  noteId,
  initialAttachments = [],
}: NoteAttachmentsProps) {
  const [attachments, setAttachments] =
    useState<NoteAttachment[]>(initialAttachments);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("noteId", noteId);

        const result = await uploadAttachment(formData);
        if (result) {
          setAttachments((prev) => [...prev, result as NoteAttachment]);
          toast.success(`Arquivo ${file.name} enviado com sucesso!`);
        }
      }
    } catch (error) {
      toast.error("Erro ao enviar arquivo");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (attachmentId: number) => {
    try {
      await deleteAttachment(attachmentId.toString());
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
      toast.success("Arquivo removido com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover arquivo");
      console.error("Delete error:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="relative"
          disabled={isUploading}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            multiple
            disabled={isUploading}
          />
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Enviando..." : "Adicionar anexos"}
        </Button>
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Anexos</h4>
          <div className="grid gap-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {attachment.original_filename}
                  </a>
                  <span className="text-xs text-muted-foreground">
                    ({formatFileSize(attachment.size)})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(attachment.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
