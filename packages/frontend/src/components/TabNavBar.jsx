import TabIcon from "./TabIcon.jsx";

function TabNavBar({ tabs, activeId, onSelect, extraActions }) {
  return (
    <div className="tab-navbar-floating">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={tab.id === activeId ? "tab-button selected" : "tab-button"}
          onClick={() => onSelect(tab.id)}
        >
          <TabIcon tabId={tab.id} className="tab-icon" />
          <span>{tab.label}</span>
        </button>
      ))}
      {extraActions && (
        <>
          <div className="tab-navbar-divider" />
          <div className="tab-navbar-extra">{extraActions}</div>
        </>
      )}
    </div>
  );
}

export default TabNavBar;