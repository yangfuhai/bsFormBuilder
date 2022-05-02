var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require("gulp-uglify");
var uglifycss = require("gulp-uglifycss");
var rename = require('gulp-rename');

// var changelog = require('gulp-conventional-changelog');

gulp.task('js-minify', function () {
    return gulp.src('bs-form-builder.js')
        .pipe(uglify({
            compress: true,
            // mangle: true,
            output: {
                // beautify: true,
                // comments: "all"
            }
            // outSourceMap: true
            // preserveComments: "license"
        }))
        .pipe(rename('bs-form-builder.min.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('js-concat', function () {
    return gulp.src([
        'example/static/js/sortable.min.js',
        'bs-form-builder.min.js',
    ])
        .pipe(concat('bs-form-builder-all.min.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('css-minify', function () {
    return gulp.src('bs-form-builder.css')
        .pipe(uglifycss())
        .pipe(rename('bs-form-builder.min.css'))
        .pipe(gulp.dest('.'));
});

// gulp.task("default", gulp.series(js, css));

gulp.task('default', gulp.series([
    'js-minify',
    'js-concat',
    'css-minify'
]));
