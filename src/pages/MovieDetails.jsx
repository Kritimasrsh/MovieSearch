import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [providers, setProviders] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [movieRes, videoRes, providerRes, creditsRes, similarRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/${id}`, { params: { api_key: API_KEY } }),
          axios.get(`${BASE_URL}/movie/${id}/videos`, { params: { api_key: API_KEY } }),
          axios.get(`${BASE_URL}/movie/${id}/watch/providers`, { params: { api_key: API_KEY } }),
          axios.get(`${BASE_URL}/movie/${id}/credits`, { params: { api_key: API_KEY } }),
          axios.get(`${BASE_URL}/movie/${id}/similar`, { params: { api_key: API_KEY } }),
        ]);

        setMovie(movieRes.data);

        const trailerVideo = videoRes.data.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailer(trailerVideo || null);

        setProviders(providerRes.data.results?.US || null); 
        
        setCast(creditsRes.data.cast?.slice(0, 10) || []); // Top 10 actors
        setSimilar(similarRes.data.results || []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0); // Scroll to top when changing movies
  }, [id]);

  if (loading)
    return <p style={center}>🎬 Loading movie...</p>;

  if (!movie)
    return <p style={center}>Movie not found</p>;

  return (
    <div style={page}>
      {/*  back */}
      <button style={backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div style={container}>
        {/*  poster */}
        <img
          src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
          style={poster}
          alt={movie.title}
        />

        {/* info */}
        <div style={info}>
          <h1 style={{ marginBottom: "5px" }}>{movie.title}</h1>
          <p style={{ color: "gold", margin: "0 0 15px 0", fontSize: "18px" }}>⭐ {movie.vote_average}</p>
          <p style={{ lineHeight: "1.6", color: "var(--text-color)" }}>{movie.overview}</p>

          {/* trailer*/}
          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noreferrer"
              style={trailerBtn}
            >
              ▶ Watch Trailer
            </a>
          )}

          {/* watch links */}
          <h3 style={{ marginTop: "35px", color: "var(--text-secondary)" }}>📺 Where to Watch</h3>
          {providers?.flatrate ? (
            <div style={providersRow}>
              {providers.flatrate.map((p) => (
                <a
                  key={p.provider_id}
                  href={providers.link}
                  target="_blank"
                  rel="noreferrer"
                  style={providerCard}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${p.logo_path}`}
                    style={{ width: "40px", borderRadius: "8px" }}
                  />
                  <p style={{ fontSize: "12px", margin: "5px 0 0 0" }}>{p.provider_name}</p>
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-secondary)" }}>
              No streaming available in your region
            </p>
          )}
        </div>
      </div>

      {/* cast */}
      {cast.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", color: "var(--text-secondary)" }}>Top Cast</h2>
          <div style={scrollRow} className="hide-scrollbar">
            {cast.map((actor) => (
              <div key={actor.id} style={castCard}>
                {actor.profile_path ? (
                  <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} style={castImg} alt={actor.name} />
                ) : (
                  <div style={{...castImg, background: "var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center"}}>👤</div>
                )}
                <p style={{ fontWeight: "bold", margin: "10px 0 5px 0", fontSize: "14px" }}>{actor.name}</p>
                <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "12px" }}>{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* similar movies*/}
      {similar.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <h2 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", color: "var(--text-secondary)" }}>Similar Movies</h2>
          <div style={scrollRow} className="hide-scrollbar">
            {similar.map((movie) => (
              <div key={movie.id} style={{ minWidth: "220px", maxWidth: "220px" }}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

/* styles */
const page = {
  padding: "30px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const container = {
  display: "flex",
  gap: "40px",
  flexWrap: "wrap",
};

const poster = {
  width: "300px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  height: "fit-content",
};

const info = {
  flex: "1",
  minWidth: "300px",
};

const trailerBtn = {
  display: "inline-block",
  marginTop: "20px",
  padding: "12px 20px",
  background: "var(--accent-color)",
  color: "white",
  borderRadius: "6px",
  textDecoration: "none",
  transition: "background 0.2s",
  fontWeight: "bold",
};

const providersRow = {
  display: "flex",
  gap: "15px",
  marginTop: "15px",
  flexWrap: "wrap",
};

const providerCard = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "var(--card-bg)",
  border: "1px solid var(--border-color)",
  padding: "10px",
  borderRadius: "10px",
  textDecoration: "none",
  color: "var(--text-color)",
  transition: "all 0.2s",
  width: "80px",
  textAlign: "center",
};

const backBtn = {
  marginBottom: "30px",
  padding: "10px 15px",
  background: "var(--card-bg)",
  color: "var(--text-color)",
  border: "1px solid var(--border-color)",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "all 0.2s",
  fontWeight: "bold",
};

const center = {
  textAlign: "center",
  color: "var(--text-color)",
  marginTop: "50px",
};

const scrollRow = {
  display: "flex",
  overflowX: "auto",
  gap: "20px",
  padding: "20px 0",
};

const castCard = {
  minWidth: "140px",
  maxWidth: "140px",
  background: "var(--card-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: "10px",
  padding: "10px",
  textAlign: "center",
};

const castImg = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "8px",
};