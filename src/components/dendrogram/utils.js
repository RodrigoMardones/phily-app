import { link, cluster, tree, curveStep, curveBumpX, curveLinear } from 'd3';
const MARGIN = 70;

function linkStep(startAngle, startRadius, endAngle, endRadius) {
  var c0 = Math.cos((startAngle = ((startAngle - 90) / 180) * Math.PI)),
    s0 = Math.sin(startAngle),
    c1 = Math.cos((endAngle = ((endAngle - 90) / 180) * Math.PI)),
    s1 = Math.sin(endAngle);
  return (
    'M' +
    startRadius * c0 +
    ',' +
    startRadius * s0 +
    (endAngle === startAngle
      ? ''
      : 'A' +
        startRadius +
        ',' +
        startRadius +
        ' 0 0 ' +
        (endAngle > startAngle ? 1 : 0) +
        ' ' +
        startRadius * c1 +
        ',' +
        startRadius * s1) +
    'L' +
    endRadius * c1 +
    ',' +
    endRadius * s1
  );
}

function linkConstant(d) {
  return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
}

const degToRad = (deg) => {
  return (deg * 2 * Math.PI) / 360;
};

const dendrogramGenerator = (width, height, normalize, curveType, angle) => {
  if (curveType === 'circular' || curveType === 'circular-step') {
    return normalize
      ? cluster().size([angle, width])
      : tree().size([angle, width]);
  } else {
    return normalize
      ? cluster().size([height, width])
      : tree().size([height, width]);
  }
};

const drawCurve = (curveType) => {
  switch (curveType) {
    case 'step':
      return link(curveStep);
    case 'curve':
      return link(curveBumpX);
    case 'slanted':
      return link(curveLinear);
    case 'circular':
      return d3
        .linkRadial()
        .angle((node) => degToRad(node.x))
        .radius((node) => node.y);
    case 'circular-step':
      return linkConstant;
  }
};

const transformSVG = (curveType, radius) => {
  if (curveType === 'circular' || curveType === 'circular-step') {
    return 'translate(' + radius / 2 + ',' + radius / 2 + ')';
  }
  return `translate(${[0, 0].join(',')})`;
};

export {
  linkConstant,
  degToRad,
  dendrogramGenerator,
  drawCurve,
  transformSVG,
  MARGIN,
};
