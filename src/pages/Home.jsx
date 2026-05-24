import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchMovies, getTrendingMovies, getTopRatedMovies, getUpcomingMovies } from "../api/tmdb";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);
  const { hash } = useLocation();

  // Hash scrolling
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash, trending, topRated]);

  //  Load home data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [trendingData, topRatedData, upcomingData] = await Promise.all([
          getTrendingMovies(),
          getTopRatedMovies(),
          getUpcomingMovies(),
        ]);
        setTrending(trendingData || []);
        setTopRated(topRatedData || []);
        setUpcoming(upcomingData || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHomeData();
  }, []);

  // Search (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchSearch(query);
      } else {
        setMovies([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchSearch = async (text) => {
    try {
      setLoading(true);
      const res = await searchMovies(text);
      setMovies(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const featured = trending.length > 0 ? trending[0] : null;

  return (
    <div style={styles.page}>
      {/* 🎬 TITLE */}
      <div style={styles.header}>
        <p style={styles.subtitle}>
          Discover movies, trailers & streaming informattion.
        </p>
      </div>

      {/*  SEARCH */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Search movies (Batman, Avengers...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.search}
        />
      </div>

      {/* HERO */}
      {!query && featured && (
        <div style={styles.hero}>
          <img
            src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
            alt={featured.title || featured.name}
            style={styles.heroImg}
          />
          <div style={styles.heroOverlay}>
            <h2 style={styles.heroTitle}>{featured.title || featured.name}</h2>
            <p style={styles.heroText}>
              {featured.overview ? featured.overview.slice(0, 150) + "..." : ""}
            </p>
            <button style={styles.heroBtn}>Watch Trailer</button>
          </div>
        </div>
      )}

      {/*  SEARCH RESULTS */}
      {query && (
        <>
          <h2 style={styles.sectionTitle}>🔍 Search Results</h2>

          {loading && <p style={{ color: "var(--text-secondary)" }}>Loading...</p>}

          <div style={styles.grid}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      {/*  HOME SECTIONS (HORIZONTAL SCROLL) */}
      {!query && (
        <>
          <h2 id="trending" style={styles.sectionTitle}>Trending Now</h2>
          <div style={styles.scrollRow} className="hide-scrollbar">
            {trending.map((movie) => (
              <div key={movie.id} style={styles.cardWrapper}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          <h2 id="top-rated" style={styles.sectionTitle}>Top Rated</h2>
          <div style={styles.scrollRow} className="hide-scrollbar">
            {topRated.map((movie) => (
              <div key={movie.id} style={styles.cardWrapper}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          <h2 id="upcoming" style={styles.sectionTitle}>Upcoming</h2>
          <div style={styles.scrollRow} className="hide-scrollbar">
            {upcoming.map((movie) => (
              <div key={movie.id} style={styles.cardWrapper}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/*  STYLES */
const styles = {
  page: {
    padding: "20px",
    fontFamily: "Arial",
  },

  /* HEADER */
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },

  title: {
    fontSize: "36px",
    marginBottom: "5px",
  },

  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "14px",
  },

  /* HERO */
  hero: {
    position: "relative",
    height: "380px",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "30px",
  },

  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.2))",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  heroTitle: {
    fontSize: "34px",
    marginBottom: "10px",
    color: "#ffffff",
  },

  heroText: {
    maxWidth: "500px",
    color: "#dddddd",
  },

  heroBtn: {
    marginTop: "15px",
    padding: "10px 15px",
    background: "var(--accent-color)",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    width: "120px",
    transition: "background 0.2s",
  },

  /* SEARCH */
  search: {
    width: "400px",
    maxWidth: "90%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "var(--card-bg)",
    color: "var(--text-color)",
    outline: "none",
  },

  /* GRID (SEARCH RESULTS) */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },

  /* HORIZONTAL SCROLL ROW */
  scrollRow: {
    display: "flex",
    overflowX: "auto",
    gap: "20px",
    paddingBottom: "20px",
  },
  
  cardWrapper: {
    minWidth: "220px",
    maxWidth: "220px",
  },

  /* SECTIONS */
  sectionTitle: {
    marginTop: "40px",
    marginBottom: "15px",
    fontSize: "22px",
  },
};