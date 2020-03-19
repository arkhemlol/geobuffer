import { featurecollection, polygon, point } from '@turf/helpers';

import destination from '@turf/destination';
import bearing from '@turf/bearing';
import union from '@turf/union';

function pointBuffer(pt, radius, units, resolution) {
  const ring = [];
  const resMultiple = 360 / resolution;
  for (let i = 0; i < resolution; i++) {
    const spoke = destination(pt, radius, i * resMultiple, { units });
    ring.push(spoke.geometry.coordinates);
  }
  if (ring[0][0] !== ring[ring.length - 1][0] && ring[0][1] != ring[ring.length - 1][1]) {
    ring.push([ring[0][0], ring[0][1]]);
  }
  return polygon([ring]);
}

function lineBuffer(line, radius, units, resolution) {
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
    const spokeNum = Math.floor(resolution / 2);
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

export default function(feature, radius, units, resolution) {
  if (!resolution) resolution = 36;
  const geom = feature.geometry;
  if (geom.type === 'Point') {
    return pointBuffer(feature, radius, units, resolution);
  } else if (geom.type === 'MultiPoint') {
    const buffers = [];
    geom.coordinates.forEach(function(coords) {
      buffers.push(pointBuffer(point(coords[0], coords[1]), radius, units, resolution));
    });
    return featurecollection(buffers);
  } else if (geom.type === 'LineString') {
    return lineBuffer(feature, radius, units, resolution);
  } else if (geom.type === 'MultiLineString') {
    const buffers = [];
    geom.coordinates.forEach(function(line) {
      buffers.push(lineBuffer(feature, radius, units, resolution));
    });
  } else if (geom.type === 'Polygon') {
  } else if (geom.type === 'MultiPolygon') {
  }
}
