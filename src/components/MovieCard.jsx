import { toImageUrl } from "../api/movies";

export default function MovieCard({ movie, onEdit, onUpload }) {
  const imageSrc = toImageUrl(movie.imageUrl);

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (file) onUpload(movie.id, file);
    event.target.value = "";
  }

  return (
    <article className="card">
      {imageSrc ? (
        <img className="card__image" src={imageSrc} alt={`Omslag för ${movie.title}`} />
      ) : (
        <div className="card__image card__image--empty">Ingen bild</div>
      )}

      <div className="card__body">
        <h3 className="card__title">{movie.title}</h3>
        <p className="card__meta">
          {movie.genre} · {movie.year} · {movie.rating}/10
        </p>
        <p className="card__description">{movie.description}</p>

        <div className="card__actions">
          <button type="button" onClick={() => onEdit(movie)}>Redigera</button>

          <label className="button--file">
            {movie.imageUrl ? "Byt bild" : "Ladda upp bild"}
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
          </label>
        </div>
      </div>
    </article>
  );
}
