import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TRAITS } from "@toe/shared";
import { useApi } from "../hooks/useApi.js";
import AttributeGrid from "../components/AttributeGrid.jsx";
import CharacterHistory from "../components/CharacterHistory.jsx";
import RaceIcon from "../components/RaceIcon.jsx";
import TabNavBar from "../components/TabNavBar.jsx";

function PlayPage() {
  const { id } = useParams();
  const { data: races } = useApi("/api/races?playable=true");
  const { data: attributeDefinitions } = useApi("/api/attributes");

  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [activeTabId, setActiveTabId] = useState("personaje");

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
        <div className="board-frame">
          <div className="board-content">
            <p className="error">No se pudo cargar el personaje: {error}</p>
            <Link to="/" className="back-link">← Volver</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="app">
        <div className="board-frame">
          <div className="board-content">
            <p>Cargando personaje...</p>
          </div>
        </div>
      </div>
    );
  }

  const raceName = races?.find((r) => r.id === character.raceId)?.name ?? character.raceId;
  const ageYears = Math.floor(character.ageDays / 365);

  if (!character.alive) {
    return (
      <div className="app">
        <div className="board-frame">
          <div className="board-content play-content">
            <section className="notice death-notice">
              <h2>{character.name} ha fallecido</h2>
              <p>{character.causeOfDeath}</p>
              <p className="character-identity-meta">
                {raceName} · vivió {ageYears} años
                {character.gameMode === "linaje" && (
                  <>
                    {" "}
                    · Modo Linaje: la continuidad por descendientes aún no está
                    implementada.
                  </>
                )}
              </p>
            </section>
          </div>
        </div>
        <Link to="/" className="back-link-floating">
          ← Volver
        </Link>
      </div>
    );
  }

  const tabs = [
    {
      id: "personaje",
      label: "Personaje",
      content: (
        <div className="character-identity">
          <RaceIcon raceId={character.raceId} className="identity-icon" />
          <div>
            <h3>{character.name}</h3>
            <p className="character-identity-meta">
              {raceName} · {character.sex} · {ageYears} años
              {character.birthRegion && <> · {character.birthRegion}</>}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "rasgos",
      label: "Rasgos",
      content:
        character.traits.length === 0 ? (
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
        ),
    },
    {
      id: "diario",
      label: "Diario",
      content:
        character.history.length === 0 ? (
          <p className="empty-state">Todavía no ha ocurrido nada en su vida.</p>
        ) : (
          <CharacterHistory history={character.history} />
        ),
    },
    {
      id: "inventario",
      label: "Inventario",
      content: <p className="empty-state">Próximamente.</p>,
    },
    {
      id: "misiones",
      label: "Misiones",
      content: <p className="empty-state">Próximamente.</p>,
    },
    {
      id: "mapa",
      label: "Mapa",
      content: <p className="empty-state">Próximamente.</p>,
    },
  ];

  return (
    <div className="app">
      <div className="board-frame">
        <div className="board-content play-content">
          <div className="play-top-row">
            <section className="notice play-column">
              <h2>Atributos</h2>
              {attributeDefinitions && (
                <AttributeGrid
                  attributes={attributeDefinitions}
                  characterAttributes={character.attributes}
                  temporaryModifiers={character.temporaryModifiers}
                  compact
                />
              )}
            </section>

            <section className="notice play-column placeholder-notice">
              <h2>Decisiones</h2>
              <p className="empty-state">Próximamente.</p>
            </section>
          </div>

          <section className="notice play-tabs-section">
            {tabs.find((tab) => tab.id === activeTabId)?.content}
          </section>
        </div>
      </div>

      <TabNavBar
        tabs={tabs}
        activeId={activeTabId}
        onSelect={setActiveTabId}
        extraActions={
          <>
            <button
              className="time-button"
              onClick={() => handleAdvanceTime(365)}
            >
              +1 año
            </button>
            <button
              className="time-button"
              onClick={() => handleAdvanceTime(30)}
            >
              +1 mes
            </button>
          </>
        }
      />
      <Link to="/" className="back-link-floating">
        ← Volver
      </Link>
    </div>
  );
}

export default PlayPage;