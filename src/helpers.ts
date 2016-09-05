/**
 * Created by LobanovI on 12.02.2016.
 */
import L = require("leaflet/dist/leaflet.js");

export module Leaflet {
    export class Layer {
        public zoom:number;
        public layer: L.ILayer;
        public projection: L.ICRS;
        static R: number = 6378137;

        static geometryToPixels(geometry:any):L.ILayer {
            return L.GeoJSON.geometryToLayer(geometry);
        }

        constructor(geometry:any, zoom?:number, proj?: L.ICRS) {
            this.zoom = zoom ? zoom : 12;
            this.projection = proj || L.CRS.EPSG3857;
            this.layer = Layer.geometryToPixels(geometry);
        }

        public toPixels():any {
            if (this.layer instanceof L.Marker) {
                return this._pointToPixels(<L.Marker>this.layer);
            } else if (this.layer instanceof L.Polyline) {
                return this._plineToPixels(<L.Polyline>this.layer);
            } else {
                throw new Error('Unknown geometry type!');
            }
        }

        public fromPixels(pixels:number[][][]):L.Polygon {
            var latlngs:L.LatLng[] = [];
            for (var i = 0; i < pixels[0].length; i++) {
                var point = Layer.transform(new L.Point(pixels[0][i][0], pixels[0][i][1]));
                latlngs.push(this.projection.pointToLatLng(point, this.zoom));
            }
            return new L.Polygon(latlngs);
        }

        /**
         * @desc Mercator projection Y-axis heads from north to south, but we
         * are in cartesian reference system, where Y-axis heads from south to north
         */
        static transform(point: L.Point, scale?: number): L.Point {
            var transformation = new L.Transformation(1, 0, -1, 0);
            return transformation.transform(point, scale || 1);
        }

        public scale(value: number) {
            var scaleTr = 0.5 / (Math.PI * Layer.R);
            var scale = this.projection.scale(this.zoom);
            return value * scaleTr * scale;
        }

        private _pointToPixels(layer: L.Marker): number[] {
            var _point:L.Point = Layer.transform(this.projection.latLngToPoint(layer.getLatLng(), this.zoom));
            return [_point.x, _point.y];
        }

        private _plineToPixels(layer: L.Polyline): number[][] {
            var result:number[][] = [];
            var latlngs:L.LatLng[] = layer.getLatLngs();
            for (var i = 0; i < latlngs.length; i++) {
                var _point = Layer.transform(this.projection.latLngToPoint(latlngs[i], this.zoom));
                result.push([_point.x, _point.y]);
            }
            return result;
        }
    }
}