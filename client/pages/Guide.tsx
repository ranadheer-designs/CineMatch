import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

function Guide() {
  const location = useLocation();
  const navigate = useNavigate();
  const guide = location.state?.guide as string;
  const imageUrl = location.state?.imageUrl as string;

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60">No guide data available</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="relative border-b border-primary/10 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">Recreation Guide</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Image reference */}
        {imageUrl && (
          <div className="mb-12 animate-fade-in">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Reference Image
            </h2>
            <div className="rounded-xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
              <img
                src={imageUrl}
                alt="Reference shot"
                className="w-full max-h-96 object-cover"
              />
            </div>
          </div>
        )}

        {/* Guide content */}
        <div className="animate-slide-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          <div className="rounded-lg border border-primary/20 bg-card/40 backdrop-blur-sm p-8">
            <div className="space-y-4 text-foreground/90">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-primary mt-6 mb-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-foreground/90 leading-relaxed mb-3">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-foreground/90 space-y-2 mb-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-foreground/90 space-y-2 mb-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground/90">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-primary font-bold">{children}</strong>
                  ),
                  code: ({ children }) => (
                    <code className="bg-background/50 px-2 py-1 rounded text-primary/80 font-mono text-sm">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-foreground/70">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {guide}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center space-y-4 animate-fade-in">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold"
          >
            Analyze Another Shot
          </button>
          <p className="text-foreground/60 text-sm">
            Ready to recreate this cinematic magic?
          </p>
        </div>
      </main>
    </div>
  );
}

export default Guide;
