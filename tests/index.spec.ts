/**
 * Created by LobanovI on 20.10.2015.
 */
///<reference path="../typings/delaunay/delaunay.d.ts"/>
///<reference path="../typings/jasmine/jasmine.d.ts"/>
///<reference path="../typings/jasmine-matchers/jasmine-matchers.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
///<reference path="../typings/jasmine-jquery/jasmine-jquery.d.ts"/>
///<reference path="../typings/leaflet/leaflet.d.ts"/>

import buffer = require("src/index");
import testHelper = require("tests/testHelper.spec");

describe("module for creating buffer around simple geometries", () => {
        "use strict";
        var pt: number[],
            // multipt: number[][],
            line: number[][];
        beforeEach(() => {
            jasmine.getJSONFixtures().fixturesPath = "base/tests/mocks";
            pt = testHelper.geometryToPixels(jasmine.getJSONFixtures().load("Point.geojson")["Point.geojson"]);
            // multipt = testHelper.geometryToPixels(jasmine.getJSONFixtures().load("MultiPoint.geojson")["MultiPoint.geojson"]);
            line = testHelper.geometryToPixels(jasmine.getJSONFixtures().load("LineString.geojson")["LineString.geojson"]);
        });
        describe("for Point type geometry", () => {
            var pBuffer;
            beforeEach(() => {
                pBuffer = new buffer.PointBuffer(pt, {resolution: 72});
            });
            it("should accept options", () => {
                expect(pBuffer.resolution).toEqual(72);
            });
            it("should throw error if distance is not specified", () => {
                expect(function () {
                    pBuffer.calculate();
                }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
            });
            it("should validate provided distance", () => {
                expect(function () {
                    pBuffer.calculate(-34);
                }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
                expect(function () {
                    pBuffer.calculate("ad");
                }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
                expect(function () {
                    pBuffer.calculate(null);
                }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
                expect(function () {
                    pBuffer.calculate({});
                }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
                expect(function () {
                    pBuffer.calculate(0);
                }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
                expect(function () {
                    pBuffer.calculate([]);
                }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
            });
            it("should throw error if geometry is not defined", () => {
                pBuffer._geometry = null;
                expect(function () {
                    pBuffer.calculate(35);
                }).toThrowError("Geometry is not provided or has incorrect format");
            });
            it("should produce correct output", () => {
                var result = pBuffer.calculate(35);
                console.log("PointBuffer:", result);
                expect(result).toBeArray();
            });

        });
        //describe("for LineString type geometry", () => {
        //    var lineBuffer: buffer.IBuffer;
        //    it("should recognize input geojson geometry type", () => {
        //        lineBuffer = buffer.Buffer.fromGeoJson(line);
        //        expect(lineBuffer.geometryType).toEqual("LineString");
        //    });
        //    it("should give output in geojson format", () => {
        //        console.log("Line Initial ", line);
        //        lineBuffer = new buffer.LineBuffer(line, {resolution: 72});
        //        lineBuffer.calculate(350);
        //        var result: any = lineBuffer.toGeoJson();
        //        expect(result.length).toBeGreaterThan(0);
        //        expect(result.geometry.coordinates[0].length).toBeGreaterThan(0);
        //        console.log("Line Result ", result);
        //    });
        //});

});

