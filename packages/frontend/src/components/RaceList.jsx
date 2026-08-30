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

export default RaceList;