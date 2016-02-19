/**
 * Created by LobanovI on 16.02.2016.
 */
///<reference path="../typings/jasmine/jasmine.d.ts"/>
///<reference path="../typings/jasmine-matchers/jasmine-matchers.d.ts"/>
///<reference path="../typings/jquery/jquery.d.ts"/>
///<reference path="../typings/jasmine-jquery/jasmine-jquery.d.ts"/>
import geometry = require("./../src/geometry");

describe("Geometry calculations module", () => {
    "use strict";
    describe("for point type geometry", () => {
        it("should wrap number type with additional methods", () => {
            var wrpd = new geometry.Coordinate(-234);
            expect(wrpd).toHaveMember('val');
            expect(wrpd).toHaveMethod('toFixed');
            expect(wrpd).toHaveMethod('toDeg');
            expect(wrpd).toHaveMethod('toRad');
            expect(wrpd).toHaveMethod('toDeg');
            spyOn(wrpd, "toDeg").and.callThrough();
            wrpd.toDeg();
            expect(wrpd.toDeg).toHaveBeenCalled();
            expect(wrpd.val).toEqual(-234);
            expect(wrpd.toDeg()).toEqual(-13407.212406061264);
            expect(new geometry.Coordinate('qwerty').val).toBeNaN();
        });
        it("should ")
    });
    describe("for linestring type geometry", () => {

    });
});