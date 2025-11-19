import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  isLoading?: boolean;
  loadingStatus?: string;
}

export default function ImageUploader({
  onImageSelect,
  isLoading = false,
  loadingStatus = "Analyzing your image...",
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageSelect(imageUrl.trim());
    }
  };

  return (
    <div className="w-full">
      {imagePreview && !isLoading && (
        <div className="mb-6 rounded-lg overflow-hidden border border-primary/20">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 p-12 rounded-lg border border-primary/20 bg-card/50">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-foreground font-semibold">{loadingStatus}</p>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a minute...
            </p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-primary/30 bg-card/30 hover:border-primary/50",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className="w-10 h-10 text-primary" />
            </div>

            <div className="text-center space-y-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary hover:text-primary/80 font-semibold transition-colors">
                  Upload a cinematography shot
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileInput}
                  accept="image/*"
                  ref={fileInputRef}
                />
              </label>
              <p className="text-foreground/70">or drag and drop</p>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              PNG, JPG, GIF up to 20MB
            </p>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-card text-muted-foreground text-sm">
                  Or paste image URL
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleUrlSubmit();
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-input border border-primary/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                onClick={handleUrlSubmit}
                disabled={!imageUrl.trim()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                Analyze
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
