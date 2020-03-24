const { polygon, point } = require('@turf/helpers');
const destination = require('@turf/destination').default;
const bearing = require('@turf/bearing').default;
const union = require('@turf/union').default;

const AVAILABLE_UNITS = ['meters', 'kilometers', 'radians', 'degrees'];

const ERRORS = {
  UNKNOWN_FEATURE: 'Expected feature to be a geojson type Feature, See: https://leafletjs.com/examples/geojson/',
  UNKNOWN_GEOM_TYPE: 'Unknown geometry type! See: https://leafletjs.com/examples/geojson/',
  INVALID_RADIUS: 'Radius must be greater than zero',
  MULTIPOINT_SUPPORT: 'MultiPoint type is not supported at the moment',
  MULTILINE_SUPPORT: 'MultiLineString type is not supported at the moment',
  POLYGON_SUPPORT: 'Polygon type is not supported at the moment',
  MULTI_POLYGON_SUPPORT: 'MultiPolygon type is not supported at the moment',
  INVALID_STEPS: 'Steps must be a positive integer'
};

function pointBuffer(pt, radius, { units, steps }) {
  const ring = [];
  const resMultiple = 360 / steps;
  for (let i = 0; i < steps; i++) {
    const spoke = destination(pt, radius, i * resMultiple, { units });
    if (!spoke || !spoke.geometry.coordinates) {
      throw new Error('Couldnt find destination for point at iteration' + i);
    }
    ring.push(spoke.geometry.coordinates);
  }
  if (ring[0][0] !== ring[ring.length - 1][0] && ring[0][1] != ring[ring.length - 1][1]) {
    ring.push([ring[0][0], ring[0][1]]);
  }
  return polygon([ring]);
}

function lineBuffer(line, radius, { units, steps }) {
  let lineWithBuffer;
  //break line into segments
  const segments = [];
  for (let i = 0; i < line.geometry.coordinates.length - 1; i++) {
    segments.push([line.geometry.coordinates[i], line.geometry.coordinates[i + 1]]);
  }
  /*create a set of boxes parallel to the segments

     ---------
     ((|¯¯¯¯¯¯¯¯¯|))
     (((|---------|)))
     ((|_________|))
  */
  for (let i = 0; i < segments.length; i++) {
    const bottom = point(segments[i][0]);
    const top = point(segments[i][1]);

    const direction = bearing(bottom, top);

    const bottomLeft = destination(bottom, radius, direction - 90, { units });
    const bottomRight = destination(bottom, radius, direction + 90, { units });
    const topLeft = destination(top, radius, direction - 90, { units });
    const topRight = destination(top, radius, direction + 90, { units });

    const polyCoords = [[bottomLeft.geometry.coordinates, topLeft.geometry.coordinates]];

    // add top curve
    const spokeNum = Math.floor(steps / 2);
    const topStart = bearing(top, topLeft);
    for (let k = 1; k < spokeNum; k++) {
      const spokeDirection = topStart + 180 * (k / spokeNum);
      const spoke = destination(top, radius, spokeDirection, { units });
      polyCoords[0].push(spoke.geometry.coordinates);
    }
    // add right edge
    polyCoords[0].push(topRight.geometry.coordinates);
    polyCoords[0].push(bottomRight.geometry.coordinates);
    //add bottom curve
    const bottomStart = bearing(bottom, bottomRight);
    for (let k = 1; k < spokeNum; k++) {
      const spokeDirection = bottomStart + 180 * (k / spokeNum);
      const spoke = destination(bottom, radius, spokeDirection, { units });
      polyCoords[0].push(spoke.geometry.coordinates);
    }
    polyCoords[0].push(bottomLeft.geometry.coordinates);
    if (!lineWithBuffer) {
      lineWithBuffer = polygon(polyCoords);
    } else {
      lineWithBuffer = union(lineWithBuffer, polygon(polyCoords));
    }
  }
  return lineWithBuffer;
}

module.exports = function(feature, radius, options = { units: 'meters', steps: 36 }) {
  if (!feature || feature.type !== 'Feature' || !feature.geometry) {
    throw new Error(ERRORS.UNKNOWN_FEATURE);
  }

  if (!radius || radius <= 0) {
    throw new Error(ERRORS.INVALID_RADIUS);
  }
  const { units, steps } = options;
  if (!units || !AVAILABLE_UNITS.includes(units)) {
    throw new Error('Unknown units type! Must be on of: ' + AVAILABLE_UNITS.join(', '));
  }

  if (steps <= 0) {
    throw new Error(ERRORS.INVALID_STEPS);
  }

  const geom = feature.geometry;

  switch (geom.type) {
    case 'Point':
      return pointBuffer(feature, radius, { units, steps });
    case 'MultiPoint':
      throw new Error(ERRORS.MULTIPOINT_SUPPORT);
    // return featurecollection(geom.coordinates.map(p => pointBuffer(p, radius, { units, steps })));
    case 'LineString':
      return lineBuffer(feature, radius, { units, steps });
    case 'MultiLineString':
      throw new Error(ERRORS.MULTILINE_SUPPORT);
    // return featurecollection(geom.coordinates.map(l => lineBuffer(l, radius, { units, steps })));
    case 'Polygon':
      throw new Error(ERRORS.POLYGON_SUPPORT);
    case 'MultiPolygon':
      throw new Error(ERRORS.MULTI_POLYGON_SUPPORT);
    default:
      throw new Error(ERRORS.UNKNOWN_GEOM_TYPE);
  }
};
