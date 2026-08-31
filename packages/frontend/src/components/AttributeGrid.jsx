import { getEffectiveAttributeValue } from "@toe/shared";
import AttributeIcon from "./AttributeIcon.jsx";

const SOFT_CAP = 100;

function AttributeGrid({ attributes, characterAttributes, temporaryModifiers = [], compact = false }) {
  if (compact) {
    return (
      <div className="attribute-list-compact">
        {attributes.map((attribute) => {
          const values = characterAttributes?.[attribute.id];
          const effectiveValue = values
            ? getEffectiveAttributeValue(attribute.id, values.actual, temporaryModifiers)
            : 0;
          const barWidth = Math.min(100, (effectiveValue / SOFT_CAP) * 100);

          return (
            <div className="attribute-row-compact" key={attribute.id}>
              <AttributeIcon attributeId={attribute.id} className="attribute-icon-compact" />
              <span className="attribute-name-compact">{attribute.name}</span>
              <div className="attribute-bar-track">
                <div className="attribute-bar-fill" style={{ width: `${barWidth}%` }} />
              </div>
              <span className="attribute-value-compact">{effectiveValue}</span>
            </div>
          );
        })}
      </div>
    );
  }

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