import { useState } from "react";
import TabIcon from "./TabIcon.jsx";

function TabbedPanel({ tabs }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const activeTab = tabs.find((tab) => tab.id === activeId);

  return (
    <div className="tabbed-panel">
      <div className="tabbed-panel-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={tab.id === activeId ? "tab-button selected" : "tab-button"}
            onClick={() => setActiveId(tab.id)}
          >
            <TabIcon tabId={tab.id} className="tab-icon" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="tabbed-panel-content">{activeTab?.content}</div>
    </div>
  );
}

export default TabbedPanel;