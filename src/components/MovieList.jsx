import MovieCard from "./MovieCard";

export default function MovieList({ movies, onEdit, onUpload }) {
  if (movies.length === 0) {
    return <p className="empty">Inga filmer att visa än.</p>;
  }

  return (
    <div className="grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onEdit={onEdit} onUpload={onUpload} />
      ))}
    </div>
  );
}
