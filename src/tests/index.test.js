const buffer = require('../index');

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

test('it should throw error, when invalid feature is passed', () => {
  expect(buffer).toThrow(ERRORS.UNKNOWN_FEATURE);
  expect(() => buffer({ type: 'Blabla' })).toThrow(ERRORS.UNKNOWN_FEATURE);
  expect(() => buffer({ type: 'Feature' }, 10)).toThrow(ERRORS.UNKNOWN_FEATURE);
  expect(() => buffer({ type: 'Blabla', geometry: {} }, 10)).toThrow(ERRORS.UNKNOWN_FEATURE);
});

test('it should throw error, when invalid geometry type is passed', () => {
  expect(() => buffer({ type: 'Feature', geometry: { type: 'Invalid' } }, 10)).toThrow(ERRORS.UNKNOWN_GEOM_TYPE);
  expect(() => buffer({ type: 'Feature', geometry: {} }, 10)).toThrow(ERRORS.UNKNOWN_GEOM_TYPE);
});

test('it should throw error when invalid radius is passed', () => {
  expect(() => buffer({ type: 'Feature', geometry: { type: 'Point' } }, -10)).toThrow(ERRORS.INVALID_RADIUS);
  expect(() => buffer({ type: 'Feature', geometry: { type: 'Point' } }, '')).toThrow(ERRORS.INVALID_RADIUS);
  expect(() => buffer({ type: 'Feature', geometry: { type: 'Point' } }, 0)).toThrow(ERRORS.INVALID_RADIUS);
  expect(() => buffer({ type: 'Feature', geometry: { type: 'Point' } }, 10)).not.toThrow(ERRORS.INVALID_RADIUS);
});

test('it should throw error when invalid unit type is passed', () => {
  expect(() => buffer({ type: 'Feature', geometry: { type: 'Point' } }, 10, { units: 'gnomes' })).toThrow(
    'Unknown units type! Must be on of: ' + AVAILABLE_UNITS.join(', ')
  );
  expect(() => buffer({ type: 'Feature', geometry: { type: 'Point' } }, 10, { units: 'meters' })).not.toThrow(
    'Unknown units type! Must be on of: ' + AVAILABLE_UNITS.join(', ')
  );
});

test('it should throw error on unsupported geometry types', () => {
  expect(() => buffer({ type: 'Feature', geometry: { type: 'MultiPoint' } }, 10)).toThrow(ERRORS.MULTIPOINT_SUPPORT);
  expect(() => buffer({ type: 'Feature', geometry: { type: 'MultiLineString' } }, 10)).toThrow(ERRORS.MULTILINE_SUPPORT);
  expect(() => buffer({ type: 'Feature', geometry: { type: 'Polygon' } }, 10)).toThrow(ERRORS.POLYGON_SUPPORT);
  expect(() => buffer({ type: 'Feature', geometry: { type: 'MultiPolygon' } }, 10)).toThrow(ERRORS.MULTI_POLYGON_SUPPORT);
  expect(() => buffer({ type: 'Feature', geometry: { type: 'Point', coordinates: [37, 54] } }, 10)).not.toThrow();
  expect(() =>
    buffer(
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [37, 54],
            [38, 53]
          ]
        }
      },
      10
    )
  ).not.toThrow();
});

test('it should output feature with geometry type polygon', () => {
  const result = buffer({ type: 'Feature', geometry: { type: 'Point', coordinates: [37, 54] } }, 100);
  const result2 = buffer(
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [37, 54],
          [38, 55]
        ]
      }
    },
    100
  );
  expect(result.type).toEqual('Feature');
  expect(result.geometry.type).toEqual('Polygon');
  expect(result2.type).toEqual('Feature');
  expect(result2.geometry.type).toEqual('Polygon');
});
