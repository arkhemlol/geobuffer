/**
 * Created by LobanovI on 16.11.2015.
 */

import errors = require("./errors");
    "use strict";

// see http://stackoverflow.com/a/26823072/2454761
export class Coordinate implements Number {
    // this will serve as a storage for actual number
    private value:number;

    constructor(arg?:any) {
        this.value = Number(arg);
    }

    // and these are the methods needed by Number interface
    public toString(radix?:number):string {
        return Number.prototype.toString.apply(this.value, arguments);
    }

    public toFixed(fractionDigits?:number):string {
        return Number.prototype.toFixed.apply(this.value, arguments);
    }

    public toExponential(fractionDigits?:number):string {
        return Number.prototype.toExponential.apply(this.value, arguments);
    }

    public toPrecision(precision:number):string {
        return Number.prototype.toPrecision.apply(this.value, arguments);
    }

    // this method isn't actually declared by Number interface but it can be useful - we'll get to that
    public valueOf(): number {
        return this.value;
    }

    get val():number {
        return this.value;
    }

    set val(value:number) {
        this.value = value;
    }

    public toRad():number {
        return this.value * Math.PI / 180;
    }

    public toDeg():number {
        return this.value * 180 / Math.PI;
    }
}


export class Point {
    public x:Coordinate;
    public y:Coordinate;

    constructor(x:Coordinate | number, y:Coordinate | number) {
        if (x instanceof Coordinate && y instanceof Coordinate) {
            this.x = x;
            this.y = y;
        } else {
            this.x = new Coordinate(x);
            this.y = new Coordinate(y);
        }
    }

    public toString():string {
        return `X: ${this.x} Y: ${this.y}`;
    }

    public bearing(point:Point):number {
        var dy:number = point.y - this.y;
        var dx:number = point.x - this.x;
        var θ:number = Math.atan2(dy, dx);

        return new Coordinate(θ).toDeg();
    }

    public destination(distance:number, bearing:number):Point {
        if (!distance || isNaN(distance) || (distance <= 0)) {
            throw new errors.BufferError("Distance was in incorrect format", `distance ${distance}`);
        }
        if (isNaN(bearing)) {
            throw new errors.BufferError("Bearing was in incorrect format", `bearing ${bearing}`);
        }
        var _x = new Coordinate(this.x + distance * Math.cos(new Coordinate(bearing).toRad()));
        var _y = new Coordinate(this.y + distance * Math.sin(new Coordinate(bearing).toRad()));

        return new Point(_x, _y);
    }

    public toArray():number[] {
        return [this.x.val, this.y.val];
    }

    public clone():Point {
        return new Point(this.x, this.y);
    }

}

export class Vector {
    public x:number;
    public y:number;
    public z:number;

    constructor(x:number, y:number, z:number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public cross(vect:Vector):Vector {
        var _x, _y, _z:number;
        if (vect.z === 0) {
            _x = 0;
            _y = 0;
        } else {
            _x = this.y * vect.z - this.z * vect.y;
            _y = this.z * vect.x - this.x * vect.z;
        }
        _z = this.x * vect.y - this.y * vect.x;
        return new Vector(_x, _y, _z);
    }

    public dot(vect:Vector):number {
        return this.x * vect.x + this.y * vect.y + this.z * vect.z;
    }

    public angleTo(v:Vector, vSign?:Vector): number {

        //var sinθ = this.cross(v).length();
        //var cosθ = this.dot(v);
        //
        //if (vSign !== undefined) {
        //    // use vSign as reference to get sign of sinθ
        //    sinθ = this.cross(v).dot(vSign) < 0 ? -sinθ : sinθ;
        //}
        //return new Coordinate(Math.atan2(sinθ, cosθ)).toDeg();
        var acos = Math.acos(this.dot(v) / (this.length() * v.length()));
        return new Coordinate(acos).toDeg();
    }

    public rotate2D(angle: number): Vector {
        var _x, _y: number;
        var _angle: number = new Coordinate(angle).toRad();
        var cosA = Math.cos(_angle);
        var sinA = Math.sin(_angle);
        _x = this.x * cosA - this.y * sinA;
        _y = this.x * sinA + this.y * cosA;
        return new Vector(_x, _y, 0);
    }

    public unit():Vector {
        var norm = this.length();
        if (norm == 1) return this;
        if (norm == 0) return this;

        var x = this.x / norm;
        var y = this.y / norm;
        var z = this.z / norm;

        return new Vector(x, y, z);
    }

    public length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

}

export class SegmentRectangle {
    public bottom:Segment;
    public top:Segment;
    public segment: Segment;
    public bearing: number;

