import { useCallback, useMemo } from 'react';
import { dendrogramGenerator, drawCurve, transformSVG } from './utils';
import { hierarchy, ascending } from 'd3';
import useSubMenu from '../submenu/useSubmenu';
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedIds, toggleId, addIds } from '../store/selection/slice';
import { getHighlightedNodeName } from '../store/dashboard/slice';
import { collectSubtreeIds } from '@/lib/TreeData';
const Dendrogram = ({
  data,
  width,
  height,
  normalize,
  curveType,
  angle,
  globalStyles,
}) => {
  const { handleContextMenu } = useSubMenu();
  const selectedIds = useSelector(getSelectedIds);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const highlightedNodeName = useSelector(getHighlightedNodeName);
  const dispatch = useDispatch();
  const prefersReducedMotion = usePrefersReducedMotion();

  const radius = useMemo(() => {
    return Math.min(width, height) / 2;
  }, [width, height]);

  const [curve, transform] = useMemo(() => {
    return [drawCurve(curveType), transformSVG(curveType, radius)];
  }, [curveType, radius]);

  const dendrogram = useMemo(() => {
    const h = hierarchy(data);
    h.sort((a, b) => ascending(a.data.name, b.data.name));
    const layout = dendrogramGenerator(width, height, normalize, curveType, angle);
    return layout(h);
  }, [data, width, height, normalize, curveType, angle]);

  const nodes = useMemo(() => dendrogram.descendants(), [dendrogram]);
  const links = useMemo(() => dendrogram.links(), [dendrogram]);

  const {
    nodeStyle: {
      radius: globalNodeRadius,
      stroke: globalNodeStroke,
      fill: globalNodeFill,
    },
    labelStyle: { fontSize: globalLabelFontSize, fill: globalLabelFill },
    pathStyle: {
      stroke: globalPathStroke,
      fill: globalPathFill,
      strokeWidth: globalStrokeWidth,
      strokeOpacity: globalStrokeOpacity,
    },
  } = globalStyles;

  const handleElementContextMenu = useCallback((e) => {
    const id = e.target.id;
    if (!id) return;
    const match = id.match(/^(node|label|link)-(\d+)$/);
    if (!match) return;
    const [, type, indexStr] = match;
    const index = parseInt(indexStr, 10);
    const element = type === 'link' ? links[index] : nodes[index];
    handleContextMenu(e, element, index, type);
  }, [nodes, links, handleContextMenu]);

  const handleElementClick = useCallback((e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.stopPropagation();
    const id = e.target.id;
    if (!id) return;
    const match = id.match(/^(node|label|link)-(\d+)$/);
    if (!match) return;
    const [, type, indexStr] = match;
    const index = parseInt(indexStr, 10);
    const element = type === 'link' ? links[index] : nodes[index];
    const nodeData = type === 'link' ? element.source.data : element.data;
    if (e.shiftKey) {
      const subtreeIds = collectSubtreeIds(nodeData);
      dispatch(addIds(subtreeIds));
    } else {
      dispatch(toggleId(nodeData.id));
    }
  }, [nodes, links, dispatch]);

  const renderNode = useCallback(
    (node, nodeIndex) => {
      const {
        children = [],
        data: { name, id: nodeId },
        x,
        y,
      } = node;
      const isSelected = selectedSet.has(nodeId);
      const nodeStyle = node.data?.nodeStyle;
      const labelStyle = node.data?.labelStyle;
      const fontSize = labelStyle?.fontSize || globalLabelFontSize;
      const labelFill = labelStyle?.fill || globalLabelFill;
      const radius = nodeStyle?.radius || globalNodeRadius;
      const stroke = nodeStyle?.stroke || globalNodeStroke;
      const fill = nodeStyle?.fill || globalNodeFill;
      const isHighlighted = name === highlightedNodeName;
      if (curveType === 'circular' || curveType === 'circular-step') {
        const turnLabelUpsideDown = x > 180;
        return (
          <g
            key={`node-${nodeIndex}`}
            transform={`rotate(${x - 90})translate(${y})`}
          >
            {isSelected && (
              <circle cx={0} cy={0} r={radius + 6} fill="none" stroke="#498BCA" strokeWidth={3} strokeDasharray="4 2" />
            )}
            {isHighlighted && (
              <circle cx={0} cy={0} r={radius + 10} fill="none" stroke="#E6A817" strokeWidth={2.5}>
                {!prefersReducedMotion && (
                  <>
                    <animate attributeName="r" from={radius + 8} to={radius + 14} dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="1" to="0.3" dur="1s" repeatCount="indefinite" />
                  </>
                )}
              </circle>
            )}
            <circle
              cx={0}
              cy={0}
              r={radius}
              stroke={stroke}
              fill={fill}
              className="hover:cursor-pointer"
              id={`node-${nodeIndex}`}
              data-node-id={nodeId}
            />
            {
              <text
                x={turnLabelUpsideDown ? -15 : 15}
                y={-10}
                className="label hover:cursor-pointer"
                fontSize={fontSize}
                fill={labelFill}
                textAnchor={turnLabelUpsideDown ? 'end' : 'start'}
                transform={turnLabelUpsideDown ? 'rotate(180)' : 'rotate(0)'}
                textDecoration={isSelected ? 'underline' : 'none'}
                alignmentBaseline="auto"
                id={`label-${nodeIndex}`}
              >
                {name}
              </text>
            }
          </g>
        );
      }

      return (
        <g key={`node-${nodeIndex}`}>
          {isSelected && (
            <circle cx={y} cy={x} r={radius + 6} fill="none" stroke="#498BCA" strokeWidth={3} strokeDasharray="4 2" />
          )}
          {isHighlighted && (
            <circle cx={y} cy={x} r={radius + 10} fill="none" stroke="#E6A817" strokeWidth={2.5}>
              {!prefersReducedMotion && (
                <>
                  <animate attributeName="r" from={radius + 8} to={radius + 14} dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="1" to="0.3" dur="1s" repeatCount="indefinite" />
                </>
              )}
            </circle>
          )}
          <circle
            cx={y}
            cy={x}
            r={radius}
            stroke={stroke}
            fill={fill}
            id={`node-${nodeIndex}`}
            className="hover:cursor-pointer"
            data-node-id={nodeId}
          />
          <text
            x={y + 30}
            y={x}
            fontSize={fontSize}
            fill={labelFill}
            textAnchor={children.length ? 'end' : 'start'}
            textDecoration={isSelected ? 'underline' : 'none'}
            alignmentBaseline="central"
            id={`label-${nodeIndex}`}
            className="label hover:cursor-pointer"
          >
            {name}
          </text>
        </g>
      );
    },
    [
      curveType,
      selectedSet,
      highlightedNodeName,
      prefersReducedMotion,
      globalNodeRadius,
      globalNodeStroke,
      globalNodeFill,
      globalLabelFontSize,
      globalLabelFill,
    ]
  );

  const renderEdges = useCallback(
    (link, indexLink) => {
      const {
        source: { depth = 0 },
        target: { x, y },
        source,
      } = link;
      const pathStroke = source.data?.pathStyle?.stroke || globalPathStroke;
      const pathFill = source.data?.pathStyle?.fill || globalPathFill;
      const strokeWidth =
        source.data?.pathStyle?.strokeWidth || globalStrokeWidth;
      const strokeOpacity =
        source.data?.pathStyle?.strokeOpacity || globalStrokeOpacity;

      if (curveType === 'circular' || curveType === 'circular-step') {
        if (depth === 0) {
          return (
            <g key={`link-${indexLink}`} transform={'rotate(' + (x - 90) + ')'}>
              <line
                x1={0}
                y1={0}
                x2={y}
                y2={0}
                stroke={pathStroke}
                fill={pathFill}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                id={`link-${indexLink}`}
                className="hover:cursor-pointer"
              />
              ;
            </g>
          );
        }
        return (
          <path
            key={`link-${indexLink}`}
            fill={pathFill}
            stroke={pathStroke}
            strokeOpacity={strokeOpacity}
            strokeWidth={strokeWidth}
            d={curve(link) || undefined}
            className="hover:cursor-pointer"
            id={`link-${indexLink}`}
          />
        );
      } else {
        if (!source) {
          return null;
        }
        return (
          <path
            key={`link-${indexLink}`}
            fill={pathFill}
            stroke={pathStroke}
            strokeOpacity={strokeOpacity}
            strokeWidth={strokeWidth}
            id={`link-${indexLink}`}
            className="hover:cursor-pointer"
            d={curve({
              source: [link.source.y, link.source.x],
              target: [link.target.y, link.target.x],
            })}
          />
        );
      }
    },
    [
      curveType,
      globalPathStroke,
      globalPathFill,
      globalStrokeWidth,
      globalStrokeOpacity,
      curve,
    ]
  );

  const allNodes = useMemo(
    () => nodes.map(renderNode),
    [nodes, renderNode]
  );
  const allEdges = useMemo(
    () => links.map(renderEdges),
    [links, renderEdges]
  );

  return (
    <g transform={transform} id="dendrogram-g" onContextMenu={handleElementContextMenu} onClick={handleElementClick}>
      {allEdges}
      {allNodes}
    </g>
  );
};
export default Dendrogram;
