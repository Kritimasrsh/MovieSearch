import axios from "axios";


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchData = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
};

export const getTrendingMovies = async () => {
  const data = await fetchData(
    `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`
  );
  return data.results || [];
};

export const searchMovies = async (query) => {
  const data = await fetchData(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
  );
  return data.results || [];
};

export const getTopRatedMovies = async () => {
  const data = await fetchData(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
  );
  return data.results || [];
};

export const getUpcomingMovies = async () => {
  const data = await fetchData(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`
  );
  return data.results || [];
};

export const getMovieCredits = async (id) => {
  const data = await fetchData(
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`
  );
  return data.cast || [];
};

export const getSimilarMovies = async (id) => {
  const data = await fetchData(
    `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`
  );
  return data.results || [];
};