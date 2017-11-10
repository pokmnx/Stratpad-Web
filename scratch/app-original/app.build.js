// http://requirejs.org/docs/optimization.html#options
({
    appDir: "webapp",
    baseUrl: "scripts/",
    dir: "webapp-build",

    //Comment out the optimize line if you want
    //the code minified by UglifyJS
    optimize: "none",

    paths: {
        "modernizr": "lib/modernizr-2.6.2",
        "json2": "lib/json2",
        "jquery": "lib/jquery-1.9.0",
        "underscore": "lib/underscore",
        "handlebars": "lib/handlebars-1.0.rc.1",
        "backbone": "lib/backbone",
        "backbone-localstorage": "lib/backbone-localstorage",
        "backbone-simperium": "lib/backbone-simperium",
        "simperium": "lib/simperium-0.1",

        "templates": "templates",

        "model": "modules/model",
        "hockey": "modules/hockey",
        "cycling": "modules/cycling",
        "todos": "modules/todos"
    },

    modules: [
        {
            name: "main"
        }
    ]
})
