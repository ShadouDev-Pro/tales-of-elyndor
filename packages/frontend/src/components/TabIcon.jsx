const ICONS = {
  personaje: (
    <>
      <path d="M32 10c-9 0-14 6-14 14 0 6 3 10 6 12l-2 6h20l-2-6c3-2 6-6 6-12 0-8-5-14-14-14z" />
      <path d="M20 24h24" />
    </>
  ),
  rasgos: (
    <>
      <path d="M32 8l6 14h14l-11 9 4 15-13-9-13 9 4-15-11-9h14z" />
    </>
  ),
  diario: (
    <>
      <path d="M12 14h18v36H12z" />
      <path d="M52 14H34v36h18z" />
      <path d="M18 22h6M18 30h6M40 22h6M40 30h6" />
    </>
  ),
  inventario: (
    <>
      <path d="M22 18l4-8h12l4 8" />
      <path d="M16 18h32l-3 30H19z" />
    </>
  ),
  misiones: (
    <>
      <rect x="16" y="12" width="32" height="40" rx="3" />
      <path d="M22 22h20M22 30h20M22 38h12" />
    </>
  ),
  mapa: (
    <>
      <path d="M12 16l14-5 12 5 14-5v36l-14 5-12-5-14 5z" />
      <path d="M26 11v36M38 16v36" />
    </>
  ),
};

function TabIcon({ tabId, className }) {
  const shape = ICONS[tabId];
  if (!shape) return null;

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {shape}
    </svg>
  );
}

export default TabIcon;