/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface DemoResponse {
  message: string;
}

export interface CinematographyAnalysis {
  lighting: {
    type: string;
    keyLight: {
      position: string;
      intensity: string;
      color: string;
    };
    fillLight: {
      position: string;
      intensity: string;
    };
    backLight?: {
      position: string;
      purpose: string;
    };
    practicals: string[];
    mood: string;
  };
  camera: {
    focalLength: string;
    aperture: string;
    iso: string;
    shutterSpeed: string;
    movement: string;
    height: string;
  };
  composition: {
    ruleOfThirds: string;
    leadingLines: string;
    symmetry: string;
    depth: string;
    headroom: string;
    lookingRoom: string;
  };
  colorGrading: {
    palette: string;
    contrast: string;
    saturation: string;
    temperature: string;
    style: string;
    lut: string;
  };
  mood: string;
  genre: string;
  references: string[];
}

export interface AnalysisResponse {
  id: string;
  analysis: CinematographyAnalysis;
  imageUrl: string;
}

export interface GuideResponse {
  guide: string;
}

export interface MovieShot {
  id: number;
  title: string;
  year: string;
  backdrop: string | null;
  stills: {
    url: string;
    thumbnail: string;
    aspect: number;
  }[];
}

export interface TMDBResponse {
  movies: MovieShot[];
}
