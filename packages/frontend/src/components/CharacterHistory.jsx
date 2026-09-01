function CharacterHistory({ history }) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="character-history">
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
    </div>
  );
}

export default CharacterHistory;