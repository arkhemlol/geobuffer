# Geometry buffer (geojson, wkt)  
TypeScript implementation of buffer point and polyline algorithms

## Usage

### Clone repository and install dependencies
    npm install
    bower install
### Example
```js   
var polyline = {
    "type": "Feature",
    "geometry": {"type": "LineString", 
        "coordinates":
           [
               [
                   34.5286213832762,
                   58.45962524414062
               ],
               [
                   34.54841811625336,
                   58.50151062011719
               ],
               [
                   34.61625687562895,
                   58.531723022460945
               ],
               [
                   34.65523908026755,
                   58.530349731445305
               ],
               [
                   34.70831578223845,
                   58.45550537109375
               ],
               [
                   34.65806316573297,
                   58.41636657714844
               ],
               [
                   34.651285198954135,
                   58.363494873046875
               ],
               [
                   34.62925297943919,
                   58.34564208984375
               ]
           ]},
    "properties": {
       "name": "Polyline",
       "category": "Route"
    }
};
var buffer =  buffer.Buffer.fromGeoJson(polyline);
buffer.distance = 350; // meters are default
var output = buffer.toGeoJson();   
```
### Tests
    karma start
### Build  
For UMD bundle (AMD + CommonJS + global var) type:  
```webpack ```    

