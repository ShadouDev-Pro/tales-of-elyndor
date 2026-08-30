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

export default AttributeGrid;