twClickOutside.$inject = ['$window', '$parse']
function twClickOutside($window, $parse) {
    return {
        link: function (scope, el, attr) {
            if (!attr.twClickOutside) {
                return;
            }

            var ignore;
            if (attr.ignoreIf) {
                ignore = $parse(attr.ignoreIf);
            }

            var nakedEl = el[0];
            var fn = $parse(attr.twClickOutside);

            var handler = function (e) {
                if (nakedEl === e.target || nakedEl.contains(e.target) || (ignore && ignore(scope))) {
                    return;
                }

                scope.$apply(fn);
            };

            $window.addEventListener('click', handler, true);

            scope.$on('$destroy', function (e) {
                $window.removeEventListener('click', handler);
            });
        }
    };
}
var app = angular.module('teedesign', [
     'ngAnimate',
    //'ui.bootstrap',
    // 'ngColorThief',
     'HttpServiceModule',
     'mgcrea.ngStrap',
     'DashboardModule',
    //  'angular-sanitize',
    // 'jkuri.gallery',
    // 'textAngular',
    // 'angularUtils.directives.dirPagination',
    // "angular-ladda",
    // 'ng-breadcrumbs',
     'ngFileUpload',
    // 'mgo-angular-wizard',
     'colorpicker.module',
     'rzModule',
    // 'jdFontselect',
    'webfont-loader',
    'AnimationModule',
    // 'ngSanitize',
    //'ngCsv',
    //'ngScrollable',
    //'angular-loading-bar',
     'ui.router',
     'ct.ui.router.extras',
     'imageSpinner',


])
app.config(function ($urlRouterProvider, $stateProvider, $httpProvider) {


        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};

       

        $urlRouterProvider.otherwise('/home/create');
        $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'NgApp/Home/VIews/home.html',
                controller: 'DashboardController',
                controllerAs: 'vm',


            })
            .state('home.create', {
                url: '/create',
                sticky: true,
                dsr: true,
                views:{
                    'create': {
                        templateUrl: 'NgApp/Home/VIews/create.html',
                    }
                }
                
            })

            .state('home.goal', {
                url: '/set_goal',
                sticky: true,
                dsr: true,
                views:{
                    'goal': {
                        templateUrl: 'NgApp/Home/VIews/set_goal.html',
                    }
                }
                
            })
            .state('home.description', {
                url: '/descriptionn',
                sticky: true,
                dsr: true,
                views:{
                    'description': {
                        templateUrl: 'NgApp/Home/VIews/description.html',
                    }
                }
                
            })

           
    })
    app.run(function ($rootScope, $state, $location) {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
             $rootScope.target_state = toState.name;
      
           


        })
    })
    app.directive('thumbnail', [

        function () {
            return {
                restrict: 'AC',
                link: function (scope, elem, attrs) {
                    elem.bind('click', function () {
                        var src = elem.find('img').attr('src');

                        // call your SmoothZoom here
                        angular.element(attrs.options).css({
                            'background-image': 'url(' + src + ')'
                        });
                    });
                }
            };
        }
    ]);
   app.directive("limitTo", [function() {
     return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
      }
     }]);
    app.directive('twClickOutside', twClickOutside);
    app.directive("rotatez", function () {

        return {
            restrict: "A",
            scope: {
                onDragEnd: "&",
                onDrag: "&"
            },

            link: function (scope, element) {


                Draggable.create(element, {

                    type: "rotation",

                    throwProps: false,

                    onDrag: function () {

                        scope.rotation = this.rotation;

                        scope.$apply(function () {
                            scope.onDrag({ rotation: scope.rotation })
                        });

                    },

                    onDragEnd: function () {

                        scope.rotation = this.rotation;

                        scope.$apply(function () {
                            scope.onDragEnd({ rotation: scope.rotation })
                        });
                    }

                });




            }

        }

    });
    app.directive('draggable', function ($document) {
        return function (scope, element, attr) {
            var startX = 0,
                startY = 0,
                x = 0,
                y = 0;
            element.css({
                position: 'relative',
                cursor: 'pointer',
                display: 'block',
                color: 'white',
                width: '65px'
            });
            element.on('mousedown', function (event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.screenX - x;
                startY = event.screenY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.screenY - startY;
                x = event.screenX - startX;
                element.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        };
    })
    app.directive('optionsClass', function ($parse) {
        return {
            require: 'select',
            link: function (scope, elem, attrs, ngSelect) {
                // get the source for the items array that populates the select.
                var optionsSourceStr = attrs.ngOptions.split(' ').pop(),
                    // use $parse to get a function from the options-class attribute
                    // that you can use to evaluate later.
                    getOptionsClass = $parse(attrs.optionsClass);

                scope.$watch(optionsSourceStr, function (items) {
                    // when the options source changes loop through its items.
                    angular.forEach(items, function (item, index) {
                        // evaluate against the item to get a mapping object for
                        // for your classes.
                        var classes = getOptionsClass(item),
                            // also get the option you're going to need. This can be found
                            // by looking for the option with the appropriate index in the
                            // value attribute.
                            option = elem.find('option[value=' + index + ']');

                        // now loop through the key/value pairs in the mapping object
                        // and apply the classes that evaluated to be truthy.
                        angular.forEach(classes, function (add, className) {
                            if (add) {
                                angular.element(option).addClass(className);
                            }
                        });
                    });
                });
            }
        }
    })
    app.directive('zoom2', ['$compile',
        function ($compile) {
            return {
                restrict: 'AC',
                scope: {
                    tiny: "=",
                    small: "=",
                    big: "=",
                    title: "="
                },
                //Template doesn't seem work correctly, leaves a loading message.
                //template: '<a href="{{big}}" class="cloud-zoom" rel="adjustX: 10, adjustY:-4"><img src="{{small}}"/></a>',
                //replace: true,
                controller: ["$scope", "$attrs", "$element", "$compile",
                    function ($scope, $attrs, $element, $compile) {

                        $scope.init = function () {



                            //Create a watch to know when to open the PopOver Text
                            $scope.$watch('tiny + small + big + title', function (newValue, oldValue) {

                                var str = $scope.small + ' <a href="' + $scope.big + '" class="cloud-zoom" rel="adjustX: 10, adjustY:-4">' + '<img style="width:40%;" src="' + $scope.small + '"/></a>';
                                var e = $compile(str)($scope);
                                $element.html(e);

                                $(".cloud-zoom, .cloud-zoom-gallery").CloudZoom();

                            }, true);

                        }; // end init

                        //set the popover properties
                        $scope.init();

                    }
                ]

            };
        }
    ])
    app.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                        console.log(element[0].files[0]);
                    })
                })
            }
        }
    }])
    app.directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            //scope: true,   // optionally create a child scope
            link: function (scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function (value) {
                    console.log('value=', value);
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();

                        });
                    }
                });
                // to address @blesh's comment, set attribute value to 'false'
                // on blur event:
                element.bind('blur', function () {
                    console.log('blur');
                    scope.$apply(model.assign(scope, false));
                });
            }
        };
    }])
    app.directive('showIt', function () {
        return {
            link: function (scope, element, attributes) {
                element.css({ 'visibility': 'visible' });
            }
        }
    })

    app.directive('ngWidth', function () {
        return function (scope, elem, attrs) {
            attrs.$observe('ngWidth', function (width) {
                elem.attr('width', width);
            });
        };
    })
    app.directive('ngHeight', function () {
        return function (scope, elem, attrs) {
            attrs.$observe('ngHeight', function (height) {
                elem.attr('height', height);
            })
        }
    })
    app.directive('fileDropzone', function () {
        return {
            restrict: 'A',
            scope: {
                file: '=',
                fileName: '='
            },
            link: function (scope, element, attrs) {
                var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
                processDragOverOrEnter = function (event) {
                    if (event != null) {
                        event.preventDefault();
                    }
                    event.dataTransfer.effectAllowed = 'copy';
                    return false;
                };
                validMimeTypes = attrs.fileDropzone;
                checkSize = function (size) {
                    var _ref;
                    if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
                        return true;
                    } else {
                        alert("File must be smaller than " + attrs.maxFileSize + " MB");
                        return false;
                    }
                };
                isTypeValid = function (type) {
                    if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                        return true;
                    } else {
                        alert("Invalid file type.  File must be one of following types " + validMimeTypes);
                        return false;
                    }
                };
                element.bind('dragover', processDragOverOrEnter);
                element.bind('dragenter', processDragOverOrEnter);
                return element.bind('drop', function (event) {
                    var file, name, reader, size, type;
                    if (event != null) {
                        event.preventDefault();
                    }
                    reader = new FileReader();
                    reader.onload = function (evt) {
                        if (checkSize(size) && isTypeValid(type)) {
                            return scope.$apply(function () {
                                scope.file = evt.target.result;
                                if (angular.isString(scope.fileName)) {
                                    return scope.fileName = name;
                                }
                            });
                        }
                    };
                    file = event.dataTransfer.files[0];
                    name = file.name;
                    type = file.type;
                    size = file.size;
                    reader.readAsDataURL(file);
                    return false;
                });
            }
        };
    })
    app.controller('NavController', NavController);

NavController.$inject = ['$scope', '$rootScope'];

 function NavController($scope, $rootScope) {


}

