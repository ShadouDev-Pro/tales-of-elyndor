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

export default CharacterHistory;