/**
 * Glifo de cierre (X) para acciones de "cerrar" en popovers y diálogos.
 * Hereda el color vía `currentColor` y es decorativo (el botón aporta el
 * nombre accesible mediante `aria-label`).
 */
const CloseIcon = ({ className }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CloseIcon;
