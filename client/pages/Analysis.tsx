import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Film,
  Lightbulb,
  Camera,
  Grid3x3,
  Palette,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import AnalysisSection from "@/components/AnalysisSection";
import { useApiKey } from "@/hooks/useApiKey";
import { AnalysisResponse, GuideResponse } from "@shared/api";

export default function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const { apiKey } = useApiKey();
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);
  const analysisData = location.state?.analysis as AnalysisResponse;

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60">No analysis data available</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleGenerateGuide = async () => {
    if (!apiKey) {
      alert("API key is required. Please go back to home and configure it.");
      navigate("/");
      return;
    }

    setIsLoadingGuide(true);
    try {
      const response = await fetch("/api/generate-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: analysisData.analysis, apiKey }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate guide");
      }

      const data: GuideResponse = await response.json();
      setIsLoadingGuide(false);

      navigate("/guide", {
        state: { guide: data.guide, imageUrl: analysisData.imageUrl },
      });
    } catch (error) {
      setIsLoadingGuide(false);
      console.error("Guide generation error:", error);
      alert("Failed to generate guide. Please try again.");
    }
  };

  const { analysis, imageUrl } = analysisData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="relative border-b border-primary/10 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">
            Analysis Results
          </h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Image showcase */}
        <div className="mb-12 animate-fade-in">
          <div className="rounded-xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
            <img
              src={imageUrl}
              alt="Analyzed shot"
              className="w-full max-h-96 object-cover"
            />
          </div>
        </div>

        {/* Analysis grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Lighting Analysis */}
          <AnalysisSection
            title="Lighting Setup"
            icon={<Lightbulb />}
            delay={1}
          >
            <div className="space-y-3">
              <div>
                <p className="text-sm text-primary font-semibold">Type</p>
                <p className="text-foreground">{analysis.lighting.type}</p>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">Key Light</p>
                <p className="text-foreground text-sm">
                  {analysis.lighting.keyLight.position} •{" "}
                  {analysis.lighting.keyLight.intensity} •{" "}
                  {analysis.lighting.keyLight.color}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">Fill Light</p>
                <p className="text-foreground text-sm">
                  {analysis.lighting.fillLight.position} •{" "}
                  {analysis.lighting.fillLight.intensity}
                </p>
              </div>
              {analysis.lighting.backLight && (
                <div>
                  <p className="text-sm text-primary font-semibold">
                    Back Light
                  </p>
                  <p className="text-foreground text-sm">
                    {analysis.lighting.backLight.position}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-primary font-semibold">Mood</p>
                <p className="text-foreground">{analysis.lighting.mood}</p>
              </div>
            </div>
          </AnalysisSection>

          {/* Camera Settings */}
          <AnalysisSection title="Camera Settings" icon={<Camera />} delay={2}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-primary font-semibold">
                  Focal Length
                </p>
                <p className="text-foreground">{analysis.camera.focalLength}</p>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">Aperture</p>
                <p className="text-foreground">{analysis.camera.aperture}</p>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">ISO</p>
                <p className="text-foreground">{analysis.camera.iso}</p>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">
                  Shutter Speed
                </p>
                <p className="text-foreground">
                  {analysis.camera.shutterSpeed}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-primary font-semibold">Movement</p>
                <p className="text-foreground">{analysis.camera.movement}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-primary font-semibold">Height</p>
                <p className="text-foreground">{analysis.camera.height}</p>
              </div>
            </div>
          </AnalysisSection>

          {/* Composition */}
          <AnalysisSection title="Composition" icon={<Grid3x3 />} delay={3}>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-primary font-semibold">
                  Rule of Thirds
                </p>
                <p className="text-foreground text-sm">
                  {analysis.composition.ruleOfThirds}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">Symmetry</p>
                <p className="text-foreground">
                  {analysis.composition.symmetry}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">Depth</p>
                <p className="text-foreground text-sm">
                  {analysis.composition.depth}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">Headroom</p>
                <p className="text-foreground">
                  {analysis.composition.headroom}
                </p>
              </div>
            </div>
          </AnalysisSection>

          {/* Color Grading */}
          <AnalysisSection title="Color Grading" icon={<Palette />} delay={4}>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-primary font-semibold">Palette</p>
                <p className="text-foreground text-sm">
                  {analysis.colorGrading.palette}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-primary font-semibold">Contrast</p>
                  <p className="text-foreground">
                    {analysis.colorGrading.contrast}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary font-semibold">
                    Saturation
                  </p>
                  <p className="text-foreground">
                    {analysis.colorGrading.saturation}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">
                  Temperature
                </p>
                <p className="text-foreground text-sm">
                  {analysis.colorGrading.temperature}
                </p>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">Style</p>
                <p className="text-foreground text-sm">
                  {analysis.colorGrading.style}
                </p>
              </div>
            </div>
          </AnalysisSection>

          {/* Overall Mood & Genre */}
          <AnalysisSection title="Vibe & References" icon={<Film />} delay={5}>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-primary font-semibold">
                  Overall Mood
                </p>
                <p className="text-foreground">{analysis.mood}</p>
              </div>
              <div>
                <p className="text-sm text-primary font-semibold">Genre</p>
                <p className="text-foreground">{analysis.genre}</p>
              </div>
              {analysis.references.length > 0 && (
                <div>
                  <p className="text-sm text-primary font-semibold">
                    References
                  </p>
                  <ul className="text-foreground text-sm space-y-1">
                    {analysis.references.slice(0, 3).map((ref, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-primary">•</span> {ref}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AnalysisSection>
        </div>

        {/* CTA Button */}
        <div
          className="flex justify-center animate-slide-up"
          style={{ animationDelay: "600ms", animationFillMode: "both" }}
        >
          <button
            onClick={handleGenerateGuide}
            disabled={isLoadingGuide}
            className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingGuide ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Guide...
              </>
            ) : (
              <>
                <Film className="w-5 h-5" />
                Get Recreation Guide
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
