import { useEffect, useState } from "react";

const EMPTY = { title: "", genre: "", year: "", rating: "", description: "" };

export default function MovieForm({ onSubmit, editingMovie, onCancel }) {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setError(null);
    setValues(
      editingMovie
        ? {
            title: editingMovie.title,
            genre: editingMovie.genre,
            year: String(editingMovie.year),
            rating: String(editingMovie.rating),
            description: editingMovie.description,
          }
        : EMPTY
    );
  }, [editingMovie]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await onSubmit({
        title: values.title,
        genre: values.genre,
        year: Number(values.year),
        rating: Number(values.rating),
        description: values.description,
      });
      setValues(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2 className="form__title">
        {editingMovie ? `Redigera "${editingMovie.title}"` : "Lägg till film"}
      </h2>

      <div className="form__row">
        <label className="field">
          <span>Titel</span>
          <input name="title" value={values.title} onChange={handleChange} required maxLength={200} />
        </label>

        <label className="field">
          <span>Genre</span>
          <input name="genre" value={values.genre} onChange={handleChange} required maxLength={60} />
        </label>
      </div>

      <div className="form__row">
        <label className="field">
          <span>Årtal</span>
          <input name="year" type="number" min={1888} max={2100} value={values.year} onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Betyg (0-10)</span>
          <input name="rating" type="number" step={0.1} min={0} max={10} value={values.rating} onChange={handleChange} required />
        </label>
      </div>

      <label className="field">
        <span>Beskrivning</span>
        <textarea name="description" rows={3} value={values.description} onChange={handleChange} required maxLength={1000} />
      </label>

      {error && <p className="field__error" role="alert">{error}</p>}

      <div className="form__actions">
        <button type="submit" disabled={saving}>
          {saving ? "Sparar..." : editingMovie ? "Spara ändringar" : "Lägg till"}
        </button>

        {editingMovie && (
          <button type="button" className="button--ghost" onClick={onCancel}>
            Avbryt
          </button>
        )}
      </div>
    </form>
  );
}
