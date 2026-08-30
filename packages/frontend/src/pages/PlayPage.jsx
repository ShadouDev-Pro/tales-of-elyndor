import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TRAITS } from "@toe/shared";
import { useApi } from "../hooks/useApi.js";
import AttributeGrid from "../components/AttributeGrid.jsx";
import CharacterHistory from "../components/CharacterHistory.jsx";

function PlayPage() {
  const { id } = useParams();
  const { data: races } = useApi("/api/races?playable=true");
  const { data: attributeDefinitions } = useApi("/api/attributes");

  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);

  async function refreshCharacter() {
    try {
      const res = await fetch(`/api/characters/${id}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      setCharacter(await res.json());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    refreshCharacter();
  }, [id]);

  async function handleAdvanceTime(days) {
    try {
      const res = await fetch(`/api/characters/${id}/advance-time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      await refreshCharacter();
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) {
    return (
      <div className="app">
        <p className="error">No se pudo cargar el personaje: {error}</p>
        <Link to="/">← Volver</Link>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="app">
        <p>Cargando personaje...</p>
      </div>
    );
  }

  const raceName = races?.find((r) => r.id === character.raceId)?.name ?? character.raceId;
  const ageYears = Math.floor(character.ageDays / 365);

  return (
    <div className="app">
      <Link to="/" className="back-link">
        ← Volver
      </Link>

      <header>
        <h1>{character.name}</h1>
        <p className="tagline">
          {raceName} · {ageYears} años
        </p>
      </header>

      <section>
        <h2>Avanzar tiempo</h2>
        <div className="character-actions">
          <button className="advance-time-button" onClick={() => handleAdvanceTime(365)}>
            +1 año
          </button>
          <button className="advance-time-button" onClick={() => handleAdvanceTime(30)}>
            +1 mes
          </button>
        </div>
      </section>

      <section>
        <h2>Rasgos</h2>
        {character.traits.length === 0 ? (
          <p className="empty-state">Todavía no ha desarrollado ningún rasgo.</p>
        ) : (
          <div className="character-traits">
            {character.traits.map((traitId) => {
              const trait = TRAITS.find((t) => t.id === traitId);
              return (
                <span key={traitId} className={`trait-badge trait-${trait?.type ?? "neutral"}`}>
                  {trait?.name ?? traitId}
                </span>
              );
            })}
          </div>
        )}
      </section>

      {attributeDefinitions && (
        <section>
          <h2>Atributos</h2>
          <AttributeGrid attributes={attributeDefinitions} characterAttributes={character.attributes} />
        </section>
      )}

      <section>
        <h2>Historial de vida</h2>
        {character.history.length === 0 ? (
          <p className="empty-state">Todavía no ha ocurrido nada en su vida.</p>
        ) : (
          <CharacterHistory history={character.history} />
        )}
      </section>
    </div>
  );
}

export default PlayPage;