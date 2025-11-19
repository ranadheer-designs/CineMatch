import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Sparkles, Zap, Settings } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import APIKeyModal from "@/components/APIKeyModal";
import { useApiKey } from "@/hooks/useApiKey";
import { AnalysisResponse } from "@shared/api";

const LOADING_MESSAGES = [
  "Analyzing composition...",
  "Extracting color palette...",
  "Identifying lighting setup...",
  "Detecting camera movement...",
  "Analyzing color grading...",
  "Building analysis...",
];

export default function Homepage() {
  const navigate = useNavigate();
  const { apiKey, setApiKey, hasKey } = useApiKey();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(LOADING_MESSAGES[0]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cycle through loading messages
  const cycleMessages = () => {
    setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    setLoadingStatus(
      LOADING_MESSAGES[(messageIndex + 1) % LOADING_MESSAGES.length],
    );
  };

  const handleImageSelect = async (imageUrl: string) => {
    if (!apiKey) {
      alert(
        "Please configure your Gemini API key first. Click the settings icon above.",
      );
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setMessageIndex(0);
    setLoadingStatus(LOADING_MESSAGES[0]);

    // Cycle loading messages every 2 seconds
    const messageInterval = setInterval(cycleMessages, 2000);

    try {
      const response = await fetch("/api/analyze-shot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, apiKey }),
      });

            // Try to parse response as JSON, handle parsing errors gracefully
      let data: any;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse response as JSON:", jsonError);
        throw new Error("Invalid response from server. Please try again.");
      }

      if (!response.ok) {
        const errorMessage =
          data.details?.message ||
          data.details ||
          data.error ||
          "Failed to analyze image";

        // Check for rate limiting
        if (
          errorMessage.includes("429") ||
          errorMessage.includes("RESOURCE_EXHAUSTED")
        ) {
          throw new Error(
            "API rate limit reached. Please wait a moment and try again."
          );
        }

        throw new Error(errorMessage);

      const data: AnalysisResponse = await response.json();
      clearInterval(messageInterval);
      setIsLoading(false);

      // Navigate to analysis page with data
      navigate("/analysis", { state: { analysis: data } });
    } catch (error) {
      clearInterval(messageInterval);
      setIsLoading(false);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to analyze image";
      console.error("Analysis error:", errorMsg);
      alert(`Analysis failed: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-primary/10 bg-background/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CINEMATCH AI
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`p-2 rounded-lg transition-all font-semibold flex items-center gap-2 ${
                hasKey
                  ? "bg-primary/20 text-primary hover:bg-primary/30"
                  : "bg-secondary/20 text-secondary hover:bg-secondary/30"
              }`}
              title={hasKey ? "API Key configured" : "Configure API Key"}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">
                {hasKey ? "API Key Set" : "Setup API Key"}
              </span>
            </button>
            <button
              onClick={() => navigate("/library")}
              className="px-6 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all font-semibold hover:shadow-lg hover:shadow-primary/20"
            >
              Browse Library
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero section */}
        <div className="text-center mb-12 animate-fade-in space-y-6">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Analyze Every Shot{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Like a Pro
            </span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Unlock the cinematography secrets of your favorite films. Get
            detailed analysis of lighting, camera settings, composition, and
            color grading. Then recreate the magic with our step-by-step guides.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: "AI Analysis",
                desc: "Deep dive into every aspect",
              },
              {
                icon: <Film className="w-5 h-5" />,
                title: "Recreation Guides",
                desc: "Step-by-step instructions",
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Instant Results",
                desc: "Get insights in seconds",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-primary/20 bg-card/40 backdrop-blur-sm animate-slide-up hover:border-primary/40 transition-all duration-300"
                style={{
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="text-primary mb-2 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload section */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          <div className="rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-lg p-8 shadow-2xl shadow-primary/10">
            <ImageUploader
              onImageSelect={handleImageSelect}
              isLoading={isLoading}
              loadingStatus={loadingStatus}
            />
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-16 text-center space-y-4 animate-fade-in">
          <p className="text-foreground/60">
            Upload any cinematography shot to get started
          </p>
          <p className="text-sm text-primary/60">
            Powered by AI • No account required • Instant analysis
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-primary/10 bg-background/50 backdrop-blur-md mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-foreground/60 text-sm">
          <p>CINEMATCH AI • Powered by Gemini Vision • TMDB Integration</p>
        </div>
      </footer>

      {/* API Key Modal */}
      <APIKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={setApiKey}
        currentKey={apiKey}
      />
    </div>
  );
}
