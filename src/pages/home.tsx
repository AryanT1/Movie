import { useEffect, useState } from "react";
import herobg from "../assets/hero-bg.png";
import Search from "../components/search";
import { Spinner } from "flowbite-react";
import MovieCard from "../components/MovieCard";
import { AppwriteMovie, getTrendingMovies, SearchDocument, updateSearchCount } from "../appwrite";
import { useNavigate } from "react-router-dom";

interface TMDBMovie {
  id: number;
  title: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
  original_language?: string;
}

interface ApiResponse {
  results?: TMDBMovie[];
  Response?: string;
  Error?: string;
}

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY: string = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [movieList, setMovieList] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [trendingMovies, setTrendingMovies] = useState<SearchDocument[]>([]);

  const convertToAppwriteMovie = (movie: TMDBMovie): AppwriteMovie => ({
    id: movie.id.toString(),
    poster_path: movie.poster_path,
    title: movie.title,
  });

  const fetchMovies = async (query: string = ""): Promise<void> => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error("Failed to fetch movies");
      
      const data: ApiResponse = await response.json();
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      const results = data.results || [];
      setMovieList(results);
      
      if (query && results.length > 0) {
        await updateSearchCount(query, convertToAppwriteMovie(results[0]));
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async (): Promise<void> => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      setTrendingMovies([]);
    }
  };

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      fetchMovies(debouncedSearchTerm);
    } else {
      fetchMovies();
    }
  }, [debouncedSearchTerm]);

  return (
    <main className="relative">
      <div className="pattern absolute inset-0 -z-10">
        <img src={herobg} alt="Hero Banner" className="w-full h-full object-cover" />
      </div>

      <div className="wrapper relative z-10 max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find <span className="text-gradient">Movies</span> You'll Enjoy
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending ">
            <h2 className="">Trending Movies</h2>
            <ul className="">
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id} >
                
                    <p>{index + 1}</p>
                    <img 
                    onClick={() => navigate(`/movie/${movie.movie_id}`)}
                      src={movie.poster_url} 
                      alt={movie.searchTerm} 
                      className="cursor-pointer"
                    />

                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies p-4">
          <h2 >Popular Movies</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner color="purple" aria-label="Loading movies" size="xl" />
            </div>
          ) : errorMessage ? (
            <p className="text-red-500 text-center">{errorMessage}</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default Home;