import { useState } from "react";
import { X, Key, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export default function APIKeyModal({
  isOpen,
  onClose,
  onSave,
  currentKey,
}: APIKeyModalProps) {
  const [key, setKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (key.trim()) {
      setIsSaving(true);
      setTimeout(() => {
        onSave(key.trim());
        setIsSaving(false);
        onClose();
      }, 300);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && key.trim()) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-primary/20 rounded-lg shadow-2xl shadow-primary/20 max-w-md w-full animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Gemini API Key</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground/70">
            Enter your Google Gemini API key to enable image analysis. Get your key from{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline"
            >
              Google AI Studio
            </a>
          </p>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2 rounded-lg bg-input border border-primary/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-10"
                autoFocus
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {currentKey && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-foreground/70">
                ✓ Key saved (showing last 8 chars: ...
                {currentKey.slice(-8)})
              </p>
            </div>
          )}

          <p className="text-xs text-foreground/50">
            Your key is stored locally in your browser and never sent to our servers.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-primary/10">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!key.trim() || isSaving}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg font-semibold transition-all",
              key.trim()
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            {isSaving ? "Saving..." : "Save Key"}
          </button>
        </div>
      </div>
    </div>
  );
}
