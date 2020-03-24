[![Build Status](https://travis-ci.org/arkhemlol/geobuffer.svg?branch=master)](https://travis-ci.org/arkhemlol/geobuffer)

### Geographical buffer of the given radius around polyline or point, based on turf-union and turf-buffer

Works also for polylines with self-intersections.

Polygon, MultiPoint, MultiLineString as well as negative buffers are not supported at the moment.

## Usage

```
  import buffer from 'geobuffer';

  // for Point (geojson type Point)
  const point = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [
        37.626286,
        55.761412
      ]
    }
  }
  // for Polyline (geojson type LineString)
  const line = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          37.553329,
          55.752332
        ],
        [
          37.562599,
          55.773097
        ],
        [
          37.585945,
          55.764503
        ],
        [
          37.611351,
          55.753685
        ]
      ]
    }
  }
  const radius = 20;
  const units = 'kilometers'; // default: meters
  // Number of steps, i.e. 360 / 36 = 10  -> 36 segments of 10 degrees each
  const steps = 72; // default: 36

  const result = buffer(point /* line */, radius, { units, steps } ); // geojson type Polygon

```

## Develop

Install dependencies by executing `npm install` from the repository root.

Run `npm start` for testing with `Leaflet.Draw`. Draw a circle or a polyline, finish it with double click. Buffer will be shown.

`npm run build` builds a library.

`npm test` runs tests.
