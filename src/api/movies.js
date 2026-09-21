import { API_BASE_URL } from "./config";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error("Kunde inte nå servern. Kontrollera att backend är igång.");
  }

  if (response.status === 204) return null;

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json() : null;

  if (!response.ok) throw new Error(toErrorMessage(body, response.status));

  return body;
}

function toErrorMessage(body, status) {
  if (body?.errors) return Object.values(body.errors).flat().join(" ");
  if (body?.detail) return body.detail;
  if (status === 404) return "Filmen hittades inte.";
  return `Något gick fel (statuskod ${status}).`;
}

export function getMovies() {
  return request("/api/movies");
}

export function createMovie(movie) {
  return request("/api/movies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });
}

export function updateMovie(id, movie) {
  return request(`/api/movies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });
}

export function uploadMovieImage(id, file) {
  const formData = new FormData();
  formData.append("file", file);

  // Ingen Content-Type här - webblasaren satter den med ratt boundary.
  return request(`/api/movies/${id}/image`, { method: "POST", body: formData });
}

export function toImageUrl(path) {
  return path ? `${API_BASE_URL}${path}` : null;
}
