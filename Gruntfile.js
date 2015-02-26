module.exports = function(grunt) {
    var globalConfig = {
        source: './source',
        build: './build/source',
        assets: './source/assets'
    };

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);    

    grunt.initConfig({
      pkg: require('./package.json'),
      globalConfig: globalConfig,
      // local webserver
      express: {
        all: {
          options: {
            port: 9000,
            hostname: "*",
            bases: ['<%= globalConfig.source %>'],
            livereload: true
          }
        }
      },
      // compile CSS from SCSS files
      sass: {
        dist: {
          options: {
            style: 'compressed'
          },
          files: {
            '<%= globalConfig.assets %>/stylesheets/css/<%=pkg.name %>.css': '<%= globalConfig.assets %>/stylesheets/sass/<%=pkg.name %>.scss'
          }
        },
        dev: {
          options: {
            style: 'expanded',
            debugInfo: true,
            lineNumbers: true,
          },
          files: {
            '<%= globalConfig.assets %>/stylesheets/css/<%=pkg.name %>.css': '<%= globalConfig.assets %>/stylesheets/sass/<%=pkg.name %>.scss'
          }
        }
      },    
      // watch for file changes and reload browser windows 
      watch: {
        all: {
          files: '<%= globalConfig.source %>/index.html',
          options: {
            livereload: true,
            spawn: false
          }
        },
        js: {
          files: ['<%= globalConfig.assets %>/javascripts/src/*.js'],
          options: {
            livereload: true,
            spawn: false
          }
        },
        css: {
          files: ['<%=globalConfig.assets %>/stylesheets/sass/*.scss'],
          tasks: ['sass:dev'],
          options: {
            livereload: true,
            spawn: false
          }
        }
      },
      // open your browser at the project's URL
      open: {
        all: {
          path: 'http://localhost:<%= express.all.options.port%>',
          app: "Firefox"
        }
      },   
      // clear out build directory
      clean: {
        build: [
          'build'
        ]
      },
      // copy project files to build dir
      copy: {
        main: {
          files: [{
            expand: true,
            src: [
              '<%= globalConfig.source %>/**',
              '!<%=globalConfig.assets %>/stylesheets/sass/**',
              '!<%=globalConfig.assets %>/images/sprites/**',
              '!<%=globalConfig.assets %>/javascripts/src/**',
              '!<%=globalConfig.assets %>/vendor/*.js',
            ],
            dest: 'build/'
          }]
        },
      },
      // compress compiled CSS
      cssmin: {
        production: {
            expand: true,
            cwd: '<%=globalConfig.assets %>/stylesheets/css',
            src: ['*.css'],
            dest: '<%=globalConfig.assets %>/stylesheets/css'
        }
      },
      // compress images
      imagemin: {
        png: {
          options: {
            optimizationLevel: 7
          },
          files: [
            {
              expand: true,
              cwd: '<%=globalConfig.assets %>/images/',
              src: ['**/*.png'],
              dest: '<%=globalConfig.assets %>/images/',
              ext: '.png'
            }
          ]
        },
        jpg: {
          options: {
            progressive: true
          },
          files: [
            {
              expand: true,
              cwd: '<%=globalConfig.assets %>/images/',
              src: ['**/*.jpg', '!**/sprites/**'],
              dest: '<%= globalConfig.build %>/assets/images/',
              ext: '.jpg'
            }
          ]
        }
      },
      // merge src scripts into one file
      concat: {
        js: {
          options: {
              separator: ';'
          },
          src: [
            '<%=globalConfig.assets %>/javascripts/src/*.js',
            '!<%=globalConfig.assets %>/javascripts/src/*.concat.js'
          ],
          dest: '<%=globalConfig.assets %>/javascripts/src/<%= pkg.name %>.concat.js'
        },
      },
      // compress merged vendor scripts file
      uglify: {
        options: {
          mangle: false,
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        dist: {
          src: ['<%=globalConfig.assets %>/javascripts/src/<%= pkg.name %>.concat.js'],
          dest: '<%=globalConfig.assets %>/javascripts/<%= pkg.name %>.min.js'
        }
      },
      obfuscator: {
        files: [
          '<%=globalConfig.assets %>/javascripts/<%= pkg.name %>.min.js'
        ],
        entry: '<%=globalConfig.assets %>/javascripts/<%= pkg.name %>.min.js',
        out: '<%=globalConfig.assets %>/javascripts/<%= pkg.name %>.min.js',
        root: __dirname
      },
      // create a deliverable zip file of built project
      compress: {
        main: {
          options: {
            archive: 'dist/<%=pkg.name %>-build_'+grunt.template.today('ddmmHHMM')+'.zip'
          },
          files: [
            {
              expand: true,
              cwd: '<%= globalConfig.build %>',
              src: ['**'],
              dest: '<%= pkg.name %>/'
            } // makes all src relative to cwd
          ]
        }
      },  
      targethtml: {
        dist: {
          files: {
            'build/source/index.html': 'build/source/index.html'
          }
        }
      }          
    });

    grunt.event.on('watch', function(action, filepath, target) {
      grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    // Creates the `server` task
    grunt.registerTask('server', [
      'express',
      'sass:dev',
      'watch'
    ]);

    // Default task.
    grunt.registerTask('default', ['server']);

    // Build for checking
    grunt.registerTask('build', [
      'clean',
      'sass:dist',
      'concat',
      'uglify',
      'copy',
      'targethtml']);    

    // Build for delivery
    grunt.registerTask('zip', ['build','compress']);   
};