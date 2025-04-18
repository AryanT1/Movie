import React from "react";
import star from "../assets/star.svg";
import noPoster from "../assets/No-Poster.png";
import { useNavigate } from "react-router-dom";

interface Movie {
  vote_average?: number;
  release_date?: string;
  original_language?: string;
  poster_path?: string | null;
  title: string;
  id: number;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie: { vote_average, release_date, original_language, poster_path, title, id },
}) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/movie/${id}`)} 
      className="movie-card cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/movie/${id}`)}
    >
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : noPoster
        }
        alt={title}
        className="w-full h-auto"
        loading="lazy"
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        <div className="content">
          <div className="rating flex items-center gap-1 text-sm text-gray-500">
            <img src={star} alt="star icon" className="w-4 h-4" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
            <span>•</span>
            <p className="lang uppercase">{original_language}</p>
            <span>•</span>
            <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;