# Filmdatabas – webbapplikation

React-frontend till ett eget REST-API byggt med ASP.NET Core WebAPI.
Appen listar filmer, lägger till nya, uppdaterar befintliga och laddar upp omslagsbilder.

Backend ligger i ett separat repo: https://github.com/jelalqaiumi/Mitt-projekt-backend

## Förutsättningar

- .NET 10 SDK
- Node.js 20 eller senare

## Starta projektet

Båda delarna måste köra samtidigt, i två separata terminaler.

### 1. Backend (port 5078)

```
git clone https://github.com/jelalqaiumi/Mitt-projekt-backend.git
cd Mitt-projekt-backend/Mitt-projekt-backend
dotnet restore
dotnet run
```

API:et svarar på `http://localhost:5078`.
Swagger med alla endpoints: `http://localhost:5078/swagger`

### 2. Frontend (port 5173)

```
git clone https://github.com/jelalqaiumi/Mitt-projekt.git
cd Mitt-projekt
npm install
npm run dev
```

Öppna `http://localhost:5173`.

Startar backend på en annan port än 5078, ändra `API_BASE_URL` i `src/api/config.js`.

## API-endpoints

| Metod | Rutt | Beskrivning |
|---|---|---|
| GET | `/api/movies` | Hämtar alla filmer |
| GET | `/api/movies/{id}` | Hämtar en film |
| POST | `/api/movies` | Skapar en film |
| PUT | `/api/movies/{id}` | Uppdaterar en film |
| POST | `/api/movies/{id}/image` | Laddar upp omslagsbild |

## Projektstruktur

```
src/
  api/          All kommunikation med backend
  components/   Presentationskomponenter
  App.jsx       Tillstånd och koppling mellan de två
```

## Tekniska val

**Repository-mönster i backend.** Controllern beror på interfacet `IMovieRepository`, inte på den konkreta lagringen. Datan ligger i minnet, men ett byte till EF Core kräver en ny klass och en ändrad rad i `Program.cs` – controllern rörs inte.

**Separata DTO:er för in- och utdata.** `CreateMovieRequest` saknar `Id`, vilket gör det omöjligt för en klient att sätta id själv. `MovieResponse` styr exakt vilka fält som exponeras, så interna fält kan läggas till i domänmodellen utan att läcka ut i API:et.

**Centraliserad felhantering i frontend.** All fetch går genom `request()` i `src/api/movies.js`. Den kontrollerar `response.ok` manuellt – `fetch` kastar nämligen inte vid statuskod 400 eller 404 – och plockar ut backendens ProblemDetails-meddelande. Felen hanteras på två nivåer: formuläret visar valideringsfel vid fälten, medan `App.jsx` visar nätverks- och uppladdningsfel för hela sidan.

**Genererade filnamn vid uppladdning.** Filer sparas som ett GUID, aldrig med klientens filnamn. Det förhindrar både path traversal och att två uppladdningar skriver över varandra. Filändelsen valideras mot en vitlista, inte `Content-Type`, eftersom den headern sätts av klienten och inte kan litas på.

**Ingen HTTPS-omdirigering i utveckling.** `UseHttpsRedirection()` är avstängd eftersom den bryter CORS-preflighten när frontend anropar http-adressen.

**Vanlig CSS istället för ramverk.** Två brytpunkter (640px och 1000px) räcker för kravet på responsivitet, utan extra byggsteg eller beroenden.

## Kända begränsningar

- Lagringen är i minnet. Datan återställs till de 20 seedade filmerna varje gång backend startas om. Uppladdade bilder ligger kvar i `wwwroot/uploads`, men kopplingen till filmen försvinner.
- Ingen DELETE-endpoint, eftersom uppgiften inte kräver det.
- Ingen autentisering.
