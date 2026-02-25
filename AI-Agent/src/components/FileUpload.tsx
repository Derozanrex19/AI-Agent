import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  FolderUp,
  UploadCloud,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  error: string | null;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, onFileRemove, selectedFile, error, disabled }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragActive(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleZoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const validateAndSelect = (file: File) => onFileSelect(file);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const selectedFileExt = selectedFile?.name.split('.').pop()?.toLowerCase() ?? '';

  return (
    <div className="w-full space-y-4">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".xlsx,.xls,.csv"
        onChange={handleChange}
        disabled={disabled}
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            key="dropzone"
          >
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !disabled && inputRef.current?.click()}
              onKeyDown={handleZoneKeyDown}
              role="button"
              tabIndex={disabled ? -1 : 0}
              className={cn(
                'relative isolate overflow-hidden rounded-2xl border border-dashed p-8 transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lifewood-castleton/60',
                isDragActive && 'scale-[1.01] border-lifewood-castleton bg-white/95 shadow-lg',
                !isDragActive && 'border-lifewood-dark-serpent/20 bg-gradient-to-br from-white to-lifewood-paper/40 hover:border-lifewood-castleton/40 hover:shadow-md',
                disabled && 'cursor-not-allowed opacity-55 hover:border-lifewood-dark-serpent/20 hover:shadow-none',
                error && 'border-red-300 from-red-50 to-white hover:border-red-300'
              )}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/80 to-transparent" />

              <div className="relative flex flex-col items-center justify-center text-center">
                <div
                  className={cn(
                    'mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors',
                    isDragActive && 'border-lifewood-castleton/35 bg-lifewood-castleton/12 text-lifewood-castleton',
                    !isDragActive && 'border-lifewood-dark-serpent/15 bg-white text-lifewood-dark-serpent/65',
                    error && 'border-red-300 bg-red-50 text-red-500'
                  )}
                >
                  <UploadCloud className="h-7 w-7" />
                </div>

                <p className="mb-1 text-lg font-semibold text-lifewood-dark-serpent">
                  {isDragActive ? 'Drop file to upload' : 'Upload attendance file'}
                </p>
                <p className="text-sm text-lifewood-dark-serpent/65">
                  Drag and drop your file here, or browse from your computer.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full border border-lifewood-dark-serpent/15 bg-white px-3 py-1 text-xs font-medium text-lifewood-dark-serpent/80">
                    .xlsx
                  </span>
                  <span className="rounded-full border border-lifewood-dark-serpent/15 bg-white px-3 py-1 text-xs font-medium text-lifewood-dark-serpent/80">
                    .xls
                  </span>
                  <span className="rounded-full border border-lifewood-dark-serpent/15 bg-white px-3 py-1 text-xs font-medium text-lifewood-dark-serpent/80">
                    .csv
                  </span>
                  <span className="rounded-full border border-lifewood-dark-serpent/15 bg-white px-3 py-1 text-xs font-medium text-lifewood-dark-serpent/80">
                    Max 10MB
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  className="mt-6 border-lifewood-castleton/35 text-lifewood-castleton hover:bg-lifewood-castleton/8"
                >
                  <FolderUp className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            key="file-preview"
            className={cn(
              'relative rounded-2xl border bg-white p-4 shadow-sm transition-all md:p-5',
              error ? 'border-red-200 bg-red-50/40' : 'border-lifewood-dark-serpent/10'
            )}
          >
            <div className="flex w-full items-start gap-4">
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white',
                  fileTypeColor(selectedFile.name)
                )}
              >
                <FileIcon fileName={selectedFile.name} className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold text-lifewood-dark-serpent md:text-base">
                    {selectedFile.name}
                  </p>
                  <span
                    className={cn(
                      'rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
                      error
                        ? 'border-red-300 bg-red-100/70 text-red-700'
                        : 'border-green-200 bg-green-100/70 text-green-700'
                    )}
                  >
                    {error ? 'Needs attention' : 'Ready'}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-lifewood-dark-serpent/60">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  <span className="uppercase">{selectedFileExt || 'file'}</span>
                  <span>{getFileTypeLabel(selectedFile.name)}</span>
                </div>

                {error && (
                  <div className="mt-2 inline-flex items-center rounded-lg border border-red-200 bg-red-100/50 px-2.5 py-1 text-xs font-medium text-red-700">
                    <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
                    {error}
                  </div>
                )}
              </div>

              {!disabled && (
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                    className="text-lifewood-castleton hover:bg-lifewood-castleton/10 hover:text-lifewood-dark-serpent"
                  >
                    <FolderUp className="mr-1.5 h-4 w-4" />
                    Replace
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemove();
                    }}
                    className="h-8 w-8 rounded-full p-0 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              )}
            </div>

            {!error && (
              <div className="mt-3 inline-flex items-center text-xs font-medium text-lifewood-castleton">
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                File selected successfully.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FileIcon({ fileName, className }: { fileName: string; className?: string }) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return <FileText className={className} />;
  return <FileSpreadsheet className={className} />;
}

function getFileTypeLabel(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return 'CSV Document';
  if (ext === 'xls' || ext === 'xlsx') return 'Excel Spreadsheet';
  return 'Document';
}

function fileTypeColor(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return 'bg-blue-500';
  if (ext === 'xls' || ext === 'xlsx') return 'bg-green-600';
  return 'bg-gray-500';
}
