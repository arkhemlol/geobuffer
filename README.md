### Buffer algorithm for polyline and point, based on turf-union and turf-buffer
## Build

Install dependencies by executing `npm install` from the repository root.

Webpack and dev server must be installed globally:  

`npm install webpack -g`
`npm install webpack-dev-server -g`

For building two separate bundles (`buffer.js` - algorithm, `client.js` - front-end for testing with Leaflet.Draw) type:

`webpack`

Run dev server:  

`webpack-dev-server`

Development server will open on `http://localhost:8080/`.

If you want dev server to be available outside (i.e. by `http://10.1.1.182:8080`), add the following to webpack.config.js devServer section:  
    
    devServer: {
        contentBase: './.tmp',
        host: '10.1.1.182'
    }   
