import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Sketch } from '@uiw/react-color';

const PICKER_WIDTH = 230;
const PICKER_HEIGHT = 300; // aprox. para decidir si abre hacia arriba
const GAP = 4;
const MARGIN = 8;

/**
 * Reusable color picker built on @uiw/react-color (Sketch) shown inside an
 * accessible popover rendered in a portal. Drop-in replacement for
 * `<input type="color">`:
 *
 * - The panel is portaled to <body> with fixed positioning so it is never
 *   clipped by ancestors with `overflow: hidden/auto` (e.g. the sidebar).
 * - Adapts the library's `ColorResult` onChange into the legacy
 *   `{ target: { value } }` shape (plus a no-op `preventDefault`) so existing
 *   handlers/hooks keep working untouched.
 * - Supports controlled (`value`) and uncontrolled (`defaultValue`) usage.
 * - Closes on outside click and Escape. The trigger is a real <button> so an
 *   external `<label htmlFor={id}>` keeps providing its accessible name.
 *
 * @param {object} props
 * @param {string} [props.id] - id for the trigger button (label association)
 * @param {string} [props.value] - controlled hex color
 * @param {string} [props.defaultValue] - initial hex color (uncontrolled)
 * @param {(e: {target: {value: string}, preventDefault: () => void}) => void} [props.onChange]
 * @param {boolean} [props.disabled]
 * @param {string} [props.label] - descriptive name for title/dialog
 * @param {string} [props.swatchClassName] - classes for the swatch button
 * @param {string} [props.className] - classes for the wrapper element
 */
export default function ColorField({
  id,
  value,
  defaultValue,
  onChange,
  disabled = false,
  label,
  swatchClassName = '',
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [internal, setInternal] = useState(value ?? defaultValue ?? '#000000');
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // Controlled when `value` is provided; otherwise track internally.
  const current = value ?? internal;

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    let left = rect.left;
    let top = rect.bottom + GAP;
    if (left + PICKER_WIDTH > window.innerWidth - MARGIN) {
      left = window.innerWidth - PICKER_WIDTH - MARGIN;
    }
    if (left < MARGIN) left = MARGIN;
    // Si no cabe abajo, abrir hacia arriba.
    if (top + PICKER_HEIGHT > window.innerHeight - MARGIN) {
      top = Math.max(MARGIN, rect.top - PICKER_HEIGHT - GAP);
    }
    setPosition({ top, left });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointer = (event) => {
      const insideButton = buttonRef.current?.contains(event.target);
      const insidePopover = popoverRef.current?.contains(event.target);
      if (!insideButton && !insidePopover) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const handleReposition = () => updatePosition();
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    // Capture para seguir scrolls de cualquier contenedor ancestro.
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [open, updatePosition]);

  const handleChange = (color) => {
    setInternal(color.hex);
    // Keep the legacy event-like contract so existing handlers/hooks stay intact.
    onChange?.({ target: { value: color.hex }, preventDefault() {} });
  };

  const handleToggle = () => {
    // Calcula la posición antes de abrir para que el portal pinte ya ubicado
    // (evita useLayoutEffect, que advierte bajo SSR).
    if (!open) updatePosition();
    setOpen((prev) => !prev);
  };

  return (
    <span className={`inline-block ${className}`}>
      <button
        type="button"
        id={id}
        ref={buttonRef}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={`${label ?? 'Color'}: ${current}`}
        onClick={handleToggle}
        className={`border border-black/20 disabled:cursor-not-allowed disabled:opacity-50 ${swatchClassName}`}
        style={{ backgroundColor: current }}
      />
      {mounted &&
        open &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={label ?? 'Selector de color'}
            data-color-popover=""
            style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 1000 }}
          >
            <Sketch
              color={current}
              disableAlpha
              width={PICKER_WIDTH}
              onChange={handleChange}
            />
          </div>,
          document.body
        )}
    </span>
  );
}