    constructor(segment: Segment, distance: number) {
        if(!segment || !(segment instanceof Segment)) {
            throw new errors.BufferError("Please, provide correct segment for calculations!");
        }
        if(!distance || !isFinite(distance)) {
            throw new errors.BufferError("Please, provide correct distance for calculations!");
        }
        this.segment = segment;
        this.bearing = segment.bearing;
        this.bottom = new Segment(segment.start.destination(distance, this.bearing - 90),
            segment.end.destination(distance, this.bearing - 90));
        this.top = new Segment(segment.start.destination(distance, this.bearing + 90),
            segment.end.destination(distance, this.bearing + 90));
    }
}

export class Segment {
    public start:Point;
    public end:Point;

    constructor(start:Point | number[], end:Point | number[]) {
        if (start instanceof Point && end instanceof Point) {
            this.start = start;
            this.end = end;
        } else {
            this.start = new Point(start[0], start[1]);
            this.end = new Point(end[0], end[1]);
        }
    }

    public getRect(distance:number):SegmentRectangle {
        return new SegmentRectangle(this, distance);
    }

    get bearing():number {
        return this.start.bearing(this.end);
    }

    public intersection(L:Segment):Point {
        // Denominator for ua and ub are the same, so store this calculation
        var d:number = (L.end.y - L.start.y) * (this.end.x - this.start.x) - (L.end.x - L.start.x) * (this.end.y - this.start.y);
        //n_a and n_b are calculated as seperate values for readability
        var n_a:number = (L.end.x - L.start.x) * (this.start.y - L.start.y) - (L.end.y - L.start.y) * (this.start.x - L.start.x);
        var n_b:number = (this.end.x - this.start.x) * (this.start.y - L.start.y) - (this.end.y - this.start.y) * (this.start.x - L.start.x);
        // Make sure there is not a division by zero - this also indicates that
        // the lines are parallel.
        // If n_a and n_b were both equal to zero the lines would be on top of each
        // other (coincidental).  This check is not done because it is not
        // necessary for this implementation (the parallel check accounts for this).
        if (d == 0) {
            return null;
        }
        // Calculate the intermediate fractional point that the lines potentially intersect.
        var ua:number = n_a / d;
        var ub:number = n_b / d;
        var _x = new Coordinate(this.start.x + (ua * (this.end.x - this.start.x)));
        var _y = new Coordinate(this.start.y + (ua * (this.end.y - this.start.y)));
        return new Point(_x, _y);
    };

    public angle(segment: Segment): Coordinate {
        return new Coordinate(Math.atan2(this.end.y - segment.end.y, this.end.x - segment.end.x));
    }
    public toVector(): Vector {
        var _x, _y, _z: number;
        _x = this.end.x - this.start.x;
        _y = this.end.y - this.start.y;
        _z = 0;
        return new Vector(_x, _y, _z);
    }
}

export class LineString {
    public segments:Array<Segment>;

    constructor(segments:Array<Segment>) {
        this.segments = segments;
    }

    public add(...segments:Array<Segment>):void {
        this.segments = this.segments.concat(segments);
    }

    public clear():void {
        this.segments = [];
    }

    public length():number {
        return this.segments.length;
    }

    public last():Point {
        return this.segments[this.length() - 1].end;
    }

    public getSegmentByNumber(segmentNumber:number):Segment {
        return this.segments[segmentNumber];
    }
}

export class Polygon {
    public points:Array<Point>;

    constructor(...points:Array<Point>) {
        this.points = points;
    }

    public enclose():void {
        if ((this.points[0].x !== this.points[this.points.length - 1].x) &&
            (this.points[0].y !== this.points[this.points.length - 1].y)) {
            this.points.push(this.points[0].clone());
        }
    }

    public add(points:Point[]):void {
        this.points = this.points.concat(points);
    }

    public clear():void {
        this.points = [];
    }

    public length():number {
        return this.points.length;
    }

    public toArray():number[][][] {
        var resArr:number[][] = [];
        for (var i:number = 0, len:number = this.points.length; i < len; i++) {
            resArr.push(this.points[i].toArray());
        }
        return [resArr];
    }
}



