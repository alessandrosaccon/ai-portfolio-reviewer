'use client'

import { useCallback, useState } from 'react'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onClear: () => void
  disabled?: boolean
}

const ACCEPTED_TYPES = ['application/pdf']
const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export function UploadZone({ onFileSelect, selectedFile, onClear, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validateAndSelect(file: File) {
    setError(null)
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only PDF files are supported.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`File must be under ${MAX_SIZE_MB}MB.`)
      return
    }
    onFileSelect(file)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const file = e.dataTransfer.files[0]
      if (file) validateAndSelect(file)
    },
    [disabled]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) validateAndSelect(file)
    e.target.value = ''
  }

  if (selectedFile) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(0)} KB &middot; PDF
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload CV PDF"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            document.getElementById('cv-upload-input')?.click()
          }
        }}
        className={cn(
          'relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <input
          id="cv-upload-input"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-hidden="true"
        />
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background transition-colors',
            isDragging && 'border-primary/50 bg-primary/10'
          )}
        >
          <Upload
            className={cn(
              'h-5 w-5 transition-colors',
              isDragging ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragging ? 'Drop your CV here' : 'Drop your CV or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground">PDF only &middot; max {MAX_SIZE_MB}MB</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}
    </div>
  )
}
