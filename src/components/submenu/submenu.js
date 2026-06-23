import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useSubMenu from './useSubmenu';
import { getTree } from '../store/tree/slice';
import { addIds } from '../store/selection/slice';
import { collectSubtreeIds } from '@/lib/TreeData';
import ColorField from '../common/colorField';
import CloseIcon from '../icons/close';
import BranchGlyph from '../icons/branchGlyph';

// Título y microcopy por tipo de elemento. Centralizar el texto mantiene el
// menú consistente y fácil de traducir/ajustar en un solo lugar.
const TYPE_META = {
  node: { title: 'Editar nodo', hint: 'Ajusta el tamaño y el color del nodo.' },
  label: { title: 'Editar etiqueta', hint: 'Cambia el tamaño y el color del texto.' },
  link: { title: 'Editar enlace', hint: 'Define el grosor y el color de la rama.' },
};

// JSX estático hoisteado fuera del componente (rendering-hoist-jsx): un glifo
// distinto por tipo para que el encabezado sea reconocible de un vistazo.
const TYPE_ICON = {
  node: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="currentColor"
        fillOpacity="0.18"
      />
    </svg>
  ),
  label: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 8h12M6 12h8M6 16h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  link: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 5v14M6 9h6M6 15h9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  ),
};

const SubMenu = () => {
  const {
    contextMenu,
    modifyNodeRadius,
    modifyNodeColor,
    modifyLabelSize,
    modifyLabelColor,
    modifyWidthPath,
    modifyColorPath,
    handleClose,
  } = useSubMenu();
  const { globalStyles } = useSelector(getTree);
  const dispatch = useDispatch();
  const { pointerX, pointerY, typeElement, toggled, component } = contextMenu;
  const componentId = component.data?.id;
  const menuRef = useRef(null);

  // Guarda el handler en una ref (advanced-event-handler-refs) para que los
  // listeners globales no se vuelvan a suscribir en cada render.
  const handleCloseRef = useRef(handleClose);
  handleCloseRef.current = handleClose;

  // Al abrir, mueve el foco al editor para que el teclado aterrice en él
  // (WCAG 2.1.2). `toggled` es true mientras está oculto.
  useEffect(() => {
    if (!toggled) {
      menuRef.current?.focus();
    }
  }, [toggled]);

  // Mientras está abierto: Escape cierra y un clic fuera también, ignorando el
  // popover del selector de color (se renderiza en un portal en <body>).
  useEffect(() => {
    if (toggled) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') handleCloseRef.current();
    };
    const onPointerDown = (event) => {
      const target = event.target;
      if (menuRef.current?.contains(target)) return;
      if (target.closest?.('[data-color-popover]')) return;
      handleCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [toggled]);

  const nodeRadius = component.data?.nodeStyle?.radius ?? globalStyles.nodeStyle.radius;
  const nodeFill = component.data?.nodeStyle?.fill ?? globalStyles.nodeStyle.fill;
  const labelFontSize = component.data?.labelStyle?.fontSize ?? globalStyles.labelStyle.fontSize;
  const labelFill = component.data?.labelStyle?.fill ?? globalStyles.labelStyle.fill;
  const pathStrokeWidth = component.data?.pathStyle?.strokeWidth ?? globalStyles.pathStyle.strokeWidth;
  const pathStroke = component.data?.pathStyle?.stroke ?? globalStyles.pathStyle.stroke;

  const meta = TYPE_META[typeElement] ?? { title: 'Editar elemento', hint: '' };

  // Descripción declarativa de los campos por tipo: una sola fuente de verdad
  // que el render recorre, en lugar de bloques condicionales repetidos.
  const fields = {
    node: [
      {
        control: 'number',
        id: 'submenu-node-radius',
        key: `node-radius-${componentId}`,
        label: 'Radio',
        value: nodeRadius,
        onChange: modifyNodeRadius,
      },
      {
        control: 'color',
        id: 'submenu-node-color',
        key: `node-color-${componentId}`,
        label: 'Color',
        srLabel: 'Color de nodo',
        value: nodeFill,
        onChange: modifyNodeColor,
      },
    ],
    label: [
      {
        control: 'number',
        id: 'submenu-label-size',
        key: `label-size-${componentId}`,
        label: 'Tamaño',
        value: labelFontSize,
        onChange: modifyLabelSize,
      },
      {
        control: 'color',
        id: 'submenu-label-color',
        key: `label-color-${componentId}`,
        label: 'Color',
        srLabel: 'Color de etiqueta',
        value: labelFill,
        onChange: modifyLabelColor,
      },
    ],
    link: [
      {
        control: 'number',
        id: 'submenu-path-width',
        key: `path-width-${componentId}`,
        label: 'Grosor',
        value: pathStrokeWidth,
        onChange: modifyWidthPath,
      },
      {
        control: 'color',
        id: 'submenu-path-color',
        key: `path-color-${componentId}`,
        label: 'Color',
        srLabel: 'Color de enlace',
        value: pathStroke,
        onChange: modifyColorPath,
      },
    ],
  };
  const activeFields = fields[typeElement] ?? [];

  const handleSelectSubtree = () => {
    if (!component.data) return;
    const ids = collectSubtreeIds(component.data);
    dispatch(addIds(ids));
    handleClose();
  };

  return (
    <div
      id="contextMenuObject"
      ref={menuRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="contextMenuTitle"
      tabIndex={-1}
      className="context-menu-pop absolute z-50 w-64 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl focus:outline-none"
      style={{
        left: `${pointerX}px`,
        top: `${pointerY}px`,
      }}
      hidden={toggled}
    >
      <header className="flex items-start gap-3 border-b border-ink/10 px-4 py-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-herbarium/10 text-herbarium"
          aria-hidden="true"
        >
          {TYPE_ICON[typeElement] ?? null}
        </span>
        <div className="min-w-0">
          <h2
            id="contextMenuTitle"
            className="font-display text-base font-semibold leading-tight text-ink"
          >
            {meta.title}
          </h2>
          {meta.hint ? <p className="mt-0.5 text-xs text-ink/60">{meta.hint}</p> : null}
        </div>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={handleClose}
          className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </header>

      <div className="px-4 pb-4 pt-3">
        <div className="space-y-3">
          {activeFields.map((field) =>
            field.control === 'number' ? (
              <div key={field.key} className="flex items-center justify-between gap-3">
                <label className="text-sm text-ink/80" htmlFor={field.id}>
                  {field.label}
                </label>
                <input
                  id={field.id}
                  key={field.key}
                  type="number"
                  className="h-9 w-28 rounded-lg border border-ink/15 bg-parchment px-2 font-mono text-sm text-ink focus:border-signal focus:outline-none"
                  placeholder="10"
                  min={0}
                  defaultValue={field.value}
                  onChange={field.onChange}
                />
              </div>
            ) : (
              <div key={field.key} className="flex items-center justify-between gap-3">
                <label className="text-sm text-ink/80" htmlFor={field.id}>
                  {field.label}
                </label>
                <ColorField
                  id={field.id}
                  key={field.key}
                  label={field.srLabel}
                  defaultValue={field.value}
                  swatchClassName="h-9 w-28 rounded-lg"
                  onChange={field.onChange}
                />
              </div>
            )
          )}
        </div>

        <div className="mt-4 border-t border-ink/10 pt-3">
          <button
            type="button"
            className="btn btn-sm btn-primary w-full gap-2 text-white"
            onClick={handleSelectSubtree}
          >
            <BranchGlyph className="h-4 w-4" />
            Seleccionar subárbol
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubMenu;
