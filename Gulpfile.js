var gulp = require("gulp"),
		browserSync = require("browser-sync"),
		sass = require("gulp-sass"),
		bourbon = require("node-bourbon").includePaths,
		neat = require("node-neat").includePaths,
		handlebars = require("handlebars");

// Compiles all gulp tasks
gulp.task("default", ["sass"]);

// A development task to run anytime a file changes
gulp.task("watch", ["browserSync", "sass"], function() {
	gulp.watch("app/scss/**/*.scss",["sass"]);
	gulp.watch("app/*.html").on("change", browserSync.reload);
	gulp.watch("app/js/**/*.js").on("change", browserSync.reload);
});

// Spin up a server
gulp.task("browserSync", function() {
	browserSync({
		server: {
			baseDir: "app"
		},
	})
});

// Compiles SASS
gulp.task("sass", function() {
	gulp.src("app/scss/**/*.scss")
			.pipe(sass({
				includePaths: bourbon,
				includePaths: neat
			})) 
			.pipe(gulp.dest("app/css"))
			.pipe(browserSync.reload({
				stream: true
			}))
});