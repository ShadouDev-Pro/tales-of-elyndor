const ICONS = {
  humano: (
    <>
      <circle cx="32" cy="26" r="14" />
      <path d="M14 54c0-11 8-18 18-18s18 7 18 18" />
    </>
  ),
  elfo: (
    <>
      <circle cx="32" cy="26" r="13" />
      <path d="M19 22 8 14l3 15z" />
      <path d="M45 22l11-8-3 15z" />
      <path d="M14 54c0-11 8-18 18-18s18 7 18 18" />
    </>
  ),
  enano: (
    <>
      <circle cx="32" cy="22" r="12" />
      <path d="M16 30c0 14 6 26 16 26s16-12 16-26c-4 6-10 8-16 8s-12-2-16-8z" />
      <path d="M12 52c0-10 8-16 20-16s20 6 20 16" />
    </>
  ),
  mediano: (
    <>
      <circle cx="32" cy="28" r="12" />
      <circle cx="19" cy="26" r="4" />
      <circle cx="45" cy="26" r="4" />
      <path d="M16 54c0-10 7-16 16-16s16 6 16 16" />
    </>
  ),
  gnomo: (
    <>
      <circle cx="32" cy="30" r="12" />
      <path d="M32 4 20 20h24z" />
      <path d="M16 54c0-10 7-16 16-16s16 6 16 16" />
    </>
  ),
  orco: (
    <>
      <circle cx="32" cy="26" r="14" />
      <path d="M25 36l-3 8 6-2z" />
      <path d="M39 36l3 8-6-2z" />
      <path d="M14 54c0-11 8-18 18-18s18 7 18 18" />
    </>
  ),
  goblin: (
    <>
      <circle cx="32" cy="28" r="11" />
      <path d="M21 22 6 10l4 18z" />
      <path d="M43 22l15-12-4 18z" />
      <path d="M15 54c0-10 8-15 17-15s17 5 17 15" />
    </>
  ),
  troll: (
    <>
      <circle cx="32" cy="26" r="16" />
      <path d="M18 16l4 8" />
      <path d="M46 16l-4 8" />
      <path d="M11 56c0-12 9-19 21-19s21 7 21 19" />
    </>
  ),
  beastfolk_felino: (
    <>
      <circle cx="32" cy="28" r="12" />
      <path d="M20 18 10 4l6 16z" />
      <path d="M44 18l10-14-6 16z" />
      <path d="M16 54c0-10 7-16 16-16s16 6 16 16" />
    </>
  ),
};

function RaceIcon({ raceId, className }) {
  const shape = ICONS[raceId];
  if (!shape) return null;

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {shape}
    </svg>
  );
}

export default RaceIcon;