/// <vs />
var gulp = require("gulp"),
    durandal = require("gulp-durandal"),
    rimraf = require("rimraf");

var paths = {
    folderDestination: "app",
    outputFilename: "main-built.js",
    sourceFilename: "main.js",
    outputFullpath: "app/main-built.js",
    outputMapfile: "app/main-built.js.map"
};

gulp.task("compile-application-script", function () {
    return durandal({
        baseDir: paths.folderDestination,
        main: paths.sourceFilename,
        output: paths.outputFilename,
        almond: true,
        minify: true,
        rjsConfigAdapter: function (config) {
            //Tell requirejs to load the "main" module
            config.insertRequire = ["main"];
            return config;
        }
    })
    .pipe(gulp.dest(paths.folderDestination));
});


gulp.task("clean:js", function (cb) {
    rimraf(paths.outputFullpath, cb);
});

gulp.task("clean:map", function (cb) {
    rimraf(paths.outputMapfile, cb);
});

gulp.task("compile-application-script2", function () {
    return durandal({
        baseDir: paths.folderDestination,
        main: paths.sourceFilename,
        output: paths.outputFilename,
        almond: true,
        minify: true,
        rjsConfigAdapter: function (rjsConfig) {
            rjsConfig.deps = ["text"];
            return rjsConfig;
        }
    })
    .pipe(gulp.dest(paths.folderDestination));
});




gulp.task("clean", ["clean:js", "clean:map"]);
gulp.task("build", ["compile-application-script"]);
gulp.task("default", ["clean", "build"]);