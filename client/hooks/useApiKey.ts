import { useState, useEffect } from "react";

const API_KEY_STORAGE_KEY = "cinematch_gemini_api_key";

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKeyState(savedKey);
    }
    setIsLoaded(true);
  }, []);

  const setApiKey = (key: string) => {
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
      setApiKeyState(key.trim());
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKeyState("");
  };

  return {
    apiKey,
    setApiKey,
    clearApiKey,
    isLoaded,
    hasKey: apiKey.length > 0,
  };
}
