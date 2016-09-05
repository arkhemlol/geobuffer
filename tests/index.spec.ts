/**
 * Created by LobanovI on 20.10.2015.
 */
///<reference path="../typings/jasmine/jasmine.d.ts"/>
///<reference path="../typings/jasmine-matchers/jasmine-matchers.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
///<reference path="../typings/jasmine-jquery/jasmine-jquery.d.ts"/>
///<reference path="../typings/leaflet/leaflet.d.ts"/>

import buffer = require("./../src/index");
import helpers = require("./../src/helpers");

class TestResults {
    public Line: helpers.Leaflet.Layer;
    public Point: helpers.Leaflet.Layer;
    public LineBuffer: L.Polygon;
    public PointBuffer: L.Polygon;
}

interface MyWindow extends Window {
    TestResults: TestResults
}

declare var window: MyWindow;

window.TestResults = new TestResults();

describe("module for creating buffer around simple geometries", () => {
    "use strict";
    var pt:number[],
        line:number[][];
    beforeEach(() => {
        jasmine.getJSONFixtures().fixturesPath = "base/tests/mocks";
        window.TestResults.Point = new helpers.Leaflet.Layer(jasmine.getJSONFixtures().load("Point.geojson")["Point.geojson"]);
        window.TestResults.Line = new helpers.Leaflet.Layer(jasmine.getJSONFixtures().load("LineString.geojson")["LineString.geojson"]);
        pt = window.TestResults.Point.toPixels();
        line = window.TestResults.Line.toPixels();
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
            window.TestResults.PointBuffer = window.TestResults.Point.fromPixels(result);
            expect(result).toBeArray();
            // polygon must be enclosed
            expect(result[0][0]).toEqual(result[0][result.length - 1]);
        });
    });
    describe("for LineString type geometry", () => {
        var lineBuffer;
        beforeEach(() => {
            lineBuffer = new buffer.LineBuffer(line, {resolution: 72});
        });
        it("should accept options", () => {
            expect(lineBuffer.resolution).toEqual(72);
        });
        it("should throw error if distance is not specified", () => {
            expect(function () {
                lineBuffer.calculate();
            }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
        });
        it("should validate provided distance", () => {
            expect(function () {
                lineBuffer.calculate(-34);
            }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
            expect(function () {
                lineBuffer.calculate("ad");
            }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
            expect(function () {
                lineBuffer.calculate(null);
            }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
            expect(function () {
                lineBuffer.calculate({});
            }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
            expect(function () {
                lineBuffer.calculate(0);
            }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
            expect(function () {
                lineBuffer.calculate([]);
            }).toThrowError("Distance for buffer wasn\'t provided or was in incorrect format!");
        });
        it("should throw error if geometry is not defined", () => {
            lineBuffer._geometry = null;
            expect(function () {
                lineBuffer.calculate(35);
            }).toThrowError("Geometry is not provided or has incorrect format");
        });
        it("should produce correct output", () => {
            var result = lineBuffer.calculate(window.TestResults.Line.scale(35));
            window.TestResults.LineBuffer = window.TestResults.Line.fromPixels(result);
            expect(result).toBeArray();
            // polygon must be enclosed
            expect(result[0][0]).toEqual(result[0][result.length - 1]);
        });
    });
});

