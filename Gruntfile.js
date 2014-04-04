module.exports = function(grunt) {

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );

  var taskConfig = {
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      js: {
        src: [
          '<%= vendor_files.build.js %>',
          '<%= app_files.build.js %>',
        ],
        dest: 'public/dist/js/concat.js'
      },
      css: {
        src: [
          '<%= vendor_files.build.css %>',
          '<%= app_files.build.css %>',
        ],
        dest: 'public/dist/css/concat.css'
      },
    },
    rename: {
      css: {
        files: [
          {src: ['public/dist/css/concat.css'], dest: ['public/dist/css/min.css']},
        ]
      },
      js: {
        files: [
          {src: ['public/dist/js/concat.js'], dest: ['public/dist/js/min.js']},
        ]
      }
    },
    uglify: {
      options: {
        mangle: true,
        report: 'gzip',
        compress: {
          drop_console: true
        }
      },
      dist: {
        'src': ['public/dist/js/concat.js'],
        'dest': 'public/dist/js/min.js'
      }
    },
    cssmin: {
      dist: {
        'src': ['public/dist/css/concat.css'],
        'dest': 'public/dist/css/min.css'
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'public/img/', src: ['**'], dest: 'public/dist/img/'},
          {expand: true, cwd: 'public/fonts/', src: ['**'], dest: 'public/dist/fonts/'},
          {expand: true, cwd: 'public/js/', src: ['<%= app_files.copy.js %>'], dest: 'public/dist/js/'},
          {expand: true, cwd: 'public/css/', src: ['<%= app_files.copy.css %>'], dest: 'public/dist/css/'},
          {expand: true, cwd: 'public/js/vendor/', src: ['<%= vendor_files.copy.js %>'], dest: 'public/dist/js/'},
          {expand: true, cwd: 'public/css/vendor/', src: ['<%= vendor_files.copy.css %>'], dest: 'public/dist/css/'},
        ]
      },
    },
    clean: {
      build: {
        src: ['public/dist']
      }
    },
    delta: {
      js: {
         files: ['public/js/**/*.js', '!public/js/min.js'],
         tasks: ['concat:js', 'rename:js']
      },
      css: {
         files: ['public/css/**/*.css', '!public/css/min.css'],
         tasks: ['concat:css', 'copy', 'rename:css']
      },
    },
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Rename watch task so we can name our watch task watch and build things before launching watch
  grunt.renameTask('watch', 'delta');

  grunt.registerTask('default', ['clean', 'concat', 'rename', 'copy']);
  grunt.registerTask('prod', ['clean', 'concat', 'cssmin', 'uglify', 'copy']);
  grunt.registerTask('watch', ['default', 'delta']);
};

