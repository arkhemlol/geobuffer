// https://github.com/ironwallaby/delaunay
//https://github.com/yahiko00/delaunay

interface DelaunayStatic {
    triangulate(vertices: number[], key?: number): number[];
    contains(tri: number[][], p: number[]): number[];
} // DelaunayStatic

declare var Delaunay: DelaunayStatic;