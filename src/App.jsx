import { useCallback, useEffect, useState } from "react";
import { createMovie, getMovies, updateMovie, uploadMovieImage } from "./api/movies";
import MovieForm from "./components/MovieForm";
import MovieList from "./components/MovieList";
import "./App.css";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setMovies(await getMovies());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  async function handleSubmit(values) {
    if (editingMovie) {
      await updateMovie(editingMovie.id, values);
      setEditingMovie(null);
    } else {
      await createMovie(values);
    }

    await loadMovies();
  }

  async function handleUpload(id, file) {
    setError(null);

    try {
      await uploadMovieImage(id, file);
      await loadMovies();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Filmdatabas</h1>
        <p className="app__count">{movies.length} filmer</p>
      </header>

      <MovieForm
        onSubmit={handleSubmit}
        editingMovie={editingMovie}
        onCancel={() => setEditingMovie(null)}
      />

      {error && (
        <div className="alert" role="alert">
          <span>{error}</span>
          <button type="button" onClick={loadMovies}>Försök igen</button>
        </div>
      )}

      {loading ? (
        <p className="loading">Hämtar filmer...</p>
      ) : (
        !error && <MovieList movies={movies} onEdit={setEditingMovie} onUpload={handleUpload} />
      )}
    </div>
  );
}
