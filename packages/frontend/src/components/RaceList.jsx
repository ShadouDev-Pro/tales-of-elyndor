import RaceIcon from "./RaceIcon.jsx";

function RaceList({ races, selectedRaceId, onSelect }) {
  return (
    <ul className="race-list">
      {races.map((race) => (
        <li key={race.id}>
          <button
            className={race.id === selectedRaceId ? "race-button selected" : "race-button"}
            onClick={() => onSelect(race.id)}
          >
            <RaceIcon raceId={race.id} className="race-icon" />
            <span>{race.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default RaceList;