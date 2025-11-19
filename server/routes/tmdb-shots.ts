import { RequestHandler } from "express";
import { TMDBResponse, MovieShot } from "@shared/api";

const TMDB_API_KEY = "8f762b0d6652aa190f7d851cf27725e1";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  backdrop_path: string | null;
}

interface TMDBSearchResponse {
  results: TMDBMovie[];
}

interface TMDBImagesResponse {
  backdrops: Array<{
    file_path: string;
    aspect_ratio: number;
  }>;
}

export const handleTMDBShots: RequestHandler = async (req, res) => {
  try {
    const { searchParams } = new URL(`http://localhost${req.url}`);
    const query = searchParams.get("query") || "blade runner";
    const page = searchParams.get("page") || "1";

    // Search for movies
    const searchResponse = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query,
      )}&page=${page}`,
    );
    const searchData = (await searchResponse.json()) as TMDBSearchResponse;

    // Get images for top results
    const moviesWithImages = await Promise.all(
      searchData.results.slice(0, 5).map(async (movie) => {
        try {
          const imagesResponse = await fetch(
            `${TMDB_BASE_URL}/movie/${movie.id}/images?api_key=${TMDB_API_KEY}`,
          );
          const imagesData =
            (await imagesResponse.json()) as TMDBImagesResponse;

          const movieShot: MovieShot = {
            id: movie.id,
            title: movie.title,
            year: movie.release_date?.split("-")[0] || "Unknown",
            backdrop: movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : null,
            stills: imagesData.backdrops.slice(0, 10).map((img) => ({
              url: `https://image.tmdb.org/t/p/original${img.file_path}`,
              thumbnail: `https://image.tmdb.org/t/p/w500${img.file_path}`,
              aspect: img.aspect_ratio,
            })),
          };

          return movieShot;
        } catch (error) {
          console.error(`Error fetching images for movie ${movie.id}:`, error);
          return null;
        }
      }),
    );

    const validMovies = moviesWithImages.filter(
      (movie) => movie !== null,
    ) as MovieShot[];

    const result: TMDBResponse = {
      movies: validMovies,
    };

    res.json(result);
  } catch (error) {
    console.error("TMDB fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch movie shots",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
