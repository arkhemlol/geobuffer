
/**
 * Created by LobanovI on 19.10.2015.
 */
import helpers = require("./helpers");
import geometry = require("./geometry");

module buffer {
    "use strict";


    class Intersections {
        public bottom: Array<geometry.Point>;
        public top: Array<geometry.Point>
    }

    export class PointBuffer {
        public resolution: number;
        private _geometry: geometry.Point;
        private _distance: number;

        constructor(point: number[], distance: number, options?: any) {
            this.resolution = options && options.resolution || 36;
            this._distance = distance;
            this._geometry = new geometry.Point(point[0], point[1]);
        }

        public set distance(dist: number) {
            this._distance = dist;
        }

        public  get distance(): number {
            return this._distance;
        }

        private calculate(distance: number): number[][][] {
            var resMultiple: number;
            var result: geometry.Polygon;
            if (!distance) {
                throw new helpers.BufferError("Distance for buffer is not provided! Use distance setter to provide distance",
                    `distance ${distance}`);
            }
            if (this._geometry === undefined) {
                throw new helpers.BufferError("Geometry is not provided or has incorrect format", `geometry ${this._geometry}`);
            }
            result = new geometry.Polygon();
            resMultiple = 360 / this.resolution;
            for (var i: number = 0; i < this.resolution; i++) {
                var spoke: geometry.Point = this._geometry.destination(distance, i * resMultiple);
                result.add([spoke]);
            }
            // result must form closed polygon
            result.enclose();
            return result.toArray();
        }

    }

    class LineBuffer {
        public resolution: number;
        private _geometry: geometry.LineString;
        private _geomtype: string;
        private _distance: number;

        constructor(line: number[][], options?: any) {
            this.resolution = options && options.resolution || 36;
            var segments: Array<geometry.Segment> = [];
            for (var i: number = 0; i < line.length - 1; i++) {
                segments.push(new geometry.Segment(line[i],
                    line[i + 1]));
            }
            this._geometry = new geometry.LineString(segments);
        }

        public findIntersections(rect1: geometry.SegmentRectangle, rect2: geometry.SegmentRectangle,
                                 currentPoint: geometry.Point): Intersections {
            var result: Intersections = null,
                diff: number = rect1.bearing - rect2.bearing;
            diff = (diff + 360) % 360;
            if (diff < 180 ) {
                var topAcute: geometry.Point = rect1.top.intersection(rect2.top);
                var bottomAcute: geometry.Point[] = this._addArc(currentPoint, rect2.bearing + 90, rect1.bearing - rect2.bearing);
                if (topAcute) {
                    result.top = [topAcute];
                }
                if (bottomAcute) {
                    result.bottom = bottomAcute;
                }
                return result;
            } else if (diff > 180) {
                var topObtuse: geometry.Point[] = this._addArc(currentPoint, rect1.bearing - 90, (rect2.bearing - rect1.bearing));
                var bottomObtuse: geometry.Point = rect1.bottom.intersection(rect2.bottom);
                if (topObtuse) {
                   result.top = topObtuse;
                }
                if (bottomObtuse) {
                    result.bottom = [bottomObtuse];
                }
                return result;
            } else if (diff === 0 || diff === 360 || diff === 180) {
                return {
                    top: [rect1.top.end],
                    bottom: [rect1.bottom.end]
                };
            }
        }

        public get geometryType(): string {
            return this._geomtype;
        }

        public set distance(dist: number) {
            this._distance = dist;
        }

        public  get distance(): number {
            return this._distance;
        }

        public calculate(distance: number): number[][][] {
            var segment1: geometry.Segment,
                segment2: geometry.Segment,
                intersections: any,
                rectangle1: geometry.SegmentRectangle,
                rectangle2: geometry.SegmentRectangle,
                outerLine: Array<geometry.Point>,
                result: geometry.Polygon =  new geometry.Polygon();
            outerLine = [];
            for (var k: number = 0, len: number = this._geometry.length() - 1; k < len; k++) {
                segment1 = this._geometry.getSegmentByNumber(k);
                segment2 = this._geometry.getSegmentByNumber(k + 1);
                rectangle1 = segment1.getRect(distance);
                rectangle2 = segment2.getRect(distance);
                if (k === 0) {
                    result.add(this._addArc(segment1.start, rectangle1.top.bearing + 90));
                }
                intersections = this.findIntersections(rectangle1, rectangle2, segment1.end);
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
                    outerLine = intersections.bottom.concat(rectangle1.bottom.start);
                } else if (k === len - 1) {
                    outerLine = [rectangle2.bottom.end].concat(intersections.bottom, outerLine);
                } else {
                    outerLine = intersections.bottom.concat(outerLine);
                }
                if (k === len - 1) {
                    result.add(this._addArc(segment2.end, rectangle2.top.bearing - 90));
                }
            }
            result.add(outerLine);
            // result must form closed polygon
            result.enclose();
            return result.toArray();
        }

        private _addArc(point: geometry.Point, bearing: number, angle?: number): Array<geometry.Point> {
            var result: Array<geometry.Point> = [],
                spoke: geometry.Point,
                spokeDirection: number,
                _angle: number = angle ? (angle + 360) % 360 : 180,
                spokeNum: number = Math.floor(360 / this.resolution) > _angle ? 1 : Math.floor(this.resolution * _angle / 360);
            bearing = (bearing + 360) % 360;
            for (var k: number = 0; k <= spokeNum; k++) {
                spokeDirection = bearing + (_angle * (k / spokeNum));
                spoke = point.destination(this.distance, spokeDirection);
                result.push(spoke);
            }
            return result;
        }
    }
}

export = buffer;

