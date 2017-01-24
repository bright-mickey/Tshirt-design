module.exports = function (grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	
grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            ngapp: {
                dest: 'dist/scripts/ngapp.js',
                src: [
                     'baseUrl.js',
                      'NgApp/Home/Controller/DashboardController.js',
                      'NgApp/UtilService/AnimationService.js', 
                      'NgApp/UtilService/HttpService.js',  
                      'NgApp/Home/Services/dashboardService.js',
                      'app.js',
                      'NgApp/UtilService/Underscore.js'

                ]
            },

            js: {
                dest: 'dist/scripts/app.js',
                src: [

					'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/jquery-ui/jquery-ui.min.js',
                    'Common/Scripts/resizable-rotation.patch.js',
                    'Common/Scripts/jquery.ui.rotatable.min.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/angular/angular.min.js', 
                    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    'bower_components/ui-router-extras/release/ct-ui-router-extras.min.js',
                    'bower_components/angular-animate/angular-animate.min.js',
                    'bower_components/angular-sanitize/angular-sanitize.min.js',
                    'bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min.js',
                    'bower_components/angular-image-spinner/dist/angular-image-spinner.min.js',
                    'bower_components/angularjs-slider/dist/rzslider.min.js',
                    'bower_components/spin.js/spin.js',
                    'bower_components/underscore/underscore-min.js',
                    'bower_components/angular-strap/dist/angular-strap.min.js',
                    'bower_components/angular-strap/dist/angular-strap.tpl.min.js',
                    'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
                    'bower_components/ng-file-upload/ng-file-upload.min.js',
                    'bower_components/angular-fontselect/dist/angular-fontselect.min.js',
                    'Common/Scripts/webfont.js',
					'Common/Scripts/webfontLoader.js',
                    'Common/Scripts/webfontloader2.js',			

                    'dist/scripts/ngapp.js'
                ]
            },
            css: {
                dest: 'dist/style/app.css',
                src: [
						'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'Common/Styles/font-awesome.css',
                        'bower_components/angular-bootstrap-colorpicker/css/colorpicker.min.css',
                        'bower_components/angularjs-slider/dist/rzslider.min.css',
                        'Common/Styles/angular-motion.css',
                        'bower_components/angular-fontselect/dist/angular-fontselect.min.css',
                        'Common/Styles/style.css',
                        'Common/Styles/animate.css',
                        'Common/Styles/jquery-ui.css',
                        'Common/Styles/stylesheet.css',
                        'Common/Styles/jquery.ui.rotatable.css'
                ]
            }
        },

        cssmin: {
            css: {
                dest: 'dist/style/app.min.css',
                src: [

                   
						'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'Common/Styles/font-awesome.css',
                        'bower_components/angular-bootstrap-colorpicker/css/colorpicker.min.css',
                        'bower_components/angularjs-slider/dist/rzslider.min.css',
                        'Common/Styles/angular-motion.css',
                        'bower_components/angular-fontselect/dist/angular-fontselect.min.css',
                        'Common/Styles/style.css',
                        'Common/Styles/animate.css',
                        'Common/Styles/jquery-ui.css',
                        'Common/Styles/stylesheet.css',
                        'Common/Styles/jquery.ui.rotatable.css'
                ]
            }
        },

        uglify: {
            options: {
                compress: true,
                mangle: false
            },
            files: {
                dest: 'dist/scripts/app.min.js',
                src: [
                    'dist/scripts/app.js'
                ]
            }
        },

        clean: {
            build: {
                src: [
                    'dist/scripts/',
                    'dist/style/',
                    'dist/fonts/'
                ]
            }
        },

        watch: {
            css: {
                files: ['Common/Styles/style.css','Common/Styles/stylesheet.css'],
                tasks: ['concat:css', 'cssmin']
            },
            js: {
                files: ['NgApp/**/*.js', 'Common/**/*.js', 'Gruntfile.js'],
                tasks: ['build']
            },
            options: {
                livereload: true,
            }
        }

    });
	
	grunt.registerTask('build', ['cssmin', 'concat']);
   // grunt.registerTask('default', ['build']); 
    //grunt.registerTask('release', ['build', 'uglify']);
     grunt.registerTask('default', ['build', 'uglify']);
    //grunt.registerTask('default', ['release', 'clean']);
	};