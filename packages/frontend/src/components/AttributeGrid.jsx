import { getEffectiveAttributeValue } from "@toe/shared";

function AttributeGrid({ attributes, characterAttributes, temporaryModifiers = [] }) {
  return (
    <div className="attribute-grid">
      {attributes.map((attribute) => {
        const values = characterAttributes?.[attribute.id];
        const activeModifier = temporaryModifiers.find((m) => m.attributeId === attribute.id);
        const effectiveValue = values
          ? getEffectiveAttributeValue(attribute.id, values.actual, temporaryModifiers)
          : null;

        return (
          <div className="attribute-card" key={attribute.id}>
            <h4>{attribute.name}</h4>
            <p className="attribute-description">{attribute.description}</p>
            {values && (
              <p className="attribute-values">
                Actual: <strong>{effectiveValue}</strong> · Potencial:{" "}
                <strong>{values.potencial}</strong>
                {activeModifier && (
                  <span className="attribute-modifier"> ({activeModifier.amount} temporal)</span>
                )}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AttributeGrid;