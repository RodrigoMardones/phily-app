import { useCallback, useMemo, useState } from 'react';
import { dendrogramGenerator, drawCurve, transformSVG } from './utils';
import SubMenu from '../submenu/submenu';
import * as d3 from 'd3';
import useSubMenu from '../submenu/useSubmenu';
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
  const hierarchy = useMemo(() => {
    const HierarchyCreated = d3.hierarchy(data);
    HierarchyCreated.sort((a, b) => d3.ascending(a.data.name, b.data.name));
    return HierarchyCreated;
  }, [data]);

  const radius = useMemo(() => {
    return Math.min(width, height) / 2;
  }, [width, height]);

  const [curve, transform] = useMemo(() => {
    return [drawCurve(curveType), transformSVG(curveType, radius)];
  }, [curveType, radius]);

  const dendrogram = useMemo(() => {
    const dendogramCreated = dendrogramGenerator(
      width,
      height,
      normalize,
      curveType,
      angle
    );
    return dendogramCreated(hierarchy);
  }, [hierarchy, width, height, normalize, curveType, angle]);
  const {
    nodeStyle: { radius: globalRadius, stroke, fill },
    labelStyle: { fontSize, fill: labelFill, color },
    pathStyle: {
      stroke: pathStroke,
      fill: pathFill,
      strokeWidth,
      strokeOpacity,
    },
  } = globalStyles;
  // podria separar esto en otros componentes
  const renderNode = useCallback(
    (node, nodeIndex) => {
      const {
        children = [],
        data: { name },
        x,
        y,
      } = node;
      if (curveType === 'circular' || curveType === 'circular-step') {
        const turnLabelUpsideDown = x > 180;
        // const nodeStyle = node.data.nodeStyle;
        return (
          <g
            key={`node-${nodeIndex}`}
            transform={`rotate(${x - 90})translate(${y})`}
          >
            <circle
              cx={0}
              cy={0}
              r={globalRadius}
              stroke={stroke}
              fill={fill}
              className="label hover:cursor-pointer"
              onContextMenu={(e) => handleContextMenu(e, node)}
            />
            {!children.length && (
              <text
                x={turnLabelUpsideDown ? -15 : 15}
                y={0}
                className="label hover:cursor-pointer"
                fontSize={fontSize}
                fill={labelFill}
                textAnchor={turnLabelUpsideDown ? 'end' : 'start'}
                transform={turnLabelUpsideDown ? 'rotate(180)' : 'rotate(0)'}
                alignmentBaseline="middle"
                onContextMenu={(e) => handleContextMenu(e, node)}
              >
                {name}
              </text>
            )}
          </g>
        );
      }

      return (
        <g key={`node-${nodeIndex}`}>
          <circle
            cx={y}
            cy={x}
            r={globalRadius}
            stroke={stroke}
            fill={fill}
            onContextMenu={(e) => handleContextMenu(e, node)}
          />
          <text
            x={y + 30}
            y={x}
            fontSize={fontSize}
            fill={labelFill}
            textAnchor={children.length ? 'end' : 'start'}
            alignmentBaseline="central"
            onContextMenu={(e) => handleContextMenu(e, node)}
          >
            {name}
          </text>
        </g>
      );
    },
    [
      normalize,
      curveType,
      globalStyles,
      globalRadius,
      stroke,
      fill,
      fontSize,
      labelFill,
    ]
  );

  const renderEdges = useCallback(
    (link, indexLink) => {
      const {
        source: { depth = 0 },
        target: { x, y },
        source,
      } = link;
      if (curveType === 'circular' || curveType === 'circular-step') {
        if (depth === 0) {
          return (
            <g
              key={`link-${indexLink}`}
              transform={'rotate(' + (x - 90) + ')'}
              onContextMenu={(e) => handleContextMenu(e, link)}
            >
              <line
                x1={0}
                y1={0}
                x2={y}
                y2={0}
                stroke={pathStroke}
                fill={pathFill}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
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
            onContextMenu={(e) => handleContextMenu(e, link)}
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
            onContextMenu={(e) => handleContextMenu(e, link)}
            d={curve({
              source: [link.source.y, link.source.x],
              target: [link.target.y, link.target.x],
            })}
          />
        );
      }
    },
    [
      normalize,
      curveType,
      globalStyles,
      pathStroke,
      pathFill,
      strokeWidth,
      strokeOpacity,
    ]
  );

  const allNodes = useCallback(
    () => dendrogram.descendants().map(renderNode),
    [dendrogram, renderNode]
  );
  const allEdges = useCallback(
    () => dendrogram.links().map(renderEdges),
    [dendrogram, renderEdges]
  );

  return (
    <g transform={transform} id="dendrogram-g">
      {allEdges()}
      {allNodes()}
    </g>
  );
};
export default Dendrogram;
