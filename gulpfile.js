/* Imports */

	var gulp = require('gulp');

	var autoprefixer = require('gulp-autoprefixer');

	//var babel = require('gulp-babel'); // ES2015 transcoder

	//var browserSync = require('browser-sync').create(); // install fails on too deep dir structure

	//var concat = require('gulp-concat');

	var cssnano = require('gulp-cssnano');

	//var eslint= require('gulp-eslint'); //recommended by Udacity, using jshint for now

	var frep = require('gulp-frep');

	//var ftp = require( 'vinyl-ftp' );

	var gulpif = require('gulp-if'); // provides conditional processing of streams

	var htmlmin = require('gulp-htmlmin'); // minimizes html

	var imagemin = require('gulp-imagemin'); //lossless image compression

	//var pngquant = require(imagemin-pngquant); //'smart lossy image compression'

	//var jasmine = require('gulp-jasmine-phantom'); // headless test framework

	var jshint = require('gulp-jshint'); //also requires npm install of jshint-stylish

	var less = require('gulp-less'); // LESS precompiler

	var modernizr = require('gulp-modernizr'); // browser feature detection

	var sass = require('gulp-sass'); // SASS precompiler

	var sequence = require('gulp-sequence'); // run tasks in controlled sequence, not randomly parallel

	var shell = require('gulp-shell');

	//var sourcemaps = require('gulp-sourcemaps');

	var uglify = require('gulp-uglify'); //minimizes js

	var useref = require('gulp-useref'); // parses js and css build blocks in html source 


