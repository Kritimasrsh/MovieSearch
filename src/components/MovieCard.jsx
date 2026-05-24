import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        textDecoration: "none",
        color: "inherit",
      }}
      className="movie-card"
    >
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        style={{ width: "100%", height: "260px", objectFit: "cover" }}
      />

      <div style={{ padding: "15px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h4 style={{ margin: "0 0 8px 0", color: "var(--text-color)" }}>{movie.title}</h4>
        <p style={{ color: "gold", margin: 0, fontWeight: "bold" }}>⭐ {movie.vote_average}</p>
      </div>
    </Link>
  );
}