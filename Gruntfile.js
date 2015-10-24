module.exports = function(grunt) {
  
  "use strict";
  
  require('load-grunt-tasks')(grunt);
  
  grunt.initConfig({
    
    /*** DATA ***/
    
    pkg: grunt.file.readJSON('package.json'),
    
    default_banner: '/*! <%= pkg.name %> v<%= pkg.version %> by <%= pkg.author.name %> */\n',
    
    browserslist: [
      "> 5%",
      "Last 2 versions",
      "IE >= 9",
      "Firefox >= 24",
      "Chrome >= 31",
      "Opera >= 12",
      "Safari >= 6",
    ],
    
    outputDir: 'dist',
    
    js3rdParty: [
      'vendor/Blob.js',
      'vendor/FileSaver.min.js',
    ],
    
    jsFiles: [
      'js/eventsTrait.js',
      
      'js/Memory.js',
      'js/Memory.Aggregate.js',
      'js/Memory.Cell.js',
      'js/Memory.BooleanCell.js',
      'js/Memory.PrimaryStorage.js',
      
      'js/Cpu.js',
      'js/Assembler.js',
      'js/Editor.js',
      
      'js/operations.js',
      'config.js',
      'js/init.js',
    ],
    
    /*** JavaScript ***/
    
    jshint: {
      options: {
        strict: true,    // require all functions (but not global) to be strict mode
        laxcomma: true,  // comma-first object definitions
        '-W014': true,   // "Bad line break before '+'."
        '-W084': true,   // if (a = b)
        '-W093': true,   // return a = b;
        // "-W086": true,   // allow switch-case fall-through
        validthis: true, // $(this) -> "Possible strict mode violation"
        
        globals: {
          jQuery: true,
        },
      },
      all: ['Gruntfile.js', '<%= jsFiles %>'],
    },
    
    concat: {
      dev: {
        src:  ['<%= js3rdParty %>', '<%= jsFiles %>'],
        dest: '<%= outputDir %>/<%= pkg.name %>.js'
      },
    },
    
    uglify: {
      dist: {
        options: {
          banner: '<%= default_banner %>',
          // screwIE8: true,
        },
        files: {
          '<%= outputDir %>/<%= pkg.name %>.js': [
            '<%= js3rdParty %>',
            '<%= jsFiles %>',
          ],
        }
      }
    },
    
    /*** CSS ***/
    
    less: {
      options: {
        banner: '<%= default_banner %>',
        plugins: [
          new (require('less-plugin-autoprefix'))({browsers: '<%= browserslist %>'}),
        ],
        strictMath: true,
      },
      dist: {
        options: {
          compress: true,
        },
        files: {
          '<%= outputDir %>/<%= pkg.name %>.css': 'less/index.less',
        },
      },
      dev: {
        files: {
          '<%= outputDir %>/<%= pkg.name %>.css': 'less/index.less',
        }
      }
    },
    
    /*** Tasks ***/
    
    watch: {
      stylesheets: {
        files: 'less/**/*.less',
        tasks: ['less:dev']
      },
      scripts: {
        files: 'js/**/*.js',
        tasks: ['concat:dev']
      }
    }
    
  });
  
  grunt.registerTask('dev',  ['less:dev', 'concat:dev']);
  grunt.registerTask('dist', ['less:dist', 'jshint', 'uglify:dist',]);
  grunt.registerTask('default', 'dev');
};
