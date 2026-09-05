import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi.js";
import RaceList from "../components/RaceList.jsx";
import AttributeGrid from "../components/AttributeGrid.jsx";
import RaceIcon from "../components/RaceIcon.jsx";

function CharacterCard({ character, raceName, onDelete }) {
  const ageYears = Math.floor(character.ageDays / 365);

  return (
    <li className="character-card">
      <div className="character-card-header">
        <RaceIcon raceId={character.raceId} className="character-card-icon" />
        <strong>{character.name}</strong>
      </div>
      <div className="character-card-body">
        <p className="character-card-meta">
          {raceName} · {ageYears} años
        </p>
        <div className="character-card-actions">
          <Link className="play-button" to={`/jugar/${character.id}`}>
            Jugar
          </Link>
          <button className="delete-button" onClick={() => onDelete(character.id)}>
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
}

function HomePage() {
  const { data: races, error: racesError } = useApi("/api/races?playable=true");
  const { data: attributes, error: attributesError } = useApi("/api/attributes");

  const [selectedRaceId, setSelectedRaceId] = useState(null);
  const [characterName, setCharacterName] = useState("");
  const [characterSex, setCharacterSex] = useState("masculino");
  const [birthRegion, setBirthRegion] = useState("");
  const [character, setCharacter] = useState(null);
  const [creationError, setCreationError] = useState(null);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    if (races && races.length > 0 && !selectedRaceId) {
      setSelectedRaceId(races[0].id);
    }
  }, [races, selectedRaceId]);

  async function refreshCharacters() {
    try {
      const res = await fetch("/api/characters");
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      setCharacters(await res.json());
    } catch (err) {
      console.error("No se pudieron cargar los personajes:", err.message);
    }
  }

  useEffect(() => {
    refreshCharacters();
  }, []);

  async function handleCreateCharacter(event) {
    event.preventDefault();
    setCreationError(null);
    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: characterName || "Sin nombre",
          raceId: selectedRaceId,
          sex: characterSex,
          birthRegion: birthRegion || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "No se pudo crear el personaje.");
      }
      setCharacter(await res.json());
      await refreshCharacters();
    } catch (err) {
      setCreationError(err.message);
    }
  }

  async function handleDeleteCharacter(id) {
    try {
      const res = await fetch(`/api/characters/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      await refreshCharacters();
    } catch (err) {
      console.error("No se pudo eliminar el personaje:", err.message);
    }
  }

      return (
        <div className="app">
          <div className="board-frame">
            <div className="board-content">
              {(racesError || attributesError) && (
                <p className="error">
                  No se pudo conectar con el backend. ¿Está corriendo en el
                  puerto 3001?
                </p>
              )}

              <div className="board-top-row">
                {races && (
                  <section className="notice">
                    <h2>Elige una raza</h2>
                    <RaceList
                      races={races}
                      selectedRaceId={selectedRaceId}
                      onSelect={setSelectedRaceId}
                    />
                  </section>
                )}

                {attributes && (
                  <section className="notice">
                    <h2>Atributos fundamentales</h2>
                    <AttributeGrid
                      attributes={attributes}
                      characterAttributes={character?.attributes}
                      compact
                    />
                  </section>
                )}

                <section className="notice">
                  <h2>Generar personaje</h2>
                  <form
                    onSubmit={handleCreateCharacter}
                    className="character-form"
                  >
                    <div className="character-form-fields">
                      <input
                        type="text"
                        placeholder="Nombre del personaje"
                        value={characterName}
                        onChange={(event) =>
                          setCharacterName(event.target.value)
                        }
                      />
                      <select
                        value={characterSex}
                        onChange={(event) =>
                          setCharacterSex(event.target.value)
                        }
                      >
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Región de nacimiento (opcional)"
                        value={birthRegion}
                        onChange={(event) => setBirthRegion(event.target.value)}
                      />
                    </div>
                    <div className="seal-cta">
                      <button
                        type="submit"
                        className="seal-button-img"
                        disabled={!selectedRaceId}
                        aria-label="Crear personaje"
                      >
                        <img src="/icons/wax-seal.png" alt="" />
                      </button>
                      <span className="seal-caption">
                        ¡Comienza tu aventura!
                      </span>
                    </div>
                  </form>
                  {creationError && <p className="error">{creationError}</p>}
                  {character && (
                    <p className="character-summary">
                      <strong>{character.name}</strong> (
                      {races?.find((r) => r.id === character.raceId)?.name})
                    </p>
                  )}
                </section>
              </div>

              <section className="notice character-list-section">
                <h2>Personajes guardados</h2>
                {characters.length === 0 ? (
                  <p className="empty-state">
                    Todavía no has creado ningún personaje.
                  </p>
                ) : (
                  <ul className="character-list">
                    {characters.map((char) => (
                      <CharacterCard
                        key={char.id}
                        character={char}
                        raceName={
                          races?.find((r) => r.id === char.raceId)?.name ??
                          char.raceId
                        }
                        onDelete={handleDeleteCharacter}
                      />
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      );
}

export default HomePage;