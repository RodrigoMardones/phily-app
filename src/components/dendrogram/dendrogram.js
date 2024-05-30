import { useCallback, useMemo, forwardRef } from 'react';
import * as d3 from 'd3';
import { dendrogramGenerator, drawCurve, transformSVG, MARGIN } from './utils';

const Dendrogram = ({ data, width, height, normalize, curveType, angle }, ref) => {
  const hierarchy = useMemo(() => {
    const HierarchyCreated = d3.hierarchy(data);
    HierarchyCreated.sort((a, b) => d3.ascending(a.data.name, b.data.name));
    return HierarchyCreated;
  }, [data]);

  const radius = useMemo(() => {
    return Math.min(width, height) / 2 - MARGIN;
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
  // podria separar esto en otros componentes
  const renderNode = useCallback(
    (node, nodeIndex) => {
      if (curveType === 'circular' || curveType === 'circular-step') {
        const turnLabelUpsideDown = node.x > 180;
        const nodeStyle = node.data.nodeStyle;
        return (
          <g
            key={`node-${nodeIndex}`}
            transform={`rotate(${node.x - 90})translate(${node.y})`}
          >
            <circle cx={0} cy={0} r={nodeStyle.radius} stroke={nodeStyle.stroke} fill={nodeStyle.fill} />
            {!node.children && (
              <text
                x={turnLabelUpsideDown ? -15 : 15}
                y={0}
                fontSize={12}
                textAnchor={turnLabelUpsideDown ? 'end' : 'start'}
                transform={turnLabelUpsideDown ? 'rotate(180)' : 'rotate(0)'}
                alignmentBaseline="middle"
              >
                {node.data.name}
              </text>
            )}
          </g>
        );
      }
      const nodeStyle = node.data.nodeStyle;
      const textStyle = node.data.textStyle;
      return (
        <g key={`node-${nodeIndex}`}>
          <circle
            cx={node.y}
            cy={node.x}
            r={nodeStyle.radius}
            stroke={nodeStyle.stroke}
            fill={nodeStyle.fill}
          />
          <text
            x={node.y + 30}
            y={node.x}
            fontSize={textStyle.fontSize}
            textAnchor={node.children ? 'end' : 'start'}
            alignmentBaseline="central"
          >
            {node.data.name}
          </text>
        </g>
      );
    },
    [normalize, curveType]
  );

  const renderEdges = useCallback(
    (link, indexLink) => {
      if (curveType === 'circular' || curveType === 'circular-step') {
        
        if (link?.source?.depth === 0) {
          const targetStyle = link.target.data.pathStyle;
          return (
            <g
              key={`link-${indexLink}`}
              transform={'rotate(' + (link.target.x - 90) + ')'}
            >
              <line 
              x1={0} 
              y1={0} 
              x2={link.target.y} 
              y2={0}
              stroke={targetStyle.stroke}
              fill={targetStyle.fill}
              strokeWidth={targetStyle.strokeWidth}
              strokeOpacity={targetStyle.strokeOpacity}
              />;
            </g>
          );
        }
        const sourceStyle = link.source.data.pathStyle;
        return (
          <path
            key={`link-${indexLink}`}
            fill={sourceStyle.fill}
            stroke={sourceStyle.stroke}
            strokeOpacity={sourceStyle.strokeOpacity}
            strokeWidth={sourceStyle.strokeWidth}
            d={curve(link) || undefined}
          />
        );
      } else {
        if (!link.source) {
          return null;
        }
        const sourceStyle = link.source.data.pathStyle;
        return (
          <path
            key={`link-${indexLink}`}
            fill={sourceStyle.fill}
            stroke={sourceStyle.stroke}
            strokeOpacity={sourceStyle.strokeOpacity}
            strokeWidth={sourceStyle.strokeWidth}
            d={curve({
              source: [link.source.y, link.source.x],
              target: [link.target.y, link.target.x],
            })}
          />
        );
      }
    },
    [normalize, curveType]
  );

  const allNodes = dendrogram.descendants().map(renderNode);
  const allEdges = dendrogram.links().map(renderEdges);

  return (
    
      <g transform={transform} ref={ref}>
        {allEdges}
        {allNodes}
      </g>
  );
};
const forwardDendrogram = forwardRef(Dendrogram);
export default forwardDendrogram;
