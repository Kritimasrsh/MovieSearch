import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setMovies(saved);
  }, []);

  return (
    <div style={{ padding: "20px", background: "#0f0f0f", minHeight: "100vh", color: "white" }}>
      <h1>❤️ My Favorites</h1>

      {movies.length === 0 ? (
        <p>No favorites yet</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}