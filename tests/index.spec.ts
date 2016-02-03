/**
 * Created by LobanovI on 20.10.2015.
 */
///<reference path="../typings/delaunay/delaunay.d.ts"/>
///<reference path="../typings/jasmine/jasmine.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
///<reference path="../typings/jasmine-jquery/jasmine-jquery.d.ts"/>
///<reference path="../typings/leaflet/leaflet.d.ts"/>

import buffer = require("src/index");

function pointToPixels(point) {

}

//function multiPointToPixels(pts) {
//
//}

function lineToPixels(line) {

}

describe("module for creating buffer around simple geometries", () => {
        "use strict";
        var pt: number[],
            //multipt: number[][],
            line: number[][];
        beforeEach(() => {
            jasmine.getJSONFixtures().fixturesPath = "base/tests/mocks";
            pt = pointToPixels(jasmine.getJSONFixtures().load("Point.geojson")["Point.geojson"]);
            //multipt = multiPointToPixels(jasmine.getJSONFixtures().load("MultiPoint.geojson")["MultiPoint.geojson"]);
            line = lineToPixels(jasmine.getJSONFixtures().load("LineString.geojson")["LineString.geojson"]);
        });
        it("should import module", () => {
            expect(buffer.Buffer).not.toBeUndefined();
        });
        it("should accept options", () => {
            var bufP: buffer.IBuffer = buffer.Buffer.fromGeoJson(pt, {"units" : "Kilometers", resolution: 72});
            // var bufLine = Buffer.fromGeoJson(line, {"units" : "Kilometers"});
            expect(bufP.units).toEqual("Kilometers");
            expect(bufP.resolution).toEqual(72);
            // expect(bufLine.units).toEqual("Kilometers");
        });
        describe("for Point type geometry", () => {
            var pointBuffer: buffer.IBuffer;
            it("should recognize input geojson geometry type", () => {
                pointBuffer = buffer.Buffer.fromGeoJson(pt);
                expect(pointBuffer.geometryType).toEqual("Point");
            });
            it("should give output in geojson format", () => {
                pointBuffer = buffer.Buffer.fromGeoJson(pt);
                pointBuffer.distance = 350;
                var result: any = pointBuffer.toGeoJson();
                expect(result.geometry.coordinates.length).toBeGreaterThan(0);
                expect(result.geometry.coordinates[0].length).toBeGreaterThan(0);
                console.log("Point Result", result);
            });
        });
        describe("for LineString type geometry", () => {
            var lineBuffer: buffer.IBuffer;
            it("should recognize input geojson geometry type", () => {
                lineBuffer = buffer.Buffer.fromGeoJson(line);
                expect(lineBuffer.geometryType).toEqual("LineString");
            });
            it("should give output in geojson format", () => {
                console.log("Line Initial ", line);
                lineBuffer = new buffer.LineBuffer(line, {resolution: 72});
                lineBuffer.calculate(350);
                var result: any = lineBuffer.toGeoJson();
                expect(result.length).toBeGreaterThan(0);
                expect(result.geometry.coordinates[0].length).toBeGreaterThan(0);
                console.log("Line Result ", result);
            });
        });

});

