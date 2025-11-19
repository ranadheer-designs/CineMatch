import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, ArrowLeft } from "lucide-react";
import { MovieShot } from "@shared/api";

const ICONIC_MOVIES = [
  "Blade Runner 2049",
  "The Grand Budapest Hotel",
  "Mad Max Fury Road",
  "Her",
  "1917",
  "Dune",
];

export default function ShotLibrary() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MovieShot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);

  useEffect(() => {
    fetchMovies(ICONIC_MOVIES[0]);
  }, []);

  const fetchMovies = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tmdb-shots?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data.movies || []);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchMovies(searchQuery);
    }
  };

  const currentMovie = movies[activeMovieIndex];

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
            <span className="font-semibold">Home</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">Shot Library</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search bar */}
        <div className="mb-12 animate-fade-in">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-input border border-primary/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold"
            >
              Search
            </button>
          </form>

          {/* Quick filter buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {ICONIC_MOVIES.map((movie) => (
              <button
                key={movie}
                onClick={() => fetchMovies(movie)}
                className="px-4 py-2 rounded-lg bg-card/40 border border-primary/20 text-foreground hover:border-primary/50 hover:bg-card/60 transition-all text-sm font-semibold"
              >
                {movie}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="text-foreground">Loading movie shots...</p>
            </div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/60">No movies found</p>
          </div>
        ) : (
          <div className="space-y-12">
            {movies.map((movie, movieIndex) => (
              <div key={movie.id} className="space-y-4 animate-slide-up" style={{ animationDelay: `${movieIndex * 100}ms`, animationFillMode: "both" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {movie.title}
                    </h2>
                    <p className="text-primary text-sm font-semibold">
                      {movie.year}
                    </p>
                  </div>
                </div>

                {/* Movie shots grid */}
                {movie.stills.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {movie.stills.map((still, shotIndex) => (
                      <div
                        key={shotIndex}
                        onClick={() => {
                          // In a real app, this would navigate to analyze that specific shot
                          window.open(still.url, "_blank");
                        }}
                        className="group relative rounded-lg overflow-hidden border border-primary/20 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/20"
                      >
                        <img
                          src={still.thumbnail}
                          alt={`${movie.title} shot ${shotIndex + 1}`}
                          className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <p className="text-white text-sm font-semibold">
                            Click to view
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground/60 text-center py-8">
                    No shots available for this movie
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center space-y-4 animate-fade-in">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold"
          >
            Analyze Your Own Shot
          </button>
          <p className="text-foreground/60 text-sm">
            Find shots that inspire you, then recreate them with our guides
          </p>
        </div>
      </main>
    </div>
  );
}
