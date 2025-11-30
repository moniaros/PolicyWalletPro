import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Image, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "success" | "error";
  progress: number;
  url?: string;
}

interface PolicyDocumentsUploadProps {
  policyId: number;
  policyType: string;
  onUploadComplete?: (files: UploadedFile[]) => void;
}

export function PolicyDocumentsUpload({ 
  policyId, 
  policyType,
  onUploadComplete 
}: PolicyDocumentsUploadProps) {
  const { t } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(t('documents.unsupportedFileType', { type: file.type }));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t('documents.fileTooLarge'));
        return;
      }

      const newFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
      };

      setUploadedFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      simulateUpload(newFile);
    });
  };

  const simulateUpload = (file: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, progress, status: progress < 100 ? "uploading" : "success" }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        // Generate mock URL
        const mockUrl = `https://example.com/documents/${file.name}`;
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, url: mockUrl } : f
          )
        );
        toast.success(t('documents.uploadSuccess', { name: file.name }));
        onUploadComplete?.(uploadedFiles.filter(f => f.status === "success"));
      }
    }, 200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.info(t('documents.fileRemoved'));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type === "application/pdf") return FileText;
    return File;
  };

  return (
    <Card className="border-2 border-dashed border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t('documents.uploadDocuments')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragging 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className={`
              h-16 w-16 rounded-full flex items-center justify-center
              ${isDragging ? "bg-primary/20" : "bg-muted"}
              transition-colors
            `}>
              <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="font-semibold text-base mb-1">
                {isDragging ? t('documents.dropHere') : t('documents.clickOrDrag')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('documents.supportedFormats')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('documents.maxFileSize')}
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {t('documents.uploadedFiles', { count: uploadedFiles.length })}
            </p>
            {uploadedFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileIcon className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      {file.status === "uploading" && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <div className="flex-1 max-w-[100px]">
                            <Progress value={file.progress} className="h-1.5" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {file.progress}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === "uploading" && (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    )}
                    {file.status === "success" && (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {t('common.uploaded')}
                      </Badge>
                    )}
                    {file.status === "error" && (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {t('common.error')}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Document Types Suggestion */}
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {t('documents.suggestedDocuments')}
          </p>
          <div className="flex flex-wrap gap-2">
            {getSuggestedDocuments(policyType, t).map((doc, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                {doc}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getSuggestedDocuments(policyType: string, t: any): string[] {
  const suggestions: Record<string, string[]> = {
    "Health": [
      t('documents.policySchedule'),
      t('documents.medicalNetworkList'),
      t('documents.claimForm'),
      t('documents.idCard')
    ],
    "Auto": [
      t('documents.policySchedule'),
      t('documents.greenCard'),
      t('documents.vehicleRegistration'),
      t('documents.claimForm')
    ],
    "Home & Liability": [
      t('documents.policySchedule'),
      t('documents.enfiaCertificate'),
      t('documents.propertyDeed'),
      t('documents.claimForm')
    ],
    "Investment Life": [
      t('documents.policySchedule'),
      t('documents.beneficiaryForm'),
      t('documents.taxCertificate'),
      t('documents.fundStatement')
    ],
    "Pet Insurance": [
      t('documents.policySchedule'),
      t('documents.vetRecords'),
      t('documents.petVaccination'),
      t('documents.claimForm')
    ],
  };

  return suggestions[policyType] || [
    t('documents.policySchedule'),
    t('documents.claimForm'),
    t('documents.idCard')
  ];
}


