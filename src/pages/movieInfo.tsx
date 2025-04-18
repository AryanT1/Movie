import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import star from "../assets/star.svg";
import Poster from "../assets/No-Poster.png";

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  name: string;
}

interface MovieData {
  original_title?: string;
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  poster_path?: string;
  title?: string;
  genres?: Genre[];
  overview?: string;
  tagline?: string;
  original_language?: string;
  production_companies?: ProductionCompany[];
  origin_country?: string;
}

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [movieData, setMovieData] = useState<MovieData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchMovieDetails = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      console.log(id);
      const endpoint = `${API_BASE_URL}/movie/${id}`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("failed to fetch movies details");
      }
      const data = await response.json();
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies details");
        setMovieData({});
        return;
      }

      setMovieData(data);
      console.log(data);
    } catch (error) {
      console.log(`Error fetching movies: ${error} `);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  const formatRuntime = (minutes: number | undefined): string => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flex  mx-[30px] my-[20px]  bg-[#0F0D23] flex-col shadow-inner shadow-light-100/10  rounded-xl ">
      <div className=" m-5 p-5 flex flex-row">
        <div className="w-fit min-w-[30%] flex flex-col">
          <div>
            <h2>{movieData.original_title}</h2>
          </div>
          <div className="flex flex-row text-[#A8B5DB]  mt-4 md:mt-5 ">
            {movieData.release_date ? (
              <p className=" m-1 font-bold">
                {movieData.release_date.split("-")[0]}
              </p>
            ) : (
              "N/A"
            )}
            <span className=" m-1  ">•</span>
            <p className=" m-1 font-bold">{formatRuntime(movieData.runtime)}</p>
          </div>
        </div>
        <div className="w-[70%] ml-20 flex relative flex-row gap-2">
          <div className="flex absolute top-0 right-0   bg-[#221f3d] p-2 rounded shadow-inner shadow-light-100/10 flex-row   items-center gap-1 h-fit ">
            <img
              className="size-4 flex items-center object-contain"
              src={star}
              alt="star icon"
            />
            <p className="text-white  font-bold ">
              {movieData.vote_average
                ? `${movieData.vote_average.toFixed(1)}/10`
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-5 px-5 py-2 my-5  gap-[26px] flex flex-col sm:flex-row">
        <div className="w-[300px] h-[440px] rounded-xl overflow-hidden">
          <img
            src={
              movieData?.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`
                : Poster
            }
            alt={movieData?.title || "Movie Poster"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col rounded-xl flex-1">
          <div className="flex flex-col lg:flex-row gap-1 lg:gap-17 lg:items-center">
            <h3 className="text-[#A8B5DB] min-w-[80px]">Genres</h3>
            <div className="flex flex-wrap gap-3">
              {movieData?.genres?.length ? (
                movieData.genres.map((g) => (
                  <span
                    className="bg-[#221f3d] px-4 py-2 rounded shadow-inner shadow-light-100/10 text-white font-bold"
                    key={g.id}
                  >
                    {g.name}
                  </span>
                ))
              ) : (
                <span className="text-[#A8B5DB]">N/A</span>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-1 lg:gap-17 mt-4  lg:mt-5">
            <h3 className="text-[#A8B5DB] min-w-[80px]">Overview</h3>
            <p className="text-[#D6C7FF]  max-w-[440px]">
              {movieData?.overview || "N/A"}
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-1 lg:gap-17 mt-4  lg:mt-5">
            <h3 className="text-[#A8B5DB] min-w-[80px]">Tagline</h3>
            <p className="text-[#D6C7FF] max-w-[440px]">
              {movieData?.tagline || "N/A"}
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-1 lg:gap-17 mt-4  lg:mt-5">
            <h3 className="text-[#A8B5DB] min-w-[80px]">Language</h3>
            <p className="text-[#D6C7FF]  max-w-[440px]">
              {movieData?.original_language || "N/A"}
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-1 lg:gap-13 mt-4  lg:mt-5 lg:items-center">
            <h3 className="text-[#A8B5DB] min-w-[80px]">
              <span>Production</span> <br /> <span>Companies</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {movieData?.production_companies?.length ? (
                movieData.production_companies.map((g) => (
                  <span className=" py-2 mx-3 text-[#D6C7FF]  " key={g.id}>
                    {g.name}
                  </span>
                ))
              ) : (
                <span className="text-[#D6C7FF] ">N/A</span>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-1 lg:gap-17  mt-4  lg:mt-5 lg:items-center">
            <h3 className="text-[#A8B5DB] min-w-[80px]">
              <span>Origin</span> <br /> <span>Country</span>
            </h3>
            <div className="flex text-[#D6C7FF] flex-wrap gap-3">
              {movieData?.origin_country || "NA"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;