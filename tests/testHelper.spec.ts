/**
 * Created by LobanovI on 12.02.2016.
 */

import L      = require("leaflet");
import delaunay = require("delaunay");
module testHelper {
    import FeatureGroup = L.FeatureGroup;
    const zoom = 12;
    export function geometryToPixels(geometry:any):any {
        var layer: L.ILayer = L.GeoJSON.geometryToLayer(geometry);
        if (layer instanceof L.Marker) {
            return layerToPixels<L.Marker>(layer, 'point');
        } else if (layer instanceof L.FeatureGroup) {
            return layerToPixels<L.FeatureGroup<L.Marker>>(layer, 'multipoint');
        } else if (layer instanceof L.Polyline) {
            return layerToPixels<L.Polyline>(layer, 'line');
        } else if (layer instanceof L.Polygon) {
            return layerToPixels<L.Polygon>(layer, 'polygon');
        }
    }
    function layerToPixels<T>(layer: T, type: string): L.Point[] | L.Point {
        var result: Array<L.Point> = [];
        switch(type) {
            case 'point':
                return L.CRS.EPSG3857.latLngToPoint(layer, zoom);
            case 'line':
            case 'multipoint':
            case 'polygon':
                var latlngs: L.LatLng[] = layer.getLatLngs();
                for(var i = 0; i < latlngs.length; i++) {
                    result.push(L.CRS.EPSG3857.latLngToPoint(latlngs[i], zoom));
                }
                return result;
            default:
                throw new Error('Unknown geometry type!');
        }
    }
}
export = testHelper;