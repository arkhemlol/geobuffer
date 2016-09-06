
/**
 * Created by LobanovI on 19.10.2015.
 */

///<reference path="../typings/index.d.ts"/>

import errors = require("./errors");
import geometry = require("./geometry");
"use strict";

function validateValue(value): boolean {
    return !(typeof value === 'undefined' ||
    value <= 0 || typeof value == 'string' || Array.isArray(value) ||
    typeof value === "object");
}

class Intersections {
    public bottom:Array<geometry.Point>;
    public top:Array<geometry.Point>;
}

export class PointBuffer {
    public resolution:number;
    private _geometry:geometry.Point;

    constructor(point:number[], options?:any) {
        this.resolution = options && options.resolution || 36;
        this._geometry = new geometry.Point(point[0], point[1]);
    }

    public calculate(distance:number):number[][][] {
        var resMultiple:number;
        var result:geometry.Polygon;
        if (!validateValue(distance)) {
            throw new errors.BufferError("Distance for buffer wasn\'t provided or was in incorrect format!",
                `distance ${distance}`);
        }
        if (!this._geometry) {
            throw new errors.BufferError("Geometry is not provided or has incorrect format", `geometry ${this._geometry}`);
        }
        result = new geometry.Polygon();
        resMultiple = 360 / this.resolution;
        for (var i:number = 0; i < this.resolution; i++) {
            var spoke:geometry.Point = this._geometry.destination(distance, i * resMultiple);
            result.add([spoke]);
        }
        // result must form closed polygon
        result.enclose();
        return result.toArray();
    }
}

export class LineBuffer {
    public resolution:number;
    private _geometry:geometry.LineString;

    constructor(line:number[][], options?:any) {
        this.resolution = options && options.resolution || 36;
        var segments:Array<geometry.Segment> = [];
        for (var i:number = 0; i < line.length - 1; i++) {
            segments.push(new geometry.Segment(line[i],
                line[i + 1]));
        }
        this._geometry = new geometry.LineString(segments);
    }

    public findIntersections(distance:number, rect1:geometry.SegmentRectangle, rect2:geometry.SegmentRectangle,
                             currentPoint:geometry.Point):Intersections {
        var result = new Intersections();
        var v1: geometry.Vector = new geometry.Vector(rect1.segment.end.x - rect1.segment.start.x,
        rect1.segment.end.y - rect1.segment.start.y, 0);
        var v2: geometry.Vector = new geometry.Vector(rect2.segment.end.x - rect2.segment.start.x,
            rect2.segment.end.y - rect2.segment.start.y, 0);
        var angle: number = v1.angleTo(v2);
        var flat: boolean = v1.cross(v2).z < 0;
        if (angle % 180 === 0) {
            return {
                top: [rect1.top.end],
                bottom: [rect1.bottom.end]
            };
        } else if (flat) {
            var topObtuse:geometry.Point[] = this._addArc(distance, currentPoint, rect1.bearing + 90, -angle);
            var bottomObtuse:geometry.Point = rect1.bottom.intersection(rect2.bottom);
            if (topObtuse) {
                result.top = topObtuse;
            }
            if (bottomObtuse) {
                result.bottom = [bottomObtuse];
            }
            return result;
        } else {
            var topAcute:geometry.Point = rect1.top.intersection(rect2.top);
            var bottomAcute:geometry.Point[] = this._addArc(distance, currentPoint, rect1.bearing - 90, angle);
            if (topAcute) {
                result.top = [topAcute];
            }
            if (bottomAcute) {
                result.bottom = bottomAcute;
            }
            return result;
        }
    }

    public calculate(distance:number):number[][][] {
        var segment1:geometry.Segment,
            segment2:geometry.Segment,
            intersections:any,
            rectangle1:geometry.SegmentRectangle,
            rectangle2:geometry.SegmentRectangle,
            outerLine:Array<geometry.Point>,
            result:geometry.Polygon = new geometry.Polygon();
        outerLine = [];
        if (!validateValue(distance)) {
            throw new errors.BufferError("Distance for buffer wasn\'t provided or was in incorrect format!",
                `distance ${distance}`);
        }
        if (!this._geometry) {
            throw new errors.BufferError("Geometry is not provided or has incorrect format", `geometry ${this._geometry}`);
        }
        for (var k:number = 0, len:number = this._geometry.length() - 1; k < len; k++) {
            segment1 = this._geometry.getSegmentByNumber(k);
            segment2 = this._geometry.getSegmentByNumber(k + 1);
            rectangle1 = segment1.getRect(distance);
            rectangle2 = segment2.getRect(distance);
            if (k === 0) {
                result.add(this._addArc(distance, segment1.start, (segment1.bearing - 90), -180));
            }
            intersections = this.findIntersections(distance, rectangle1, rectangle2, segment1.end);
            if (!intersections.top) {
                result.add([rectangle1.top.start, rectangle1.top.end, rectangle2.top.start, rectangle2.top.end]);
            } else if (k === 0) {
                result.add([rectangle1.top.start].concat(intersections.top));
            } else if (k === len - 1) {
                result.add(intersections.top.concat(rectangle2.top.end));
            } else {
                result.add(intersections.top);
            }
            if (!intersections.bottom) {
                outerLine = [rectangle1.bottom.start, rectangle1.bottom.end,
                    rectangle2.bottom.start, rectangle2.bottom.end].reverse().concat(outerLine);
            } else if (k === 0) {
                outerLine = intersections.bottom.reverse().concat(rectangle1.bottom.start, outerLine);
            } else if (k === len - 1) {
                outerLine = [rectangle2.bottom.end].concat(intersections.bottom.reverse(), outerLine);
            } else {
                outerLine = intersections.bottom.reverse().concat(outerLine);
            }
            if (k === len - 1) {
                result.add(this._addArc(distance, segment2.end, segment2.bearing + 90, -180));
            }
        }
        result.add(outerLine);
        // result must form closed polygon
        result.enclose();
        return result.toArray();
    }

    private _addArc(distance:number, point:geometry.Point, bearing:number, angle:number):Array<geometry.Point> {
        var result:Array<geometry.Point> = [],
            spoke:geometry.Point,
            spokeDirection:number,
            spokeNum:number = Math.floor(360 / this.resolution) > Math.abs(angle) ? 1 : Math.floor(this.resolution * Math.abs(angle) / 360);
        for (var k:number = 0; k <= spokeNum; k++) {
            spokeDirection = bearing + (angle * (k / spokeNum));
            spoke = point.destination(distance, spokeDirection);
            result.push(spoke);
        }
        return result;
    }
}
