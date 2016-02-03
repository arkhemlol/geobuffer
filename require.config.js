/**
 * Created by LobanovI on 28.01.2016.
 */
var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}
requirejs.config({
    // karma serves files from '/base'
    baseUrl: "/base/src/",
    paths: {
        jquery: "bower_components/jquery/dist/jquery.min",
        delaunay: "bower_components/delaunay/delaunay",
        "leaflet": "bower_components/leaflet/dist/leaflet"
    },
    shim: {
        jquery: {
            exports: "$"
        }
    },
    // ask Require.js to load these files (all our tests)
    deps: tests,
    // start test run, once Require.js is done
    callback: window.__karma__.start
});