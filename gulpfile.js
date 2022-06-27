var gulp = require('gulp');
var concat = require('gulp-concat');
var header = require('gulp-header');
var uglify = require("gulp-uglify");
var uglifycss = require("gulp-uglifycss");
var rename = require('gulp-rename');
var pkg = require('./package.json');

var comment = '/*\n' +
    ' * <%= pkg.name %> <%= pkg.version %>\n' +
    ' * <%= pkg.description %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' *\n' +
    ' * Copyright 2022, <%= pkg.author %>\n' +
    ' * Released under the <%= pkg.license %> license.\n' +
    '*/\n\n';

gulp.task('js-minify', function () {
    return gulp.src('src/bs-form-builder.js')
        .pipe(uglify({}))
        .pipe(header(comment, {
            pkg: pkg
        }))
        .pipe(rename('bs-form-builder.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('js-minify-components', function () {
    return gulp.src('src/bs-form-builder-components.js')
        .pipe(uglify({}))
        .pipe(header(comment, {
            pkg: pkg
        }))
        .pipe(rename('bs-form-builder-components.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('js-concat', function () {
    return gulp.src([
        'build/sortable/sortable.min.js',
        'dist/bs-form-builder-components.min.js',
        'dist/bs-form-builder.min.js',
    ])
        .pipe(concat('bs-form-builder.all.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('css-minify', function () {
    return gulp.src('src/bs-form-builder.css')
        .pipe(uglifycss())
        .pipe(rename('bs-form-builder.min.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', gulp.series([
    'js-minify',
    'js-minify-components',
    'js-concat',
    'css-minify'
]));
