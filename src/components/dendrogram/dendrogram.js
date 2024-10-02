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
    nodeStyle: { radius: globalNodeRadius, stroke: globalNodeStroke,  fill: globalNodeFill },
    labelStyle: { fontSize: globalLabelFontSize, fill: globalLabelFill },
    pathStyle: {
      stroke: globalPathStroke,
      fill: globalPathFill,
      strokeWidth: globalStrokeWidth,
      strokeOpacity: globalStrokeOpacity,
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
      const nodeStyle = node.data?.nodeStyle;
      const labelStyle = node.data?.labelStyle;
      const fontSize = labelStyle?.fontSize || globalLabelFontSize;
      const labelFill = labelStyle?.fill || globalLabelFill;
      const radius = nodeStyle?.radius || globalNodeRadius;
      const stroke = nodeStyle?.stroke || globalNodeStroke;
      const fill = nodeStyle?.fill || globalNodeFill;
      if (curveType === 'circular' || curveType === 'circular-step') {
        const turnLabelUpsideDown = x > 180;
        return (
          <g
            key={`node-${nodeIndex}`}
            transform={`rotate(${x - 90})translate(${y})`}
          >
            <circle
              cx={0}
              cy={0}
              r={radius}
              stroke={stroke}
              fill={fill}
              className="label hover:cursor-pointer"
              id={`node-${nodeIndex}`}
              onContextMenu={(e) => handleContextMenu(e, node, nodeIndex, 'node')}
            />
            {(
              <text
                x={turnLabelUpsideDown ? -15 : 15}
                y={-10}
                className="label hover:cursor-pointer"
                fontSize={fontSize}
                fill={labelFill}
                textAnchor={turnLabelUpsideDown ? 'end' : 'start'}
                transform={turnLabelUpsideDown ? 'rotate(180)' : 'rotate(0)'}
                alignmentBaseline="auto"
                id={`label-${nodeIndex}`}
                onContextMenu={(e) => handleContextMenu(e, node, nodeIndex, 'label')}
              >
                {name}
              </text>
            )}
          </g>
        );
      }

      return (
        <g key={`node-${nodeIndex}`} >
          <circle
            cx={y}
            cy={x}
            r={radius}
            stroke={stroke}
            fill={fill}
            id={`node-${nodeIndex}`}
            onContextMenu={(e) => handleContextMenu(e, node, nodeIndex, 'node')}
          />
          <text
            x={y + 30}
            y={x}
            fontSize={fontSize}
            fill={labelFill}
            textAnchor={children.length ? 'end' : 'start'}
            alignmentBaseline="central"
            id={`label-${nodeIndex}`}
            onContextMenu={(e) => handleContextMenu(e, node, nodeIndex, 'label')}
          >
            {name}
          </text>
        </g>
      );
    },
    [
      normalize,
      curveType,
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
      const strokeWidth = source.data?.pathStyle?.strokeWidth || globalStrokeWidth;
      const strokeOpacity = source.data?.pathStyle?.strokeOpacity || globalStrokeOpacity;

      if (curveType === 'circular' || curveType === 'circular-step') {
        if (depth === 0) {
          return (
            <g
              key={`link-${indexLink}`}
              transform={'rotate(' + (x - 90) + ')'}
              
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
                id={`link-${indexLink}`}
                onContextMenu={(e) => handleContextMenu(e, link, indexLink, 'link')}
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
            id={`link-${indexLink}`}
            onContextMenu={(e) => handleContextMenu(e, link, indexLink, 'link')}
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
      globalPathStroke,
      globalPathFill,
      globalStrokeWidth,
      globalStrokeOpacity,
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
