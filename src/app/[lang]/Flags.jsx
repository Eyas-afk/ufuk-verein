export function FlagDE({ className }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#000000" />
      <rect width="30" height="13.33" y="6.67" fill="#DD0000" />
      <rect width="30" height="6.67" y="13.33" fill="#FFCE00" />
    </svg>
  );
}

const star = "M12 2l2.2 5 5.5.5-4.2 3.6 1.3 5.4-4.8-2.9-4.8 2.9 1.3-5.4-4.2-3.6 5.5-.5z";

export function FlagSY({ className }) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#000000" />
      <rect width="30" height="6.67" fill="#CE1126" />
      <rect width="30" height="6.67" y="6.67" fill="#FFFFFF" />
      <g fill="#007A3D">
        <path d={star} transform="translate(9.5, 6.2) scale(0.35)" />
        <path d={star} transform="translate(18.5, 6.2) scale(0.35)" />
      </g>
    </svg>
  );
}
