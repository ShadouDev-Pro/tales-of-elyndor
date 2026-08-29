import { useEffect, useState } from "react";
import "./App.css";
import { TRAITS } from "@toe/shared";

function useApi(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { data, error };
}

function RaceList({ races, selectedRaceId, onSelect }) {
  return (
    <ul className="race-list">
      {races.map((race) => (
        <li key={race.id}>
          <button
            className={race.id === selectedRaceId ? "race-button selected" : "race-button"}
            onClick={() => onSelect(race.id)}
          >
            {race.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

function AttributeGrid({ attributes, characterAttributes }) {
  return (
    <div className="attribute-grid">
      {attributes.map((attribute) => {
        const values = characterAttributes?.[attribute.id];
        return (
          <div className="attribute-card" key={attribute.id}>
            <h4>{attribute.name}</h4>
            <p className="attribute-description">{attribute.description}</p>
            {values && (
              <p className="attribute-values">
                Actual: <strong>{values.actual}</strong> · Potencial:{" "}
                <strong>{values.potencial}</strong>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CharacterHistory({ history }) {
  if (history.length === 0) {
    return null;
  }

  return (
    <details className="character-history">
      <summary>Historial de vida ({history.length})</summary>
      <ul>
        {history
          .slice()
          .reverse()
          .map((entry, index) => (
            <li key={index}>
              <span className="history-age">{Math.floor(entry.ageDays / 365)} años:</span>{" "}
              {entry.text}
            </li>
          ))}
      </ul>
    </details>
  );
}

function CharacterAttributes({ attributes, attributeDefinitions }) {
  return (
    <details className="character-attributes">
      <summary>Atributos</summary>
      <div className="attribute-grid-compact">
        {attributeDefinitions.map((def) => {
          const values = attributes[def.id];
          return (
            <div key={def.id} className="attribute-compact-item">
              <span>{def.name}</span>
              <span>
                {values.actual} <small>/ {values.potencial}</small>
              </span>
            </div>
          );
        })}
      </div>
    </details>
  );
}

function CharacterList({ characters, races, attributes, onDelete, onAdvanceTime }) {
  if (characters.length === 0) {
    return <p className="empty-state">Todavía no has creado ningún personaje.</p>;
  }

  return (
    <ul className="character-list">
      {characters.map((char) => {
        const ageYears = Math.floor(char.ageDays / 365);
        return (
          <li key={char.id} className="character-list-item">
            <div>
              <strong>{char.name}</strong>{" "}
              <span className="character-race">
                ({races?.find((r) => r.id === char.raceId)?.name ?? char.raceId})
              </span>
              <span className="character-age"> · {ageYears} años</span>
              {char.traits.length > 0 && (
                <div className="character-traits">
                  {char.traits.map((traitId) => {
                    const trait = TRAITS.find((t) => t.id === traitId);
                    return (
                      <span key={traitId} className={`trait-badge trait-${trait?.type ?? "neutral"}`}>
                        {trait?.name ?? traitId}
                      </span>
                    );
                  })}
                </div>
              )}
              <CharacterHistory history={char.history} />
              <CharacterAttributes attributes={char.attributes} attributeDefinitions={attributes} />
            </div>
            <div className="character-actions">
              <button className="advance-time-button" onClick={() => onAdvanceTime(char.id, 365)}>
                +1 año
              </button>
              <button className="advance-time-button" onClick={() => onAdvanceTime(char.id, 30)}>
                +1 mes
              </button>
              <button className="delete-button" onClick={() => onDelete(char.id)}>
                Eliminar
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function App() {
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

  async function handleAdvanceTime(id, days) {
    try {
      const res = await fetch(`/api/characters/${id}/advance-time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      await refreshCharacters();
    } catch (err) {
      console.error("No se pudo avanzar el tiempo:", err.message);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Tales of Elyndor</h1>
        <p className="tagline">El personaje no elige lo que es. Se convierte en ello.</p>
      </header>

      {(racesError || attributesError) && (
        <p className="error">
          No se pudo conectar con el backend. ¿Está corriendo en el puerto 3001?
        </p>
      )}

      {races && (
        <section>
          <h2>Elige una raza</h2>
          <RaceList races={races} selectedRaceId={selectedRaceId} onSelect={setSelectedRaceId} />
        </section>
      )}

      {attributes && (
        <section>
          <h2>Atributos fundamentales</h2>
          <AttributeGrid attributes={attributes} characterAttributes={character?.attributes} />
        </section>
      )}

      <section>
        <h2>Personajes guardados</h2>
        <CharacterList
          characters={characters}
          races={races}
          attributes={attributes ?? []}
          onDelete={handleDeleteCharacter}
          onAdvanceTime={handleAdvanceTime}
        />
      </section>

      <section>
        <h2>Generar personaje</h2>
        <form onSubmit={handleCreateCharacter} className="character-form">
          <input
            type="text"
            placeholder="Nombre del personaje"
            value={characterName}
            onChange={(event) => setCharacterName(event.target.value)}
          />
          <select value={characterSex} onChange={(event) => setCharacterSex(event.target.value)}>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          <input
            type="text"
            placeholder="Región de nacimiento (opcional)"
            value={birthRegion}
            onChange={(event) => setBirthRegion(event.target.value)}
          />
          <button type="submit" disabled={!selectedRaceId}>
            Crear personaje
          </button>
        </form>
        {creationError && <p className="error">{creationError}</p>}
        {character && (
          <p className="character-summary">
            <strong>{character.name}</strong> ({races?.find((r) => r.id === character.raceId)?.name})
          </p>
        )}
      </section>
    </div>
  );
}

export default App;