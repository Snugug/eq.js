(function() {
  'use strict';

  var jsDir = 'build',
      sassDir = 'sass',
      cssDir = 'css',
      imgDir = 'img',
      fontsDir = 'fonts',
      rootDir = './',
      distDir = 'dist';

  module.exports = function (grunt) {
    grunt.initConfig({

      //////////////////////////////
      // Server
      ///////////////////////////////
      connect: {
        server: {
          options: {
            port: 9009,
            base: rootDir,
          }
        }
      },

      //////////////////////////////
      // Watch
      //////////////////////////////
      watch: {
        options: {
          livereload: 9011
        },
        html: {
          files: [
            rootDir + '**/*.html',
            '!node_modules/**/*.html'
          ]
        },
        css: {
          files: [rootDir + cssDir + '/**/*.css']
        },
        js: {
          files: [
            rootDir + jsDir + '/**/*.js',
            '!' + rootDir + jsDir + '/**/*.min.js',
            '!node_modules/**/*.js'
          ],
          tasks: ['jshint', 'uglify:distMin', 'compress:dist']
        }
      },

      //////////////////////////////
      // Compass
      //////////////////////////////
      compass: {
        options: {
          relativeAssets: true,
          debugInfo: false,
          bundleExec: true,
          noLineComments: true,
          sassDir: sassDir,
          imagesDir: rootDir + imgDir,
          cssDir: rootDir + cssDir,
          javascriptsDir: rootDir + jsDir,
          fontsDir: rootDir + fontsDir
        },
        dev: {
          options: {
            environment: 'development',
            watch: true
          }
        },
        dist: {
          options: {
            environment: 'production',
            force: true
          }
        }
      },

      //////////////////////////////
      // JSHint
      //////////////////////////////
      jshint: {
        options: {
          jshintrc: '.jshintrc'
        },
        all: [
          rootDir + jsDir + '/{,**/}*.js',
          '!' + rootDir + jsDir + '/{,**/}*.min.js'
        ]
      },

      //////////////////////////////
      // Uglify
      //////////////////////////////
      uglify: {
        dev: {
          options: {
            mangle: false,
            compress: false,
            beautify: true
          },
          files: [{
            expand: true,
            cwd: rootDir + jsDir,
            src: ['**/*.js', '!**/*.min.js'],
            dest: rootDir + jsDir,
            ext: '.js'
          }]
        },
        distSource: {
          options: {
            mangle: false,
            compress: false,
            beautify: true,
            banner: "/*! eq.js 1.4.1 (c) 2014 Sam Richard, MIT license */\n"
          },
          files: [{
            expand: true,
            cwd: rootDir + jsDir,
            src: ['**/*.js', '!**/*.min.js'],
            dest: distDir,
            ext: '.js'
          }]
        },
        distMin: {
          options: {
            mangle: true,
            compress: true,
            banner: "/*! eq.js 1.4.1 (c) 2014 Sam Richard, MIT license */\n"
          },
          files: [{
            expand: true,
            cwd: rootDir + jsDir,
            src: ['**/*.js', '!**/*.min.js'],
            dest: distDir,
            ext: '.min.js'
          }]
        }
      },

      //////////////////////////////
      // Compress
      //////////////////////////////
      compress: {
        dist: {
          options: {
            mode: 'gzip'
          },
          files: [{
            expand: true,
            cwd: distDir,
            src: ['**/*.min.js'],
            dest: distDir,
            ext: '.gz.js'
          }]
        }
      },

      //////////////////////////////
      // Parallel
      //////////////////////////////
      parallel: {
        dev: {
          options: {
            grunt: true,
            stream: true
          },
          tasks: ['watch', 'compass:dev']
        },
        dist: {
          options: {
            grunt: true,
            stream: true
          },
          tasks: ['uglify:distSource', 'uglify:distMin']
        }
      },

      //////////////////////////////
      // Bump
      //////////////////////////////
      bump: {
        options: {
          files: [
            'package.json',
            'bower.json'
          ]
          // commit: userConfig.bump.commit,
          // commitFiles: userConfig.bump.files,
          // createTag: userConfig.bump.tag,
          // push: userConfig.bump.push,
          // pushTo: userConfig.git.deployUpstream
        }
      }
    });

    //////////////////////////////
    // Grunt Task Loads
    //////////////////////////////
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    //////////////////////////////
    // Server Task
    //////////////////////////////
    grunt.registerTask('server', 'Development server', function() {
      grunt.task.run(['connect', 'parallel:dev']);
    });

    //////////////////////////////
    // Build Task
    //////////////////////////////
    grunt.registerTask('build', 'Builds Distribution File', function() {
      grunt.task.run(['uglify:distMin', 'compress:dist']);
    });

  };
}());