/* Scripts */

	gulp.task('init-build', shell.task([ // // clean out build directory
			
		'if exist build rmdir build /S /Q'
	]));


	gulp.task('build-images', function() { // copy images to build
		
		gulp.src('src/assets/img/*.*')

		.pipe(imagemin())

		.pipe(gulp.dest('build/assets/img/.'));
	});


	gulp.task('build-fonts', function() { // copy fonts to build
		
		gulp.src('node_modules/materialize-css/font/**/*.*') // materialize

		.pipe(gulp.dest('build/assets/font/.'));

		gulp.src('node_modules/bootstrap/fonts/*.*') // bootstrap timepicker

		.pipe(gulp.dest('build/assets/fonts/.'));
	});


	gulp.task('build-pages', function() { // copy html to build, concatenating and minifying js and css files
		
		gulp.src('src/index.html') // TO-DO: exclude test runner file
			
			.pipe(useref()) // concatenate build blocks

			.pipe(gulpif('*.js', frep( // Remove 'use strict' commands
			[
				{
					pattern: /'use strict';*/g,
					replacement: ''
				}
			])))

			.pipe(gulpif('*.css', cssnano())) // minify css
			
			//.pipe(gulpif('*.html', htmlmin())) // minify html

			.pipe(gulpif('*.js', uglify())) // minify js

			.pipe(gulp.dest('build/.'))
	});


	gulp.task('fonts', function() { // copy fonts to where css expects to find them during dev
		
		gulp.src('node_modules/materialize-css/font/**/*.*') // materialize

		.pipe(gulp.dest('src/assets/font/.'));

		gulp.src('node_modules/bootstrap/fonts/*.*') // bootstrap timepicker

		.pipe(gulp.dest('src/assets/fonts/.'));
	});


	gulp.task('less', function() { // (re-)compile less to css
		
		gulp.src('src/assets/less/bootstrap.less')
			
		.pipe(less())
		
		//.pipe(cssnano()) // minimize
		
		.pipe(gulp.dest('src/assets/css/'));
	});

	
	gulp.task('modernizr', function() { // (re-)build custom Modernizr library

		gulp.src('src/assets/**/*.js')

		.pipe(modernizr('modernizr-custom.js',
		{
		    "cache" : true,
		    "devFile" : false,
		    "dest" : 'src/lib/modernizr-custom.js',
		    "options" : [
		        //"setClasses",
		       // "addTest",
		       // "html5printshiv",
		       // "testProp",
		       // "fnBind"
		    ],
		    "uglify" : false,
		    "tests" : ['datalistelem', 'formvalidation', 'input', 'inputtypes', 'localstorage', 'matchmedia'],
		    "excludeTests": [],
		    "crawl" : false,
		    "useBuffers": false,
		    "files" : {
		        "src": [
		            "*[^(g|G)runt(file)?].{js,css,scss}",
		            "**[^node_modules]/**/*.{js,css,scss}",
		            "!lib/**/*"
		        ]
		    },
		    "customTests" : []
		}));
	});


	gulp.task('sass', function() { // (re-)compile sass to css
		
		gulp.src('src/assets/sass/*.scss')
			
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		
		//.pipe(autoprefixer({browsers: ['last 2 versions']})) // chokes on '//' comments, so run sass first
				
		.pipe(cssnano()) // minimize (again)
		
		.pipe(gulp.dest('src/assets/css/.'));
	});

 
	gulp.task('setup', sequence(['fonts', 'less', 'modernizr', 'sass'])); // get set up for development after first running npm install

	
	gulp.task('upload-dev', function() { // upload files to development Web server
		
		gulp.src('build/**/*.*') // build

		.pipe(gulp.dest('\\\\192.168.1.108\\Music\\www\\event-planner\\build\\.'));

		gulp.src('src/**/*.*') // src

		.pipe(gulp.dest('\\\\192.168.1.108\\Music\\www\\event-planner\\src\\.'));

		gulp.src('test/**/*.*') // test

		.pipe(gulp.dest('\\\\192.168.1.108\\Music\\www\\event-planner\\test\\.'));
	});
	

	gulp.task('validate-scripts', function() { // validate scripts
		
		// validate own js assets

		gulp.src('src/assets/js/**/*.js')

		.pipe(jshint()) // check for coding errors
		
		.pipe(jshint.reporter('jshint-stylish')) // make errors pretty

		.pipe(jshint.reporter('fail'));
	});

	 
	gulp.task('validate-tests', function() { 
		
		
		gulp.src('src/test/*_test.js')
		
			// check unit tests for coding errors
		
			.pipe(frep([ // Remove 'use strict' commands
				{
					pattern: /'use strict';*/g,
					replacement: ''
				}
			]))
			
			.pipe(jshint())
			
			.pipe(jshint.reporter('jshint-stylish'))

			.pipe(jshint.reporter('fail'))

			// run unit tests
			
			//.pipe(jasmine()) //doesn't seem to work - does not discover deliberate syntax error
			//.pipe(jasmine({integration: true,vendor: 'js/**/*.js'}))
			
			;
	});


	gulp.task('docs', shell.task([ // create fresh jsDoc
		
		'if exist docs rmdir docs /S /Q',
		
		'jsdoc src/assets/js/ -r -d docs Readme.md'
	]));


	/*
	gulp.task('browser-sync', function() {
		browserSync.init({
	        server: {
	            baseDir: "./"
	        }
	    });
	});
	*/

	gulp.task('default', sequence(
		
		['setup', 'init-build'],

		['build-images', 'build-fonts', 'validate-scripts'],

		'build-pages',

		['validate-tests', 'docs']
	));


	gulp.task('automate', function() { //not updated with latest changes
			
			gulp.watch('src/**/*.html', ['pages']);
			
			gulp.watch('src/assets/img/*.*', ['images']);
			
			gulp.watch('src/assets/js/**/*.js', ['scripts']);
			
			gulp.watch('src/assets/css/**/*.css', ['styles']);
			
			gulp.watch('src/test/*_test.js', ['tests']);
	});

	/*
	 //example using sourcemaps, maybe return to this later
	 gulp.task('scripts', ['jshint'], function(){
		return gulp.src(path.src.js)
			.pipe(sourcemaps.init())
				.pipe(concat('main.min.js'))
				.pipe(uglify())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(path.build.js));
	});
	*/ 