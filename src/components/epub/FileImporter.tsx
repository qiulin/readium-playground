import { useState, useRef, useCallback } from 'react'
import { validateEpub } from '#/services/epub/parser'

interface FileImporterProps {
  onFileSelected: (file: File) => void
  isLoading?: boolean
}

export function FileImporter({ onFileSelected, isLoading }: FileImporterProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      setError(null)
      const validation = validateEpub(file)

      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        return
      }

      onFileSelected(file)
    },
    [onFileSelected]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFile(files[0])
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".epub"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />

      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          <p className="text-gray-600">Importing...</p>
        </div>
      ) : (
        <>
          <div className="text-4xl mb-4">📚</div>
          <p className="text-lg font-medium text-gray-700">
            Drop an EPUB file here
          </p>
          <p className="text-gray-500 mt-1">or click to browse</p>
        </>
      )}

      {error && (
        <p className="text-red-500 mt-4 text-sm">{error}</p>
      )}
    </div>
  )
}
