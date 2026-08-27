import { useEffect, useState } from "react";
import "./App.css";

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

function App() {
  const { data: races, error: racesError } = useApi("/api/races?playable=true");
  const { data: attributes, error: attributesError } = useApi("/api/attributes");

  const [selectedRaceId, setSelectedRaceId] = useState(null);
  const [characterName, setCharacterName] = useState("");
  const [character, setCharacter] = useState(null);
  const [creationError, setCreationError] = useState(null);

  useEffect(() => {
    if (races && races.length > 0 && !selectedRaceId) {
      setSelectedRaceId(races[0].id);
    }
  }, [races, selectedRaceId]);

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
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "No se pudo crear el personaje.");
      }
      setCharacter(await res.json());
    } catch (err) {
      setCreationError(err.message);
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
        <h2>Generar personaje</h2>
        <form onSubmit={handleCreateCharacter} className="character-form">
          <input
            type="text"
            placeholder="Nombre del personaje"
            value={characterName}
            onChange={(event) => setCharacterName(event.target.value)}
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
