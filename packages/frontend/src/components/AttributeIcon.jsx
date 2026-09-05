const ICONS = {
  fuerza: <path d="M20 44V28c0-6 4-10 10-10h4c6 0 10 4 10 10v16M16 44h32M24 44V32M40 44V32" />,
  agilidad: (
    <>
      <path d="M32 8l-6 14h8l-8 18 18-20h-8l6-12z" />
    </>
  ),
  resistencia: <path d="M32 10c10 4 16 6 16 14 0 14-8 22-16 26-8-4-16-12-16-26 0-8 6-10 16-14z" />,
  intelecto: (
    <>
      <path d="M18 20h28v20H18z" />
      <path d="M18 20l14 10 14-10" />
    </>
  ),
  percepcion: (
    <>
      <path d="M8 32s8-14 24-14 24 14 24 14-8 14-24 14S8 32 8 32z" />
      <circle cx="32" cy="32" r="6" />
    </>
  ),
  voluntad: (
    <>
      <path d="M32 10l6 14h14l-11 9 4 15-13-9-13 9 4-15-11-9h14z" />
    </>
  ),
};

function AttributeIcon({ attributeId, className }) {
  const shape = ICONS[attributeId];
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

export default AttributeIcon;