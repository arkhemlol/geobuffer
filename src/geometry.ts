/**
 * Created by LobanovI on 16.11.2015.
 */

import helpers = require("./helpers");

module geometry {
    "use strict";

    // see http://stackoverflow.com/a/26823072/2454761
    export class Coordinate implements Number {
        // this will serve as a storage for actual number
        private value: number;

        constructor(arg?: any) {
            this.value = Number(arg);
        }

        // and these are the methods needed by Number interface
        public toString(radix?: number): string {
            return Number.prototype.toString.apply(this.value, arguments);
        }

        public toFixed(fractionDigits?: number): string {
            return Number.prototype.toFixed.apply(this.value, arguments);
        }

        public toExponential(fractionDigits?: number): string {
            return Number.prototype.toExponential.apply(this.value, arguments);
        }

        public toPrecision(precision: number): string {
            return Number.prototype.toPrecision.apply(this.value, arguments);
        }

        // this method isn't actually declared by Number interface but it can be useful - we'll get to that
        public valueOf(): number {
            return this.value;
        }

        get val(): number {
            return this.value;
        }

        set val(value: number){
            this.value = value;
        }

        public toRad(): number {
            return this.value * Math.PI / 180;
        }

        public toDeg(): number {
            return this.value * 180 / Math.PI;
        }

        public sign(): number {
            if (this.value === 0 || isNaN(this.value)) {
                return this.value;
            }
            return this.value > 0 ? 1 : -1;
        }
    }


    export class Point {
        public x: Coordinate;
        public y: Coordinate;
        constructor(x: Coordinate | number, y: Coordinate | number) {
            if(x instanceof Coordinate && y instanceof Coordinate) {
                this.x = x;
                this.y = y;
            } else {
                this.x = new Coordinate(x);
                this.y = new Coordinate(y);
            }
        }

        public toString(): string {
            return `X: ${this.x} Y: ${this.y}`;
        }

        public bearing(point: Point): number {
            var dy: number = this.y.val - point.y.val;
            var dx: number = this.x.val - point.x.val;
            var θ: number = Math.atan2(dy, dx);

            return (new Coordinate(θ).toDeg() + 360) % 360;
        }

        public destination(distance: number, bearing: number): Point {
            if (!distance || isNaN(distance) || (distance <= 0)) {
                throw new helpers.BufferError("Distance was in incorrect format", `distance ${distance}`);
            }
            if (isNaN(bearing)) {
                throw new helpers.BufferError("Bearing was in incorrect format", `bearing ${bearing}`);
            }

            var _y = new Coordinate(this.x.val + distance * Math.sin(new Coordinate(bearing).toRad()));
            var _x = new Coordinate(this.y.val + distance * Math.cos(new Coordinate(bearing).toRad()));

            return new Point(_x, _y);
        }

        public toArray(): number[] {
            return [this.x.val, this.y.val];
        }

        public clone(): Point {
            return new Point(this.x, this.y);
        }

    }

    export class SegmentRectangle {
        public bottom: Segment;
        public top: Segment;
        get bearing(): number {
            return this.top.bearing;
        }
    }

    export class Segment {
        public start: Point;
        public end: Point;

        constructor(start: Point | number[], end: Point | number[]) {
            if (start instanceof Point && end instanceof Point) {
                this.start = start;
                this.end = end;
            } else {
                this.start = new Point(start[0], start[1]);
                this.end = new Point(end[0], end[1]);
            }
        }

        public getRect(distance: number): SegmentRectangle {
            var result: SegmentRectangle = new SegmentRectangle(),
                direction: number = this.bearing;
            result.bottom = new Segment(this.start.destination(distance, direction + 90),
                this.end.destination(distance, direction + 90));
            result.top = new Segment(this.start.destination(distance, direction - 90),
                this.end.destination(distance, direction - 90));
            return result;
        }
        get bearing(): number {
            return this.start.bearing(this.end);
        }
        public intersection(L: Segment): Point {
            // Denominator for ua and ub are the same, so store this calculation
            var d: number = (L.end.y.val - L.start.y.val) * (this.end.x.val - this.start.x.val) - (L.end.x.val - L.start.x.val) * (this.end.y.val - this.start.y.val);
            //n_a and n_b are calculated as seperate values for readability
            var n_a: number = (L.end.x.val - L.start.x.val) * (this.start.y.val - L.start.y.val) - (L.end.y.val - L.start.y.val) * (this.start.x.val - L.start.x.val);
            var n_b: number = (this.end.x.val - this.start.x.val) * (this.start.y.val - L.start.y.val) - (this.end.y.val - this.start.y.val) * (this.start.x.val - L.start.x.val);
            // Make sure there is not a division by zero - this also indicates that
            // the lines are parallel.  
            // If n_a and n_b were both equal to zero the lines would be on top of each 
            // other (coincidental).  This check is not done because it is not 
            // necessary for this implementation (the parallel check accounts for this).
            if (d == 0) {
                return null;
            }
            // Calculate the intermediate fractional point that the lines potentially intersect.
            var ua: number = n_a / d;
            var ub: number = n_b / d;
            // The fractional point will be between 0 and 1 inclusive if the lines
            // intersect.  If the fractional calculation is larger than 1 or smaller
            // than 0 the lines would need to be longer to intersect.
            if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                var _x = new Coordinate(this.start.x.val + (ua * (this.end.x.val - this.start.x.val)));
                var _y = new Coordinate(this.start.y.val + (ua * (this.end.y.val - this.start.y.val)));
                return new Point(_x, _y);
            }
            return null;
        };
    }

    export class LineString {
        public segments: Array<Segment>;
        constructor(segments: Array<Segment>) {
            this.segments = segments;
        }
        public add(...segments: Array<Segment>): void {
            this.segments = this.segments.concat(segments);
        }
        public clear(): void {
            this.segments = [];
        }
        public length(): number {
            return this.segments.length;
        }
        public last(): Point {
            return this.segments[this.length() - 1].end;
        }
        public getSegmentByNumber(segmentNumber: number): Segment {
            return this.segments[segmentNumber];
        }
    }

    export class Polygon {
        public points: Array<Point>;
        constructor(...points: Array<Point>) {
            this.points = points;
        }
        public enclose(): void {
            if ((this.points[0].x.val !== this.points[this.points.length - 1].x.val) &&
                (this.points[0].y.val !== this.points[this.points.length - 1].y.val)) {
                this.points.push(this.points[0].clone());
            }
        }
        public add(points: Point[]): void {
            this.points = this.points.concat(points);
        }
        public clear(): void {
            this.points = [];
        }
        public length(): number {
            return this.points.length;
        }
        public toArray(): number[][][] {
            var resArr: number[][] = [];
            for (var i: number = 0, len: number = this.points.length; i < len; i++) {
                resArr.push(this.points[i].toArray());
            }
            return [resArr];
        }
    }
}

export = geometry;



