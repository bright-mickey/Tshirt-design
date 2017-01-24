
    var DashboardModule = angular.module("DashboardModule", [])
        DashboardModule.controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$rootScope', '$modal', '$http', '$location', '$state', 'DashboardService','AnimationService' , '_', '$popover', '$sce', 'Upload', '$timeout'];

    function DashboardController($scope, $rootScope, $modal, $http, $location, $state, DashboardService,AnimationService , _, $popover, $sce, Upload, $timeout) {
        //ViewModel//

        $scope.image = null
        $scope.imageFileName = ''

        var vm = this;
        vm.loadDefault = loadDefault;
        vm.activate_tab = activate_tab;
        vm.set_design_tab = set_design_tab;
        vm.selectShirt = selectShirt;
        vm.selectGraphic = selectGraphic;
        vm.fontsURL = fontsURL;
        vm.selectedGraphic = {};
        vm.rotation = false;
        vm.goal_range_max = 0;
        vm.goal_range_min = 0;
        vm.goal_target = 0;
        vm.fontsTag = [];
        vm.customImage = "";
        //vm.isFontLoaded = true;
        vm.fontList = {
            title: 'Font List',
        };
        vm.fontSelected = {
            family: 'ABeeZee',
        }
        vm.rotation = false;
        vm.hexPicker = {
            color: ''
        };

        vm.is_zoomed = false;

        vm.other_apperals = [];

        vm.imageURL1 = imageURL1;


        vm.show_toolbar = show_toolbar;
        vm.hide_toolbar = hide_toolbar;

        vm.alert_invalid = alert_invalid;
        vm.getRandomInAnimation = getRandomInAnimations;
        vm.rotate_goal = rotate_goal;
        vm.zoom = zoom;
        vm.setColor = setColor;
        vm.loadGraphics = loadGraphics;
        vm.add_style = add_style;
        vm.is_available = is_available;
        vm.prepare_shirts = prepare_shirts;
        vm.shirts_in_styles = [];
        vm.select_extra_shirt_colors = select_extra_shirt_colors;
        vm.total_color_selected = 1;
        vm.select_extra_shirt_color = select_extra_shirt_color;
        vm.limit_full = false;
        vm.profit_array = [];



        vm.extract_tags = extract_tags;
        vm.remove_tag = remove_tag;
        vm.build_url = build_url;
        vm.validate_url = validate_url;


         vm.launch_compaign = launch_compaign;

        vm.selectedProduct = {};


        function launch_compaign() {
            //  debugger;
            var to_be_sent = [];
            var shirts = _.where(vm.shirts_in_styles, { selected: true });
            for (var i = 0; i < shirts.length; i++) {
                to_be_sent[i] = {};
                to_be_sent[i].id = shirts[i].id;
                to_be_sent[i].price = shirts[i].total_unit_cost + shirts[i].profit;

                var colors = _.where(shirts[i].colors_available, { selected: true });
                var clr_ids = [];
                for (var j = 0; j < colors.length; j++) {
                    clr_ids.push(colors[j].color_id);
                }
                //  debugger;
                to_be_sent[i].colors = clr_ids;
                //id price colors


            }
            var defaultProduct = {};
            defaultProduct.id = vm.selectedShirt.id;
            var clrs_default = [];
            for (var i = 0; i < vm.selectedShirt.colors_available.length; i++) {
                var color = vm.selectedShirt.colors_available[i];
                if (color.selected)
                    clrs_default.push(color.color_id);


            }
            var tags_arr = "";
            for (var i = 0; i < vm.tags.length - 1; i++) {

                tags_arr = tags_arr + vm.tags[i] + ",";

            }
            tags_arr += vm.tags[vm.tags.length - 1];
            //  tags_arr=tags_arr.substr(0,tags_arr.length-1);
            defaultProduct.colors = clrs_default;
            // debugger;
            var days = Number(vm.compaign_length.trim().substr(0, 1));
            // var compaign_json = new FormData();
            // compaign_json.append("name",vm.compaign_title);
            // compaign_json.append("url",vm.url);
            // compaign_json.append("description",$scope.htmlcontenttwo);
            // compaign_json.append("length",days);
            // compaign_json.append("products",to_be_sent);
            // compaign_json.append("defaultProduct",defaultProduct);
            // compaign_json.append("tags",tags_arr);
            // compaign_json.append("category_id",vm.description.category);

            var compaign_json = {};

            compaign_json.name = vm.compaign_title;
            compaign_json.url = vm.url;
            compaign_jsondescription = $scope.htmlcontenttwo;
            compaign_json.length = days;
            compaign_json.products = to_be_sent;
            compaign_json.defaultProduct = defaultProduct;
            compaign_json.tags = tags_arr;
            compaign_json.category_id = vm.description.category;

            var sides = [];

            var activeSide = vm.default_tab === 1 ? "front" : vm.default_tab === 2 ? "back" : vm.default_tab === 3 ? "left" : "right";
            // var front = $("#box1front");
            // var svg = front.find('svg');
            // var view = svg[0].getAttributeNS(null, 'viewBox');
            // var arr = view.split(' ');



            for (var i = 0; i < 4; i++) {

                if (i == 0) {

                    if(vm.front_design.length){

                    var svgText = "";
                    var layers = [];
                    for (var j = 0; j < vm.front_design.length; j++) {
                        var element = $('#box' + vm.front_design[j].z_index + "front");
                        var pipe = j == 0 ? "||" : "";
                        svgText += _.escape(element.prop('outerHTML')) + pipe;
                    }

                    for (var k = 0; k < vm.front_design.length; k++) {
                        if (vm.front_design[k].type === 'text') {
                            var obj_ = vm.back_design[k];
                            //  var _obj = _.findWhere(vm.graphics, {id:obj_.id});
                            var element = $('#box' + vm.front_design[k].z_index + "front");
                            var svg = element.find('svg');
                            var view = svg[0].getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');

                            var textObj = {
                                "string": vm.front_design[k].text,
                                font: {
                                    id: k,
                                    family: vm.front_design[k].font,
                                    filename: vm.front_design[k].font,
                                    tags: [],
                                    priority: 1,
                                    url: null
                                },
                                fontSize: 24,
                                tag: "Popular",
                                lineHeight: 1.2,
                                alignment: "center",
                                colors: obj_.color,
                                outlineThickness: 0,
                                transformations: [],
                                matrix: {},
                                beingEdited: false,
                                origin: "Native",
                                type: "Text",
                                bbox: {
                                    x: parseInt(arr[0]),
                                    y: parseInt(arr[1]),
                                    width: parseInt(arr[2]),
                                    height: parseInt(arr[3]),
                                },
                                filename: "",
                                "preserve-colors": false,
                                fillColor: {
                                    id: k,
                                    value: vm.front_design[k].color,
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                outlineColor: {
                                    id: "default" + k,
                                    value: "#000000",
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                newDesignData: {
                                    transform: {

                                    }
                                }

                            }

                            layers.push(textObj);
                        }

                        if (vm.front_design[k].type === "svg") {
                            var obj_ = vm.back_design[k];
                            var _obj = _.findWhere(vm.graphics, { id: obj_.id });
                            var element = $('#box' + vm.front_design[k].z_index + "front");
                            var svg = element.find('svg');
                            var view = svg[0].getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');

                            var svgObj = {
                                "urlParams": {
                                    "filename": ""
                                },
                                name: "",
                                format: "",
                                "original_key": "",
                                sourceFilename: "",
                                svg_key: "",
                                png_key: "",
                                category: [],
                                colors: _obj.colors,
                                uploadId: null,
                                initialScale: 1,
                                transformations: [],
                                matrix: {},
                                beingEdited: false,
                                origin: "Native",
                                type: "Art",
                                bbox: {
                                    x: parseInt(arr[0]),
                                    y: parseInt(arr[1]),
                                    width: parseInt(arr[2]),
                                    height: parseInt(arr[3]),
                                },
                                filename: "",
                                "preserve-colors": false,
                                fillColor: {
                                    id: k,
                                    value: vm.front_design[k].color,
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                outlineColor: {
                                    id: "default" + k,
                                    value: "#000000",
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                newDesignData: {
                                    transform: {

                                    }
                                }

                            }

                            layers.push(svgObj);

                        }
                    }


                    var front = {
                        removeLayerBinding: {},
                        name: "front",
                        layers: layers,
                        bbox: {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        },
                        absoluteBBox: {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        },
                        beingViewed: false,
                        initialFreeTransformAttrs: null,
                        initialPrintableArea: null,
                        referencePoint: {},
                        ppi: 18,
                        editable: null,
                        sequence: 2,
                        priorPrintableBox: parseInt(arr[0]) + "," + $("#box1front").parent().parent().parent().css('top').substr(0, $("#box1front").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
                        scaleAndMove: null,
                        rasterImageInfo: [],
                        svg: svgText,


                    }
                    sides.push(front);
                }
            }

                if (i == 1) {

                    var svgText = "";
                    var element;
                    var layers = [];
                    for (var j = 0; j < vm.back_design.length; j++) {
                        var element = $('#box' + vm.back_design[j].z_index + "back");
                        var pipe = j == 0 ? "||" : "";
                        svgText += _.escape(element.prop('outerHTML')) + pipe;
                    }

                    for (var k = 0; k < vm.back_design.length; k++) {
                        if (vm.back_design[k].type === 'text') {

                            var obj_ = vm.back_design[k];
                            // var _obj = _.findWhere(vm.graphics, {id:obj_.id});
                            var element = $('#box' + vm.back_design[k].z_index + "back");
                            var svg = element.find('svg');
                            var view = svg[0].getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');

                            var textObj = {
                                "string": vm.back_design[k].text,
                                font: {
                                    id: k,
                                    family: vm.back_design[k].font,
                                    filename: vm.back_design[k].font,
                                    tags: [],
                                    priority: 1,
                                    url: null
                                },
                                fontSize: 24,
                                tag: "Popular",
                                lineHeight: 1.2,
                                alignment: "center",
                                colors: obj_.color,
                                outlineThickness: 0,
                                transformations: [],
                                matrix: {},
                                beingEdited: false,
                                origin: "Native",
                                type: "Text",
                                bbox: {
                                    x: parseInt(arr[0]),
                                    y: parseInt(arr[1]),
                                    width: parseInt(arr[2]),
                                    height: parseInt(arr[3]),
                                },
                                filename: "",
                                "preserve-colors": false,
                                fillColor: {
                                    id: k,
                                    value: vm.back_design[k].color,
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                outlineColor: {
                                    id: "default" + k,
                                    value: "#000000",
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                newDesignData: {
                                    transform: {

                                    }
                                }

                            }

                            layers.push(textObj);
                        }

                        if (vm.back_design[k].type === "svg") {
                            var obj_ = vm.back_design[k];
                            var _obj = _.findWhere(vm.graphics, { id: obj_.id });
                            //   debugger;
                            var element = $('#box' + vm.back_design[k].z_index + "back");
                            var svg = element.find('svg');
                            var view = svg[0].getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');

                            var svgObj = {
                                "urlParams": {
                                    "filename": ""
                                },
                                name: "",
                                format: "",
                                "original_key": "",
                                sourceFilename: "",
                                svg_key: "",
                                png_key: "",
                                category: [],
                                colors: _obj.colors,
                                uploadId: null,
                                initialScale: 1,
                                transformations: [],
                                matrix: {},
                                beingEdited: false,
                                origin: "Native",
                                type: "Art",
                                bbox: {
                                    x: parseInt(arr[0]),
                                    y: parseInt(arr[1]),
                                    width: parseInt(arr[2]),
                                    height: parseInt(arr[3]),
                                },
                                filename: "",
                                "preserve-colors": false,
                                fillColor: {
                                    id: k,
                                    value: vm.back_design[k].color,
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                outlineColor: {
                                    id: "default" + k,
                                    value: "#000000",
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                newDesignData: {
                                    transform: {

                                    }
                                }

                            }

                            layers.push(svgObj);

                        }
                    }


                    var back = {
                        removeLayerBinding: {},
                        name: "back",
                        layers: layers,
                        bbox: {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        },
                        absoluteBBox: {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        },
                        beingViewed: false,
                        initialFreeTransformAttrs: null,
                        initialPrintableArea: null,
                        referencePoint: {},
                        ppi: 18,
                        editable: null,
                        sequence: 2,
                        priorPrintableBox: parseInt(arr[0]) + "," + $("#box1back").parent().parent().parent().css('top').substr(0, $("#box1back").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
                        scaleAndMove: null,
                        rasterImageInfo: [],
                        svg: svgText,


                    }

                    sides.push(back);
                }

                 if (i == 2) {

                    var svgText = "";
                    var element;
                    var layers = [];
                    for (var j = 0; j < vm.left_design.length; j++) {
                        var element = $('#box' + vm.left_design[j].z_index + "left");
                        var pipe = j == 0 ? "||" : "";
                        svgText += _.escape(element.prop('outerHTML')) + pipe;
                    }

                    for (var k = 0; k < vm.left_design.length; k++) {
                        if (vm.left_design[k].type === 'text') {

                            var obj_ = vm.left_design[k];
                            // var _obj = _.findWhere(vm.graphics, {id:obj_.id});
                            var element = $('#box' + vm.left_design[k].z_index + "left");
                            var svg = element.find('svg');
                            var view = svg[0].getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');

                            var textObj = {
                                "string": vm.left_design[k].text,
                                font: {
                                    id: k,
                                    family: vm.left_design[k].font,
                                    filename: vm.left_design[k].font,
                                    tags: [],
                                    priority: 1,
                                    url: null
                                },
                                fontSize: 24,
                                tag: "Popular",
                                lineHeight: 1.2,
                                alignment: "center",
                                colors: obj_.color,
                                outlineThickness: 0,
                                transformations: [],
                                matrix: {},
                                beingEdited: false,
                                origin: "Native",
                                type: "Text",
                                bbox: {
                                    x: parseInt(arr[0]),
                                    y: parseInt(arr[1]),
                                    width: parseInt(arr[2]),
                                    height: parseInt(arr[3]),
                                },
                                filename: "",
                                "preserve-colors": false,
                                fillColor: {
                                    id: k,
                                    value: vm.left_design[k].color,
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                outlineColor: {
                                    id: "default" + k,
                                    value: "#000000",
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                newDesignData: {
                                    transform: {

                                    }
                                }

                            }

                            layers.push(textObj);
                        }

                        if (vm.left_design[k].type === "svg") {
                            var obj_ = vm.left_design[k];
                            var _obj = _.findWhere(vm.graphics, { id: obj_.id });
                            //   debugger;
                            var element = $('#box' + vm.left_design[k].z_index + "left");
                            var svg = element.find('svg');
                            var view = svg[0].getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');

                            var svgObj = {
                                "urlParams": {
                                    "filename": ""
                                },
                                name: "",
                                format: "",
                                "original_key": "",
                                sourceFilename: "",
                                svg_key: "",
                                png_key: "",
                                category: [],
                                colors: _obj.colors,
                                uploadId: null,
                                initialScale: 1,
                                transformations: [],
                                matrix: {},
                                beingEdited: false,
                                origin: "Native",
                                type: "Art",
                                bbox: {
                                    x: parseInt(arr[0]),
                                    y: parseInt(arr[1]),
                                    width: parseInt(arr[2]),
                                    height: parseInt(arr[3]),
                                },
                                filename: "",
                                "preserve-colors": false,
                                fillColor: {
                                    id: k,
                                    value: vm.left_design[k].color,
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                outlineColor: {
                                    id: "default" + k,
                                    value: "#000000",
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                newDesignData: {
                                    transform: {

                                    }
                                }

                            }

                            layers.push(svgObj);

                        }
                    }


                    var left = {
                        removeLayerBinding: {},
                        name: "left",
                        layers: layers,
                        bbox: {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        },
                        absoluteBBox: {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        },
                        beingViewed: false,
                        initialFreeTransformAttrs: null,
                        initialPrintableArea: null,
                        referencePoint: {},
                        ppi: 18,
                        editable: null,
                        sequence: 2,
                        priorPrintableBox: parseInt(arr[0]) + "," + $("#box1left").parent().parent().parent().css('top').substr(0, $("#box1left").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
                        scaleAndMove: null,
                        rasterImageInfo: [],
                        svg: svgText,


                    }

                    sides.push(left);
                }

                 if (i == 3) {

                    var svgText = "";
                    var element;
                    var layers = [];
                    for (var j = 0; j < vm.right_design.length; j++) {
                        var element = $('#box' + vm.right_design[j].z_index + "right");
                        var pipe = j == 0 ? "||" : "";
                        svgText += _.escape(element.prop('outerHTML')) + pipe;
                    }

                    for (var k = 0; k < vm.right_design.length; k++) {
                        if (vm.right_design[k].type === 'text') {

                            var obj_ = vm.right_design[k];
                            // var _obj = _.findWhere(vm.graphics, {id:obj_.id});
                            var element = $('#box' + vm.right_design[k].z_index + "right");
                            var svg = element.find('svg');
                            var view = svg[0].getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');

                            var textObj = {
                                "string": vm.right_design[k].text,
                                font: {
                                    id: k,
                                    family: vm.right_design[k].font,
                                    filename: vm.right_design[k].font,
                                    tags: [],
                                    priority: 1,
                                    url: null
                                },
                                fontSize: 24,
                                tag: "Popular",
                                lineHeight: 1.2,
                                alignment: "center",
                                colors: obj_.color,
                                outlineThickness: 0,
                                transformations: [],
                                matrix: {},
                                beingEdited: false,
                                origin: "Native",
                                type: "Text",
                                bbox: {
                                    x: parseInt(arr[0]),
                                    y: parseInt(arr[1]),
                                    width: parseInt(arr[2]),
                                    height: parseInt(arr[3]),
                                },
                                filename: "",
                                "preserve-colors": false,
                                fillColor: {
                                    id: k,
                                    value: vm.right_design[k].color,
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                outlineColor: {
                                    id: "default" + k,
                                    value: "#000000",
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                newDesignData: {
                                    transform: {

                                    }
                                }

                            }

                            layers.push(textObj);
                        }

                        if (vm.right_design[k].type === "svg") {
                            var obj_ = vm.back_design[k];
                            var _obj = _.findWhere(vm.graphics, { id: obj_.id });
                            //   debugger;
                            var element = $('#box' + vm.right_design[k].z_index + "right");
                            var svg = element.find('svg');
                            var view = svg[0].getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');

                            var svgObj = {
                                "urlParams": {
                                    "filename": ""
                                },
                                name: "",
                                format: "",
                                "original_key": "",
                                sourceFilename: "",
                                svg_key: "",
                                png_key: "",
                                category: [],
                                colors: _obj.colors,
                                uploadId: null,
                                initialScale: 1,
                                transformations: [],
                                matrix: {},
                                beingEdited: false,
                                origin: "Native",
                                type: "Art",
                                bbox: {
                                    x: parseInt(arr[0]),
                                    y: parseInt(arr[1]),
                                    width: parseInt(arr[2]),
                                    height: parseInt(arr[3]),
                                },
                                filename: "",
                                "preserve-colors": false,
                                fillColor: {
                                    id: k,
                                    value: vm.right_design[k].color,
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                outlineColor: {
                                    id: "default" + k,
                                    value: "#000000",
                                    origin: null,
                                    heather: false,
                                    texture: "",
                                },
                                newDesignData: {
                                    transform: {

                                    }
                                }

                            }

                            layers.push(svgObj);

                        }
                    }


                    var right = {
                        removeLayerBinding: {},
                        name: "right",
                        layers: layers,
                        bbox: {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        },
                        absoluteBBox: {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        },
                        beingViewed: false,
                        initialFreeTransformAttrs: null,
                        initialPrintableArea: null,
                        referencePoint: {},
                        ppi: 18,
                        editable: null,
                        sequence: 2,
                        priorPrintableBox: parseInt(arr[0]) + "," + $("#box1right").parent().parent().parent().css('top').substr(0, $("#box1right").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
                        scaleAndMove: null,
                        rasterImageInfo: [],
                        svg: svgText,


                    }

                    sides.push(right);
                }

            }



            var design = {

                lookupId: "f2345",
                sides: sides,
                activeSide: activeSide,
                high_quality_artwork: true,
                crap_quality_artwork: false,
                product_type_id: parseInt(vm.selectedShirt.id),
                frontColors: vm.total_front_colors.length,
                flashFront: false,
                backColors: vm.total_back_colors.length,
                flashBack: false,
                leftColors: vm.total_left_colors.length,
                flashLeft: false,
                rightColors: vm.total_right_colors.length,
                flashRight: false

            }

            // console.log(JSON.stringify(obj,null,4));

            // for (o in obj) {
            //     console.log(o, obj[o]);
            // }


            compaign_json.design = design;
            compaign_json.priorPrintableArea = {"front":"152,100,220,330","back":"155,60,215,330","left":"155,60,215,330","right":"155,60,215,330"};
            console.log(JSON.stringify(compaign_json,null,4));


            var fd = objectToFormData(compaign_json);

          

            //console.log(fd);
            // var formData = new FormData();
            // formData.append('compaign_json', JSON.stringify(compaign_json));
            DashboardService.LaunchCompaign(compaign_json).then(function(data){
                //console.clear();
                console.log(data);

            });



        }

        var objectToFormData = function(obj, form, namespace) {
    
            var fd = form || new FormData();
            var formKey;
            
            for(var property in obj) {
                if(obj.hasOwnProperty(property)) {
                
                if(namespace) {
                    formKey = namespace + '[' + property + ']';
                } else {
                    formKey = property;
                }
                
                // if the property is an object, but not a File,
                // use recursivity.
                if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
                    
                    objectToFormData(obj[property], fd, property);
                    
                } else {
                    
                    // if it's a string or a File object
                    fd.append(formKey, obj[property]);
                }
                
                }
            }
  
        return fd;
    
    };

        function validate_url() {
            if (vm.url && vm.url.length > 5)

                alert("URL is available and valid");

        }


        function build_url() {

            vm.url = vm.compaign_title.replace('/', '-');
            vm.url = vm.url.replace(/\s/g, '');

        }

        function remove_tag(index) {

            vm.tags.splice(index, 1);

        }

        function extract_tags(e) {
            if (!vm.raw_tags) return;


            if (vm.raw_tags.slice(-1) == ',') {
                vm.tags.push(vm.raw_tags.substr(0, vm.raw_tags.length - 1));

                vm.raw_tags = "";
            }

            if (e.keyCode == 13) {
                vm.tags.push(vm.raw_tags.substr(0, vm.raw_tags.length));

                vm.raw_tags = "";


            }

            vm.tags = _.uniq(vm.tags);

        }


        $scope.validateImage = function (node) {
            // debugger;
            // nude.init();

            // nude.load(document.getElementById('custom'));
            // // Scan it
            // nude.scan(function (result) {
            //     debugger;
            //     alert(result ? "Nudity found in " + node.id + "!" : "Not nude");
            // });
        }




        function select_extra_shirt_color(color, deselect_others) {
            if (color.selected) {
                color.selected = false;
                vm.total_color_selected--;
                vm.limit_full = false;
                vm.calculate_total_shirt_cost(vm.selectedModalShirt);
            }
            else {
                if (vm.total_color_selected <= 14) {
                    if (deselect_others) {
                        //  _.each();
                    }
                    vm.limit_full = false;
                    color.selected = true;
                    vm.total_color_selected++;
                }
                else {
                    vm.limit_full = true;
                }
            }
            var sould_be_selected = _.where(vm.selectedModalShirt.colors_available, { selected: true }).length;
            if (!sould_be_selected) vm.selectedModalShirt.selected = false;
            else vm.selectedModalShirt.selected = true;

        }

        function select_extra_shirt_colors(shirt) {
            if (!shirt.selected && vm.total_color_selected == 15) return;

            //   debugger;
            angular.forEach(shirt.colors_available, function (color) {

                for (var i = 0; i < vm.colors.length; i++) {
                    //   debugger;
                    var globalColor = vm.colors[i];
                    if (globalColor.id == color.color_id) {
                        color.color = "#" + globalColor.hex;
                    }
                }

            });
            vm.colors;

            vm.selectedModalShirt = shirt;
            shirt.selected = !shirt.selected;

            //  debugger;
            if (!shirt.selected) {

                var count = _.where(shirt.colors_available, { selected: true }).length;
                vm.total_color_selected -= (count);
                if (vm.total_color_selected < 0) vm.total_color_selected = 0;
                return;
            }
            //  select_extra_shirt_color(shirt.colors_available[0], true);

            var count = _.where(shirt.colors_available, { selected: true }).length;
            if (vm.total_color_selected + count > 15) {
                for (var i = 0; i < shirt.colors_available.length; i++) {
                    var color = shirt.colors_available[i];

                    color.selected = false;



                }
            }

            count = _.where(shirt.colors_available, { selected: true }).length;
            vm.total_color_selected += count;
            var sould_be_selected = _.where(vm.selectedModalShirt.colors_available, { selected: true }).length;
            if (!sould_be_selected) vm.selectedModalShirt.selected = false;
            viewShirtColors.$promise.then(viewShirtColors.show);
        }

        function prepare_shirts() {




        }


        function is_available(shirt) {

            // if(vm.selectedShirt.id == shirt.id)
            // return false;
            return true;

        }


        function rotate_goal(arg) {
            setTimeout(function () {
                $scope.$apply(function () {

                    if (!arg)
                        vm.goal_target = Number($('#goal_number').val());
                    if (Number(vm.goal_target) > vm.goal_range_max || Number(vm.goal_target) < vm.goal_range_min) {
                        vm.invalid_goal = true;
                        return;
                    }
                    vm.invalid_goal = false;
                    var degrees = Number($('#goal_number').val());
                    if (arg)
                        degrees = (360 / vm.goal_range_max) * arg;
                    else degrees = (360 / vm.goal_range_max) * degrees;
                    var element = $('#goal_handler');
                    element.css('transition', '-webkit-transform 800ms ease');
                    element.css('-webkit-transform', 'rotate(' + degrees + 'deg)');

                });

            }, 500);



        }

        vm.deselectLayer = function () {
            var arg = vm.default_tab;
            if (arg === 1 || arg === 2 || arg === 3 || arg === 4) {

                $('.user-list').css({ 'visibility': 'hidden' });
                $('.user-box').removeClass('border');

            }
        }

        function setColor(color) {

            var code_obj = _.findWhere(vm.colors, { hex: color.substr(1, color.length) });

            var selected_shirt = _.findWhere(vm.shirts_in_styles, { id: vm.selectedShirt.id });
            _.each(selected_shirt.colors_available, function (color_extra) { color_extra.selected = false; });
            var modal_obj = _.findWhere(selected_shirt.colors_available, { color_id: code_obj.id });
            modal_obj.selected = true;

            vm.shirt_color = color;
        }

        $scope.$watch('files', function (newVal, oldVal) {

            $scope.upload($scope.files);
        });
        $scope.$watch('file', function (newVal, oldVal) {

            if ($scope.file != null) {
                $scope.files = [$scope.file];
            }
        });
        $scope.log = '';

        $scope.upload = function (files) {
            if (!vm.agreed) {

                vm.alert_invalid('custom-checkbox');
                return;

            }
            // debugger;
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (!file.$error) {
                        Upload.upload({
                            url: baseURL + '/upload',
                            data: {
                                //  username: $scope.username,
                                image: file
                            }
                        }).then(function (resp) {
                            $timeout(function () {
                                // $scope.log = 'file: ' +
                                //     resp.config.data.file.name +
                                //     ', Response: ' + JSON.stringify(resp.data) +
                                //     '\n' + $scope.log;

                            });

                            debugger;
                            vm.customImageObj = resp.data.data;
                            vm.customImage = resp.data.data.path;


                            if (vm.default_tab === 1) {

                                var z_index = 1;
                                if (!vm.front_design.length) {
                                    z_index = 1;
                                }
                                else {

                                    z_index = vm.front_design[vm.front_design.length - 1].z_index + 1;
                                }



                                var obj = {
                                    "type": "img",
                                    "z_index": z_index,
                                    "src": vm.customImage,
                                    "colors": resp.data.data.colors
                                    //  "width": vm.customImageObj.image_width + "px",
                                    // "height": vm.customImageObj.image_height + "px"
                                }

                                vm.front_design.push(obj);



                            }

                            if (vm.default_tab === 2) {

                                var z_index = 1;
                                if (!vm.back_design.length) {
                                    z_index = 1;
                                }
                                else {

                                    z_index = vm.back_design[vm.back_design.length - 1].z_index + 1;
                                }



                                var obj = {
                                    "type": "img",
                                    "z_index": z_index,
                                    "src": vm.customImage,
                                    "colors": resp.data.data.colors
                                    //  "width": vm.customImageObj.image_width + "px",
                                    // "height": vm.customImageObj.image_height + "px"
                                }

                                vm.back_design.push(obj);



                            }

                            if (vm.default_tab === 3) {

                                var z_index = 1;
                                if (!vm.left_design.length) {
                                    z_index = 1;
                                }
                                else {

                                    z_index = vm.left_design[vm.left_design.length - 1].z_index + 1;
                                }



                                var obj = {
                                    "type": "img",
                                    "z_index": z_index,
                                    "src": vm.customImage,
                                    "colors": resp.data.data.colors
                                    //  "width": vm.customImageObj.image_width + "px",
                                    // "height": vm.customImageObj.image_height + "px"
                                }

                                vm.left_design.push(obj);



                            }

                            else if (vm.default_tab === 4) {

                                var z_index = 1;
                                if (!vm.right_design.length) {
                                    z_index = 1;
                                }
                                else {

                                    z_index = vm.right_design[vm.right_design.length - 1].z_index + 1;
                                }



                                var obj = {
                                    "type": "img",
                                    "z_index": z_index,
                                    "src": vm.customImage,
                                    "colors": resp.data.data.colors
                                    //  "width": vm.customImageObj.image_width + "px",
                                    // "height": vm.customImageObj.image_height + "px"
                                }

                                vm.right_design.push(obj);



                            }


                            // if(vm.front_design)
                            // var z_index = vm.front_design[vm.front_design.length - 1].z_index + 1;
                            // vm.front_design.push(
                            //     {
                            //         "type": "img",
                            //         "z_index": z_index,
                            //         "src": vm.customImage,
                            //         "width": vm.customImageObj.image_width + "px",
                            //         "height": vm.customImageObj.image_height + "px"
                            //     });



                        }, null, function (evt) {
                            // return;
                            // var progressPercentage = parseInt(100.0 *
                            //     evt.loaded / evt.total);
                            // $scope.log = 'progress: ' + progressPercentage +
                            //     '% ' + evt.config.data.file.name + '\n' +
                            //     $scope.log;
                        });
                    }
                }
            }
        };

        function add_style() {
            viewOptionsModal.$promise.then(viewOptionsModal.show);
        }




        /*
            MODALS
        
        */

        var viewOptionsModal = $modal({
            scope: $scope,
            animation: 'am-fade-and-scale',
            placement: 'center',
            template: 'NgApp/Home/VIews/viewOptions.html',
            show: false,
            title: 'Select shirt style'
        });

        var viewShirtColors = $modal({
            scope: $scope,
            animation: 'am-fade-and-scale',
            placement: 'center',
            template: 'NgApp/Home/VIews/setShirtColors.html',
            show: false,
            title: 'Select shirt Colors'
        });



        /* END MODALS */









        $scope.class = function () {
            return "animated fadeInDown";


        };

        function getRandomInAnimations() {

            return 'animated ' + AnimationService.GetRandomInAnimation();

        }

        function show_toolbar() {
            $('.ta-toolbar').css('display', 'inline-block');
            $('.ta-toolbar').addClass('animated fadeInDown');

        }

        function hide_toolbar() {

            $('.ta-toolbar').css('display', 'none');


        }

        function alert_invalid(arg) {

            var animation = AnimationService.GetRandomInAnimation();
            $('.' + arg).addClass("animated " + animation).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass('animated ' + animation);
            });
        }


        function loadCategories() {

            DashboardService.GetCategories().then(function (data) {

                vm.categories = data.data;

            });

        }

        function init() {


            vm.default_tab = 1;
            vm.default_design_tab = 1;
            vm.designSelected = false;

            loadCategories();
            vm.tags = [];

            vm.time_array = [];
            for (var i = 1; i <= 15; i++) {
                vm.time_array.push(addDays(i + 6));
            }

            vm.imageURL = imageURL;
            vm.graphicsURL = graphicsURL;
            loadShirtStyle();
            loadGraphics();
            // loadFonts();
            googleFonts();
            init_shirt_drawings();
            is_zoomed = false;
            vm.shirt_color = {};
            getColors();
            vm.filtered_colors = [];
            vm.graphics = [];
            loadConfig();
            vm.base_cost = {};
            vm.total_front_colors = [];
            vm.total_back_colors = [];
            vm.total_left_colors = [];
            vm.total_right_colors = [];
            vm.total_shirt_colors = 0;

            vm.is_searching = false;
            vm.search_results = [];
            vm.search_page = 1;
            init_predefined_categories();
            vm.selected_text = {};
            vm.selected_text.color = '#ff0000';
            vm.is_loading_graphics = false;
            search_query = '';

        }

        init();

        // $scope.$watch('vm.selectedShirt', function(oldVal, newVal){

        //     vm.base_cost.shirt_cost = vm.shirt_color;


        // });



         function init_predefined_categories() {
            vm.predefined_categories = ["Events", "Days", "Plants", "Food", "Drink", "Nature", "Patterns", "Military", "Transportation", "Christmas", "Earth", "Day", "Bees", "Flowers", "Rice", "Beer", "Spring", "Floral", "Air", "force", "Car", "Easter", "Mother's", "Day", "Cat", "Leaf", "Pizza", "Soda", "Summer", "Tile", "Army", "Bike", "Birthday", "Father's", "Day", "Dog", "Tree", "Burgers", "Tea", "Autumn", "Flowers", "Bomb", "Truck", "New", "year", "Valentine", "Day", "Deer", "Grass", "Ice", "Cream", "Coffee", "Winter", "Tribal", "Navy", "Cycle", "Anniversary", "Cancer", "Day", "Dolphin", "Wheat", "Pasta", "Milk", "Camping", "Aztec", "Helicopter", "Airplane", "Ramadan", "Independence", "Day", "Horse", "Organic", "Salad", "Cocktail", "Hunting", "Chevron", "Gun", "Train", "Diwali", "Labor", "Day", "Birds", "Sandwich", "Whiskey", "Fishing", "Tanks", "Boat", "Party", "Water", "Day", "Lion", "Juice", "Hiking", "Medals", "Scooter", "Halloween", "Poetry", "Day", "Tigers", "Wine", "Ocean", "Soldiers", "Taxi", "Eid", "Colors", "Day", "Eagle", "Fire", "Navy", "Ships", "Bus", "Wedding", "Health", "Day", "Monkey", "Clouds", "Spaceship", "Festival", "Family", "Day", "Parrots", "Circus", "Tourism", "Day", "Fish", "Olympic", "Games", "International", "Day", "Owl", "Friendship", "Day", "English", "Language", "Day", "Religion", "Sports", "Elements", "Designs", "People", "Entertainments", "Fundraise", "Islam", "Football", "Abstract", "Arts", "Family", "Movies", "Freedom", "Speech", "Jesus", "Hockey", "Textures", "Illustrations", "Child", "Music", "Human", "Rights", "Cross", "Cycling", "Flags", "Emoji", "Boy", "Games", "Youth", "Temple", "Soccer", "Arrows", "Cartoons", "Girl", "Comedy", "/", "Funny", "Animal", "Rescue", "Torah", "Basketball", "Characters", "Man", "Social", "Media", "Hunger", "Church", "Golf", "Typography", "Woman", "Culture", "World", "Peace", "Star", "of", "David", "Cricket", "Mask", "Body", "Angels", "Snowboarding", "Crown", "Baby", "Hindu", "Skateboarding", "Love", "Archery", "King", "Surfing", "Queen", "Place", "Monuments", "Technology", "Computers", "Telephones", "Steres", "Televisions", "Mobile", "Phones", "abc-bones-filled",
                "abc-bones-stoke",
                "adventure-and-travel-color",
                "airplanes",
                "airports-icons",
                "american-football",
                "animal-compilation",
                "animal-icon-02",
                "animals",
                "arrow-02",
                "autumn",
                "babe-icon-set",
                "baby",
                "baby-02",
                "back-to-school",
                "beauty",
                "beauty-spa",
                "beliefs-symbols",
                "birds-species",
                "birthday-party",
                "brazil",
                "browsers",
                "business",
                "business-and-office",
                "business-seo",
                "camping",
                "carootns",
                "cars",
                "castles",
                "category_list",
                "cat-set",
                "character-02",
                "charity",
                "chemistry",
                "china",
                "christmas",
                "cinema",
                "circle-medicine",
                "circles-hospital-color",
                "circus",
                "city-element-02",
                "clothes-and-footwear",
                "clothes-stroke",
                "cloud-02",
                "color-seo",
                "communication",
                "computer-security",
                "construction",
                "country-flags",
                "currencies",
                "cute-animal",
                "design-tools",
                "devices",
                "dialogue-assets",
                "dinosaur",
                "disco-music",
                "ecommerce",
                "education",
                "electronics",
                "emoticons",
                "essential",
                "expressions",
                "fairy-tale-set",
                "farm-element",
                "file-type-and-content",
                "file-types",
                "filled-feathers",
                "filled-management",
                "finance",
                "flags",
                "flamenco-dance",
                "flowers",
                "food",
                "food-and-restaurant",
                "forest-animals",
                "fruit-and-vegetable-juice",
                "fruits-pack",
                "furniture-and-decoration",
                "furniture-and-household",
                "game-assets",
                "gardening",
                "gastronomy-set",
                "glypho",
                "hairdressing",
                "hand-and-gesture-02",
                "hand-drawn-toys",
                "hawcons-emoji-stroke",
                "healthy-lifestyle",
                "heartbeat",
                "high-school",
                "horses-2",
                "hospital",
                "human-body",
                "interaction-assets",
                "interface",
                "ios7-set-lined-2",
                "keyholes",
                "kids",
                "kids-avatars",
                "landmarks",
                "landscapes",
                "logogram",
                "logotypes",
                "marketing",
                "medals",
                "medical",
                "medicine-color",
                "miscellaneous",
                "moon-phase",
                "multimedia-02",
                "music-02",
                "musical-genres",
                "my-town-public-buildings",
                "nature-flat-color",
                "new-business",
                "news",
                "office",
                "peace",
                "people-culture",
                "photo-02",
                "picnic-and-bbq-icons",
                "pokemon-go",
                "pregnancy",
                "printing",
                "productivity-02",
                "professions-avatars",
                "rating-and-vadilation-set",
                "real-estate",
                "religion",
                "sacred-geometry",
                "school-02",
                "science",
                "science-icons",
                "scientifics-study",
                "sea-life",
                "secret-service",
                "security",
                "seo-and-online-marketing",
                "settings-and-display-set",
                "shopping",
                "sleep-time",
                "snowflakes-set",
                "social-icons-rounded",
                "social-media",
                "space",
                "sports",
                "sports-flat-color",
                "star-set",
                "startups-and-new-business",
                "summer-fruits",
                "summer-holiday",
                "summertime-02",
                "summertime-vacations",
                "sun-icon-02",
                "symbol",
                "tatoo",
                "technology",
                "the-ultimate",
                "toys",
                "transportation",
                "travel",
                "travel-and-tourism",
                "travel-and-transportation",
                "trohies",
                "ui-02",
                "universe",
                "user-interface",
                "valentines",
                "water",
                "weather",
                "web-buttons",
                "web-design",
                "web-interface",
                "web-navigation-line-craft",
                "wedding",
                "yoga-poses",
                "young-avatar",
                "zodiac"
            ];
        }


        vm.search_arts = function () {
             vm.arts_not_found = false;
            vm.search_page = 1;
            if (!vm.search_graphics || (vm.search_graphics).trim().length == 0) {
                vm.is_searching = false;
                vm.search_page = 1;
                vm.search_results = [];

                return;


            }
            else {
                if (search_query != vm.search_graphics) {
                    vm.search_page = 1;
                    vm.search_results = [];
                }
                vm.is_searching = true;
                vm.is_loading_graphics = true;
                DashboardService.SearchArts(vm.search_graphics, vm.search_page).then(function (data) {
                    if (!data.data.length) {
                        vm.arts_not_found = true;
                        vm.is_loading_graphics = false;
                        return;
                    }
                    search_query = angular.copy(vm.search_graphics);
                    vm.search_results = data.data;
                    vm.search_page++;
                    vm.arts_not_found = false;
                    vm.is_loading_graphics = false;

                });

            }

        }

        vm.search_more = function () {
            vm.arts_not_found = false;

            vm.is_searching = true;
            if (search_query != vm.search_graphics) {
                vm.search_page = 1;
                vm.search_results = [];
            }
            vm.is_loading_graphics = true;
            DashboardService.SearchArts(vm.search_graphics, vm.search_page).then(function (data) {
                vm.is_loading_graphics = false;
                if (!data.data.length) {
                    vm.arts_not_found = true;
                    return;
                }
                vm.search_results = vm.search_results.concat(data.data);
                vm.search_page++;
                vm.arts_not_found = false;

            });



        }

        vm.validate_search = function (e) {
            // debugger;
            e.preventDefault();
            if (!vm.search_graphics || (vm.search_graphics).trim().length == 0) {
                vm.is_searching = false;
                vm.search_page = 1;
                return;

            }
            else if (e.keyCode == '13') {
                vm.search_arts();
            }

        }

        $scope.$watch('vm.shirt_color', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            //  debugger;
            var color_val = vm.shirt_color.substr(1, vm.shirt_color.length - 1);

            var _color_id = _.findWhere(vm.colors, { hex: color_val }).id;
            vm.base_cost.blank_cost = parseFloat(_.findWhere(vm.selectedShirt.colors_available, { color_id: _color_id }).blank_cost);
            //calculate_total_color_cost();
            //calculate_unit_cost();
            vm.calculate_total_shirt_cost();

        });

        $scope.$watch('vm.selectedShirt', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            setTimeout(function () {

                var color_val = vm.shirt_color.substr(1, vm.shirt_color.length - 1);
                var _color_id = _.findWhere(vm.colors, { hex: color_val }).id;
                vm.base_cost.blank_cost = parseFloat(_.findWhere(vm.selectedShirt.colors_available, { color_id: _color_id }).blank_cost);
                //calculate_total_color_cost();
                vm.calculate_total_shirt_cost();

            }, 500);


        });

        function calculate_front() {
         //   debugger;
            vm.total_front_colors = [];
            var front_colors = 0;
            if (!vm.front_design.length) { vm.total_front_colors = []; return; }
            angular.forEach(vm.front_design, function (obj, count) {
                
                if (obj.type == 'svg') {

                    var original = _.where(vm.graphics, { id: obj.id })[0];
                    if (original.colors) {

                        var colors_array = original.colors.split(",");
                        add_to_colors(1, colors_array);

                    }

                }
                else if (obj.type == "img") {

                    add_to_colors(1, obj.colors);
                }
                else if (obj.type == "text") {
                    var arr = [];
                    arr[0] = obj.color;
                    add_to_colors(1, arr);
                }

            });
        }

        function calculate_back() {
            vm.total_back_colors = [];
            var back_colors = 0;
            if (!vm.back_design.length) { vm.total_back_colors = []; return; }
            angular.forEach(vm.back_design, function (obj, count) {

                if (obj.type == 'svg') {

                    var original = _.where(vm.graphics, { id: obj.id })[0];
                    if (original.colors) {

                        var colors_array = original.colors.split(",");
                        add_to_colors(2, colors_array);

                    }

                }
                else if (obj.type == "img") {

                    add_to_colors(2, obj.colors);
                }
                else if (obj.type == "text") {
                    var arr = [];
                    arr[0] = obj.color;
                    add_to_colors(2, arr);
                }

            });
        }

        function calculate_left() {
            vm.total_left_colors = [];
            var left_colors = 0;
            if (!vm.left_design.length) { vm.total_left_colors = []; return; }
            angular.forEach(vm.left_design, function (obj, count) {

                if (obj.type == 'svg') {

                    var original = _.where(vm.graphics, { id: obj.id })[0];
                    if (original.colors) {

                        var colors_array = original.colors.split(",");
                        add_to_colors(3, colors_array);

                    }

                }
                else if (obj.type == "img") {

                    add_to_colors(3, obj.colors);
                }
                else if (obj.type == "text") {
                    var arr = [];
                    arr[0] = obj.color;
                    add_to_colors(3, arr);
                }

            });
        }

        function calculate_right() {
            vm.total_right_colors = [];
            var right_colors = 0;
            if (!vm.right_design.length) { vm.total_right_colors = []; return; }
            angular.forEach(vm.right_design, function (obj, count) {

                if (obj.type == 'svg') {

                    var original = _.where(vm.graphics, { id: obj.id })[0];
                    if (original.colors) {

                        var colors_array = original.colors.split(",");
                        add_to_colors(4, colors_array);

                    }

                }
                else if (obj.type == "img") {

                    add_to_colors(4, obj.colors);
                }
                else if (obj.type == "text") {
                    var arr = [];
                    arr[0] = obj.color;
                    add_to_colors(4, arr);
                }

            });
        }

        $scope.$watchCollection('vm.front_design', function (newVal, oldVal) {
            if (newVal == oldVal) return;

            var front_colors = 0;
            angular.forEach(vm.front_design, function (obj, count) {
                //   debugger;
                if (obj.type == 'svg') {

                    var original = _.where(vm.graphics, { id: obj.id })[0];
                    if (original.colors) {

                        var colors_array = original.colors.split(",");
                        add_to_colors(1, colors_array);

                    }

                }
                else if (obj.type == "img") {

                    add_to_colors(1, obj.colors);
                }
                else if (obj.type == "text") {
                    var arr = [];
                    arr[0] = obj.color;
                    add_to_colors(1, arr);
                }

            });

        }, true);

        $scope.$watch('vm.back_design', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            // debugger;
            var front_colors = 0;
            angular.forEach(vm.back_design, function (obj, count) {

                if (obj.type == 'svg') {

                    var original = _.where(vm.graphics, { id: obj.id })[0];
                    if (original.colors) {

                        var colors_array = original.colors.split(",");
                        add_to_colors(2, colors_array);

                    }

                }
                else if (obj.type == "img") {

                    add_to_colors(2, obj.colors);
                }
                else if (obj.type == "text") {
                    var arr = [];
                    arr[0] = obj.color;
                    add_to_colors(2, arr);
                }

            });

        }, true);


        $scope.$watch('vm.left_design', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            // debugger;
            var front_colors = 0;
            angular.forEach(vm.left_design, function (obj, count) {

                if (obj.type == 'svg') {

                    var original = _.where(vm.graphics, { id: obj.id })[0];
                    if (original.colors) {

                        var colors_array = original.colors.split(",");
                        add_to_colors(3, colors_array);

                    }

                }
                else if (obj.type == "img") {

                    add_to_colors(3, obj.colors);
                }
                else if (obj.type == "text") {
                    var arr = [];
                    arr[0] = obj.color;
                    add_to_colors(3, arr);
                }

            });

        }, true);

        $scope.$watch('vm.right_design', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            // debugger;
            var front_colors = 0;
            angular.forEach(vm.right_design, function (obj, count) {

                if (obj.type == 'svg') {

                    var original = _.where(vm.graphics, { id: obj.id })[0];
                    if (original.colors) {

                        var colors_array = original.colors.split(",");
                        add_to_colors(4, colors_array);

                    }
                }
                else if (obj.type == "img") {

                    add_to_colors(4, obj.colors);
                }


                else if (obj.type == "text") {
                    var arr = [];
                    arr[0] = obj.color;
                    add_to_colors(2, arr);
                }

            });

        }, true);


        $scope.$watch('vm.total_front_colors', function (newVal, oldVal) {

            if (newVal == oldVal) return;
            vm.total_shirt_colors = vm.total_front_colors.length + vm.total_back_colors.length + vm.total_left_colors.length + vm.total_right_colors.length;

            vm.calculate_total_shirt_cost();

        });

        $scope.$watch('vm.total_back_colors', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            vm.total_shirt_colors = vm.total_front_colors.length + vm.total_back_colors.length + vm.total_left_colors.length + vm.total_right_colors.length;


            vm.calculate_total_shirt_cost();
        });

        $scope.$watch('vm.total_left_colors', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            vm.total_shirt_colors = vm.total_front_colors.length + vm.total_back_colors.length + vm.total_left_colors.length + vm.total_right_colors.length;


            vm.calculate_total_shirt_cost();

        });
        $scope.$watch('vm.total_right_colors', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            vm.total_shirt_colors = vm.total_front_colors.length + vm.total_back_colors.length + vm.total_left_colors.length + vm.total_right_colors.length;

            vm.calculate_total_shirt_cost();


        });

        $scope.$watch('vm.total_shirt_colors', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            //  vm.total_shirt_colors = vm.total_front_colors.length + vm.total_back_colors.length + vm.total_left_colors.length + vm.total_right_colors.length;
            vm.calculate_total_shirt_cost();


        });
        $scope.$watch('vm.goal_target', function (newVal, oldVal) {
            if (newVal == oldVal) return;
            //  vm.total_shirt_colors = vm.total_front_colors.length + vm.total_back_colors.length + vm.total_left_colors.length + vm.total_right_colors.length;
            setTimeout(function () {
                vm.calculate_total_shirt_cost();
            }, 500);



        });
        //shirt.profit



        function calculate_total_color_cost(arg) {
            // debugger;

            var front = (vm.total_front_colors.length > 10) ? 10 : vm.total_front_colors.length;
            var back = (vm.total_back_colors.length > 10) ? 10 : vm.total_back_colors.length;
            var left = (vm.total_left_colors.length > 5) ? 5 : vm.total_left_colors.length;
            var right = (vm.total_right_colors.length > 5) ? 5 : vm.total_right_colors.length;

            if (arg && arg.left != 1) {
                left = 0;
                right = 0;
            }

            if (front == 0) var front_price = 0;
            else var front_price = ((front - 1) * 0.5 + 1.5);
            if (back == 0) var back_price = 0;
            else var back_price = ((back - 1) * 0.5 + 1.5);
            var left_price = ((left - 1) * 0.5 + 0.5);
            var right_price = ((right - 1) * 0.5 + 0.5);
            if (arg)
                arg.total_color_cost = front_price + back_price + left_price + right_price;
            else vm.total_color_cost = front_price + back_price + left_price + right_price;

        }

        function calculate_unit_cost(arg) {
            if (arg) {
                //debugger;
                var is_color = false;
                var index = 0;
                for (var i = 0; i < arg.colors_available.length; i++) {
                    var color = arg.colors_available[i];
                    if (color.selected)
                        if (Number(color.color_id) > 1) {
                            is_color = true;
                            index = i;
                            break;

                        }
                }

                return parseFloat(arg.colors_available[index].blank_cost);

            }
            else {


                var is_color = false;
                if (vm.shirt_color != '#FFFFFF')
                    is_color = true;

                if (is_color) {
                    return parseFloat(vm.selectedShirt.colors_available[1].blank_cost);
                    //return 5.5;
                }
                return parseFloat(vm.selectedShirt.colors_available[0].blank_cost);


            }

        }



        vm.calculate_profit = function () {

            if (vm.shirts_in_styles && vm.shirts_in_styles.length) {
                angular.forEach(vm.shirts_in_styles, function (shirt, index) {
                    //  debugger;
                    if (!shirt.selected) return;
                    var selected_length = _.where(vm.shirts_in_styles, { selected: true }).length;
                    var total_unit_cost = shirt.total_shirt_base_cost / vm.goal_target;
                    var profit = shirt.profit;
                    //shirt.total_profit = ((total_unit_cost + profit) * vm.goal_target);
                    shirt.total_profit = profit * vm.goal_target;
                    // debugger;

                    var values = _.where(vm.shirts_in_styles, { selected: true });
                    values = _.sortBy(values, function (num) { return num.total_profit; });
                    vm.profits = {};
                    vm.profits.min = values[0].total_profit;
                    vm.profits.max = values[values.length - 1].total_profit;

                    if (!$scope.$$phase)
                        $scope.$apply();
                    //   debugger;
                    //  if(index == vm.shirts_in_styles.length)debugger;

                    //vm.profits = [];
                    // for(var i=0;i<vm.shirts_in_styles.length;i++){

                    //     if(shirt.selected)
                    //         vm.profits.push(shirt.total_profit);

                    // }

                    // vm.profits = _.sortBy(vm.profits, function(n){return n;});





                    // if (index == selected_length) {
                    //     debugger;



                    //     vm.shirts_in_styles = _.sortBy(vm.shirts_in_styles, 'total_profit');



                    //     vm.profit = {};
                    //     var profits = [];


                    //     angular.forEach(vm.shirts_in_styles, function(_shirt, _index){
                    //         if(shirt.selected)
                    //         profits.push(shirt.total_profit);


                    //     if (_index == selected_length) {
                    //         debugger;
                    //         profits = _.sortBy(profits, function (num) { return num; });
                    //         vm.profit.max = profits[0];
                    //         vm.profit.min = profits[vm.profit.length - 1];

                    //     }

                    //     });


                    // }
                });



            }
            if (!$scope.$$phase)
                $scope.$apply();

        }

        vm.calculate_total_shirt_cost = function (arg) {


            if (arg) {
                // debugger;
                var unit_cost = calculate_unit_cost(arg);
                calculate_total_color_cost(arg);

                var total_colors_with_goal = arg.total_color_cost * vm.goal_target;

                var print_percent = calculate_print_discount();

                var garment_discount = calculate_garment_discount();

                var color_price_with_discount = total_colors_with_goal - ((print_percent / 100) * total_colors_with_goal);

                var total_garment_price = unit_cost * vm.goal_target;

                var garment_price_with_discount = total_garment_price - ((garment_discount / 100) * total_garment_price);

                arg.total_shirt_base_cost = garment_price_with_discount + color_price_with_discount;

                arg.total_unit_cost = arg.total_shirt_base_cost / vm.goal_target;


            }
            else {
                var unit_cost = calculate_unit_cost();
                calculate_total_color_cost();
                //vm.total_color_cost
                var total_colors_with_goal = vm.total_color_cost * vm.goal_target;

                var print_percent = calculate_print_discount();

                var garment_discount = calculate_garment_discount();

                var color_price_with_discount = total_colors_with_goal - ((print_percent / 100) * total_colors_with_goal);

                var total_garment_price = unit_cost * vm.goal_target;

                var garment_price_with_discount = total_garment_price - ((garment_discount / 100) * total_garment_price);

                vm.total_shirt_base_cost = garment_price_with_discount + color_price_with_discount;

                vm.total_unit_cost = vm.total_shirt_base_cost / vm.goal_target;

                if (vm.shirts_in_styles && vm.shirts_in_styles.length) {

                    angular.forEach(vm.shirts_in_styles, function (shirt) {

                        vm.calculate_total_shirt_cost(shirt);

                    });

                }

            }

            if (!$scope.$$phase)
                $scope.$apply();

            vm.calculate_profit();

        }

        function calculate_garment_discount() {
            if (vm.goal_target >= 50 && vm.goal_target <= 99) return 5;
            if (vm.goal_target >= 100 && vm.goal_target <= 199) return 6;
            if (vm.goal_target >= 200 && vm.goal_target <= 499) return 7;
            if (vm.goal_target >= 500 && vm.goal_target <= 999) return 8;
            if (vm.goal_target >= 1000) return 10;
            else return 0;
        }

        function calculate_print_discount() {

            if (vm.goal_target >= 100 && vm.goal_target <= 199) return 12;
            if (vm.goal_target >= 200 && vm.goal_target <= 499) return 14;
            if (vm.goal_target >= 500 && vm.goal_target <= 999) return 16;
            if (vm.goal_target >= 1000) return 20;

            else return 0;

        }

        $scope.$watch('vm.selected_text.color', function (newVal, oldVal) {
            if (oldVal) {
                if (vm.default_tab == 1) {
                    var index = _.findIndex(vm.total_front_colors, oldVal);
                    vm.total_front_colors.splice(index, 1);

                }
                if (vm.default_tab == 2) {
                    var index = _.findIndex(vm.total_back_colors, oldVal);
                    vm.total_back_colors.splice(index, 1);

                }
                if (vm.default_tab == 3) {
                    var index = _.findIndex(vm.total_left_colors, oldVal);
                    vm.total_left_colors.splice(index, 1);

                }
                if (vm.default_tab == 4) {
                    var index = _.findIndex(vm.total_right_colors, oldVal);
                    vm.total_right_colors.splice(index, 1);

                }

            }

            if (vm.default_tab == 1) {
                var texts = _.where(vm.front_design, { "type": "text" });
                var colors = [];
                for (var i = 0; i < texts.length; i++) {
                    colors.push(texts[i].color);
                }

                add_to_colors(1, colors);


            }

            else if (vm.default_tab == 2) {
                var texts = _.where(vm.back_design, { "type": "text" });
                var colors = [];
                for (var i = 0; i < texts.length; i++) {
                    colors.push(texts[i].color);
                }

                add_to_colors(2, colors);


            }

            else if (vm.default_tab == 3) {
                var texts = _.where(vm.left_design, { "type": "text" });
                var colors = [];
                for (var i = 0; i < texts.length; i++) {
                    colors.push(texts[i].color);
                }

                add_to_colors(3, colors);


            }
            else if (vm.default_tab == 4) {
                var texts = _.where(vm.right_design, { "type": "text" });
                var colors = [];
                for (var i = 0; i < texts.length; i++) {
                    colors.push(texts[i].color);
                }

                add_to_colors(4, colors);


            }
        });

        $scope.change = function () {

            if (vm.default_tab == 1) {
                var texts = _.where(vm.front_design, { "type": "text" });
                var colors = [];
                for (var i = 0; i < texts.length; i++) {
                    colors.push(texts[i].color);
                }
                //var arr = [];
                //arr[0] = vm.selected_text.color;
                debugger;
                add_to_colors(1, colors);


            }

            else if (vm.default_tab == 2) {


                var arr = [];
                arr[0] = vm.selected_text.color;
                add_to_colors(2, arr);


            }
            else if (vm.default_tab == 3) {


                var arr = [];
                arr[0] = vm.selected_text.color;
                add_to_colors(3, arr);


            }
            else if (vm.default_tab == 4) {


                var arr = [];
                arr[0] = vm.selected_text.color;
                add_to_colors(4, arr);


            }



        }


        function add_to_colors(side, colors) {
            //  debugger;
            if (side == 1) {
                vm.total_front_colors = vm.total_front_colors.concat(colors);

                vm.total_front_colors = _.uniq(vm.total_front_colors);

            }

            if (side == 2) {
                vm.total_back_colors = vm.total_back_colors.concat(colors);
                vm.total_back_colors = _.uniq(vm.total_back_colors);

            }
            if (side == 3) {
                vm.total_left_colors = vm.total_left_colors.concat(colors);
                vm.total_left_colors = _.uniq(vm.total_left_colors);

            }
            if (side == 4) {
                vm.total_right_colors = vm.total_right_colors.concat(colors);
                vm.total_right_colors = _.uniq(vm.total_right_colors);

            }

        }

        $scope.$watch('vm.base_cost', function (newVal, oldVal) {
            if (newVal == oldVal) return;

            vm.base_cost.total = vm.base_cost.blank_cost;



        }, true);

        // $scope.$watch('vm.shirt_color', function(newVal, oldVal){

        //     debugger;
        //     var color_val = newVal.substr(1,newVal.length-1);

        //     vm.base_cost.shirt_cost = _.findWhere(vm.colors, {hex:color_val});


        // });

        function getColors() {
            DashboardService.GetColors().then(function (data) {

                // debugger;
                vm.colors = data.data;
                // vm.shirt_color = "#"+vm.colors[0].hex;

            });
        }

        function zoom() {

            vm.is_zoomed = !vm.is_zoomed;

            var elem = $('.shirt-view');
            var detailLIst = $(".detail-list");
            var changeZoomIn = $('.icon-zoom-01');
            var changeZoomOut = $('.glyphicon-zoom-out');

            if (vm.is_zoomed) {


                elem.addClass("animated zoomPrint").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass('animated zoomPrint');
                });
                detailLIst.addClass('detailListZoom');
                changeZoomIn.removeClass('icon-zoom-01').addClass('glyphicon glyphicon-zoom-out');
                // elem.css('zoom', '1.5');



            }
            else {


                elem.removeClass('zoomPrint animated');
                detailLIst.removeClass('detailListZoom');
                $(changeZoomOut).removeClass('glyphicon glyphicon-zoom-out').addClass('icon-zoom-01');

            }
        }
        $scope.get_style = function () {
            if (!vm.selectedShirt) {
                return;
            }


            if (vm.default_tab == 1) {

                $scope.temp_parent = "top:" + vm.selectedShirt.printable_front_top + "px" + ";" + "left:" + vm.selectedShirt.printable_front_left + "px";
                $scope.temp_child = 'width:' + vm.selectedShirt.printable_front_width + "px" + ";" + 'height:' + vm.selectedShirt.printable_front_height + "px";

            }
            else if (vm.default_tab == 2) {

                $scope.temp_parent = "top:" + vm.selectedShirt.printable_back_top + "px" + ";" + "left:" + vm.selectedShirt.printable_back_left + "px";
                $scope.temp_child = 'width:' + vm.selectedShirt.printable_back_width + "px" + ";" + 'height:' + vm.selectedShirt.printable_back_height + "px";

            }

            else if (vm.default_tab == 3) {

                $scope.temp_parent = "top:" + vm.selectedShirt.printable_left_top + "px" + ";" + "left:" + vm.selectedShirt.printable_left_left + "px";
                $scope.temp_child = 'width:' + vm.selectedShirt.printable_left_width + "px" + ";" + 'height:' + vm.selectedShirt.printable_left_height + "px";

            }

            else if (vm.default_tab == 4) {

                $scope.temp_parent = "top:" + vm.selectedShirt.printable_right_top + "px" + ";" + "left:" + vm.selectedShirt.printable_right_left + "px";
                $scope.temp_child = 'width:' + vm.selectedShirt.printable_right_width + "px" + ";" + 'height:' + vm.selectedShirt.printable_right_height + "px";

            }

            //  return obj;
        }
        function googleFonts() {
            vm.fonts = DashboardService.GetGoogleFonts();
            // console.log(vm.fonts);
            angular.forEach(vm.fonts, function (font) {
                vm.fontsTag.push(font.category);
            })

            vm.uniqFontTags = _.uniq(vm.fontsTag);
        }
        function loadShirtStyle() {
            DashboardService.GetShirtStyle().then(function (result) {
                if (result && result.data) {
                    vm.shirts = result.data;
                    vm.shirts_in_styles = angular.copy(vm.shirts);
                    _.each(vm.shirts_in_styles, function (style) {
                        style.selected = false;
                        _.each(style.colors_available, function (color) {
                            color.selected = false;
                            _.each(vm.colors, function (_color) {
                                if (_color.id == color.color_id) {
                                    color.color = "#" + _color.hex;
                                }

                            });
                        });
                    });
                    //vm.selectedShirt = vm.shirts[0];
                    selectShirt(vm.shirts[0]);
                    $scope.get_style();
                    vm.filtered_colors = [];
                    setTimeout(function () {
                        for (var i = 0; i < vm.colors.length; i++) {
                            var color = vm.colors[i];
                            var id = vm.selectedShirt.colors_available.filter(function (_color) { return _color.color_id == color.id });
                            if (id) {
                                vm.filtered_colors.push("#" + color.hex);
                            }
                            vm.shirt_color = vm.filtered_colors[0];


                        }
                    }, 500);

                    // angular.forEach(vm.colors, function (color) {

                    //     var id = vm.selectedShirt.colors_available.filter(function (_color) { return _color.color_id == color.id });
                    //     if (id) {
                    //         vm.filtered_colors.push("#" + color.hex);
                    //     }
                    //     vm.shirt_color = vm.filtered_colors[0];
                    // });
                }

            })
        }

        function loadGraphics() {
            vm.search_graphics = '';
            DashboardService.GetGraphics().then(function (result) {
                if (result && result.data) {

                    vm.graphics = vm.graphics.concat(result.data);
                }

            })
        }

        function loadConfig() {
            DashboardService.GetConfig().then(function (data) {

                vm.config = data.data;

                vm.goal_range_max = Number(vm.config.config.goal_range_max);
                vm.goal_range_min = Number(vm.config.config.goal_range_min);

                vm.goal_target = Number(vm.goal_range_min);
                rotate_goal(vm.goal_range_min);


            });
        }


        function loadFonts() {
            DashboardService.GetFonts().then(function (result) {
                if (result && result.data) {
                    vm.fonts = result.data;
                    angular.forEach(result.data, function (font) {
                        if (font && font.tags) {
                            var tags = JSON.parse(font.tags);
                            for (var i = 0; i < tags.length; i++) {

                                vm.fontsTag.push(tags[i]);
                            }

                        }
                    })

                    vm.uniqFontTags = _.uniq(vm.fontsTag);

                }


            })
        }

        vm.fontChanged = function (val) {
            if (!val) {
                //loadFonts();
            }
        }




        vm.fontSelection = function (font, event) {
            //  $scope.$on('webfontLoader.loaded', function() {
            //    alert('font loaded!');
            // });


            //...................................//

            if (vm.default_tab === 1) {
                var selected = _.findWhere(vm.front_design, { 'selected': true });
                //console.log(selected);
                var e = $('#box' + selected.z_index + 'front');



                var txt = e.find('text');
                var size1 = txt[0].getBoundingClientRect();
                var size2 = e[0].getBoundingClientRect();
                var $w = parseInt(size1.width) * 1.3;
                var $h = parseInt(size1.height);


                updateSize($w, $h, selected.z_index, 1);

                var svg = e.find('svg'),
                    view = svg[0].getAttributeNS(null, 'viewBox');
                var arr = view.split(' ');
                var y = txt[0].getAttributeNS(null, 'y');
                y = Math.round(y) + Math.round(size2.top) - Math.round(size1.top) - ((Math.round(size2.top) - Math.round(size1.top)) * (($w - arr[2]) / $w));
                txt[0].setAttributeNS(null, 'y', y);
                selected.font = font.family;
                // console.log(selected.font);  
            }

            else if (vm.default_tab === 2) {
                var selected = _.findWhere(vm.back_design, { 'selected': true });
                //console.log(selected);
                var e = $('#box' + selected.z_index + 'back');



                var txt = e.find('text');
                var size1 = txt[0].getBoundingClientRect();
                var size2 = e[0].getBoundingClientRect();
                var $w = parseInt(size1.width) * 1.3;
                var $h = parseInt(size1.height);


                updateSize($w, $h, selected.z_index, 2);

                var svg = e.find('svg'),
                    view = svg[0].getAttributeNS(null, 'viewBox');
                var arr = view.split(' ');
                var y = txt[0].getAttributeNS(null, 'y');
                y = Math.round(y) + Math.round(size2.top) - Math.round(size1.top) - ((Math.round(size2.top) - Math.round(size1.top)) * (($w - arr[2]) / $w));
                txt[0].setAttributeNS(null, 'y', y);
                selected.font = font.family;
                // console.log(selected.font);  
            }

            else if (vm.default_tab === 3) {
                var selected = _.findWhere(vm.left_design, { 'selected': true });
                //console.log(selected);
                var e = $('#box' + selected.z_index + 'left');



                var txt = e.find('text');
                var size1 = txt[0].getBoundingClientRect();
                var size2 = e[0].getBoundingClientRect();
                var $w = parseInt(size1.width) * 1.3;
                var $h = parseInt(size1.height);


                updateSize($w, $h, selected.z_index, 3);

                var svg = e.find('svg'),
                    view = svg[0].getAttributeNS(null, 'viewBox');
                var arr = view.split(' ');
                var y = txt[0].getAttributeNS(null, 'y');
                y = Math.round(y) + Math.round(size2.top) - Math.round(size1.top) - ((Math.round(size2.top) - Math.round(size1.top)) * (($w - arr[2]) / $w));
                txt[0].setAttributeNS(null, 'y', y);
                selected.font = font.family;
                // console.log(selected.font);  
            }

            else if (vm.default_tab === 4) {
                var selected = _.findWhere(vm.right_design, { 'selected': true });
                //console.log(selected);
                var e = $('#box' + selected.z_index + 'right');



                var txt = e.find('text');
                var size1 = txt[0].getBoundingClientRect();
                var size2 = e[0].getBoundingClientRect();
                var $w = parseInt(size1.width) * 1.3;
                var $h = parseInt(size1.height);


                updateSize($w, $h, selected.z_index, 4);

                var svg = e.find('svg'),
                    view = svg[0].getAttributeNS(null, 'viewBox');
                var arr = view.split(' ');
                var y = txt[0].getAttributeNS(null, 'y');
                y = Math.round(y) + Math.round(size2.top) - Math.round(size1.top) - ((Math.round(size2.top) - Math.round(size1.top)) * (($w - arr[2]) / $w));
                txt[0].setAttributeNS(null, 'y', y);
                selected.font = font.family;
                // console.log(selected.font);  
            }

        }



        function addDays(number_of_days) {
            var d = new Date();
            var d2 = d.setDate(d.getDate() + number_of_days);
            return new Date(d2);
        }

        /*
            Junaid
         */
        function reset_style_shirts() {
            for (var i = 0; i < vm.shirts_in_styles.length; i++) {
                for (var j = 0; j < vm.shirts_in_styles[i].colors_available.length; j++) {
                    vm.shirts_in_styles[i].colors_available[j].selected = false;


                }
                vm.shirts_in_styles[i].selected - false;


            }
            vm.total_color_selected = 1;
        }
        /*
            Junaid
         */
        function selectShirt(shirt) {
            reset_style_shirts();
            vm.default_tab = 1;
            vm.selectedShirt = shirt;
            vm.filtered_colors = [];

            var reg = /(.*)\.[^.]+$/
            var front_thumb = reg.exec(shirt.image_front_url);
            var back_thumb = reg.exec(shirt.image_back_url);
            var left_thumb = reg.exec(shirt.image_left_url);
            var right_thumb = reg.exec(shirt.image_right_url);


            vm.selectedShirSide = {

                front: front_thumb[1] + "_small.png",
                back: back_thumb[1] + "_small.png",


            }

            if (shirt.id == 1) {
                vm.isSleeve = true;
                vm.selectedShirSide.left = left_thumb[1] + "_small.png";
                vm.selectedShirSide.right = right_thumb[1] + "_small.png";

            }

            else {
                vm.isSleeve = false;
            }
            // var selected_shirt = _.where(vm.shirts_in_styles, {id:shirt.id});
            //selected_shirt.selected = true;



            console.log(vm.selectedShirSide);
            angular.forEach(vm.colors, function (color, count) {
                //debugger;
                var id = vm.selectedShirt.colors_available.filter(function (_color) { return _color.color_id == color.id });
                if (id[0]) {
                    vm.filtered_colors.push("#" + color.hex);
                }

                vm.shirt_color = vm.filtered_colors[0];
                if (count == 0) {

                    _.each(vm.shirts_in_styles, function (shirt) {
                        if (shirt.id == vm.selectedShirt.id)
                            shirt.selected = true;
                        else shirt.selected = false;
                        setColor(
                            vm.filtered_colors[0]);
                    });

                }

            });

            $scope.get_style();

        }

        function updateSize($w, $h, index, side) {
            var currentSide = "";
            if (side === 1) {
                currentSide = "front";
            }
            else if (side === 2) {
                currentSide = "back";
            }
            else if (side === 3) {
                currentSide = "left";
            }
            else if (side === 4) {
                currentSide = "right";
            }
            var e = $('#box' + index + currentSide);
            svg = e.find('svg'),
                view = svg[0].getAttributeNS(null, 'viewBox'),
                width = svg[0].getAttributeNS(null, 'width'),
                height = svg[0].getAttributeNS(null, 'height');
            view = view.split(' ');
            svg[0].setAttributeNS(null, 'width', $w);
            svg[0].setAttributeNS(null, 'height', $h);
            svg[0].setAttributeNS(null, 'viewBox', '0 0 ' + (($w * view[2]) / width) + ' ' + (($h * view[3]) / height));
            $(e).css({ 'width': $w + 'px', 'height': $h + 'px' });
        }


        function selectGraphic(graphic, is_searched) {
            if (is_searched) {
                vm.graphics.push(graphic);
            }

            if (vm.default_tab === 1) {

                var z_index = 1;
                if (!vm.front_design.length) {
                    z_index = 1;
                }
                else {

                    z_index = vm.front_design[vm.front_design.length - 1].z_index + 1;
                }

                // DashboardService.GetSvg(vm.graphicsURL + graphic.filename).then(function(data){
                //    console.log(data.data);
                // })



                var obj = {

                    "type": "svg",
                    "src": vm.graphicsURL + graphic.filename,
                    "z_index": z_index,
                    "width": graphic.width + "px",
                    "height": graphic.height + "px",
                    "id": graphic.id

                }

                vm.front_design.push(obj);

                _.each(vm.front_design, function (front) {



                    if (front.z_index != z_index) {
                        $('#tools' + front.z_index + "front").css({ 'visibility': 'hidden' });
                        $('#box' + front.z_index + "front").removeClass('border');
                        front.selected = false;
                    }


                });



                setTimeout(function () {
                    var currentSvg = document.querySelectorAll('#box' + z_index + "front" + ' svg');


                    currentSvg[0].setAttributeNS(null, 'viewBox', '0 20 ' + graphic.width + ' ' + graphic.height);
                    $('#tools' + z_index + "front").css({ 'visibility': 'visible' });
                    $('#box' + z_index + "front").addClass('border');

                    vm.select_text(z_index);


                }, 500)



                vm.selectedGraphic = graphic;
                vm.designSelected = true;
            }
            else if (vm.default_tab === 2) {

                var z_index = 1;
                if (!vm.back_design.length) {
                    z_index = 1;
                }
                else {

                    z_index = vm.back_design[vm.back_design.length - 1].z_index + 1;
                }



                var obj = {

                    "type": "svg",
                    "src": vm.graphicsURL + graphic.filename,
                    "z_index": z_index,
                    "width": graphic.width + "px",
                    "height": graphic.height + "px",
                    "id": graphic.id

                }

                vm.back_design.push(obj);

                _.each(vm.back_design, function (back) {



                    if (back.z_index != z_index) {
                        $('#tools' + back.z_index + "back").css({ 'visibility': 'hidden' });
                        $('#box' + back.z_index + "back").removeClass('border');
                        back.selected = false;
                    }


                });



                setTimeout(function () {
                    var currentSvg = document.querySelectorAll('#box' + z_index + "back" + ' svg');

                    console.log(currentSvg[0]);
                    currentSvg[0].setAttributeNS(null, 'viewBox', '0 20 ' + graphic.width + ' ' + graphic.height);
                    $('#tools' + z_index + "back").css({ 'visibility': 'visible' });
                    $('#box' + z_index + "back").addClass('border');

                    vm.select_text(z_index);


                }, 500)



                vm.selectedGraphic = graphic;
                vm.designSelected = true;

            }
            else if (vm.default_tab === 3) {

                var z_index = 1;
                if (!vm.left_design.length) {
                    z_index = 1;
                }
                else {

                    z_index = vm.left_design[vm.left_design.length - 1].z_index + 1;
                }



                var obj = {

                    "type": "svg",
                    "src": vm.graphicsURL + graphic.filename,
                    "z_index": z_index,
                    "width": graphic.width + "px",
                    "height": graphic.height + "px",
                    "id": graphic.id

                }

                vm.left_design.push(obj);

                _.each(vm.left_design, function (back) {



                    if (back.z_index != z_index) {
                        $('#tools' + back.z_index + "left").css({ 'visibility': 'hidden' });
                        $('#box' + back.z_index + "left").removeClass('border');
                        back.selected = false;
                    }


                });



                setTimeout(function () {
                    var currentSvg = document.querySelectorAll('#box' + z_index + "left" + ' svg');

                    console.log(currentSvg[0]);
                    currentSvg[0].setAttributeNS(null, 'viewBox', '0 20 ' + graphic.width + ' ' + graphic.height);
                    $('#tools' + z_index + "left").css({ 'visibility': 'visible' });
                    $('#box' + z_index + "left").addClass('border');


                    vm.select_text(z_index);

                }, 500)



                vm.selectedGraphic = graphic;
                vm.designSelected = true;

            }
            else if (vm.default_tab === 4) {

                var z_index = 1;
                if (!vm.right_design.length) {
                    z_index = 1;
                }
                else {

                    z_index = vm.right_design[vm.right_design.length - 1].z_index + 1;
                }



                var obj = {

                    "type": "svg",
                    "src": vm.graphicsURL + graphic.filename,
                    "z_index": z_index,
                    "width": graphic.width + "px",
                    "height": graphic.height + "px",
                    "id": graphic.id

                }

                vm.right_design.push(obj);

                _.each(vm.right_design, function (right) {



                    if (right.z_index != z_index) {
                        $('#tools' + right.z_index + "right").css({ 'visibility': 'hidden' });
                        $('#box' + right.z_index + "right").removeClass('border');
                        right.selected = false;
                    }


                });



                setTimeout(function () {
                    var currentSvg = document.querySelectorAll('#box' + z_index + "right" + ' svg');

                    console.log(currentSvg[0]);
                    currentSvg[0].setAttributeNS(null, 'viewBox', '0 20 ' + graphic.width + ' ' + graphic.height);
                    $('#tools' + z_index + "right").css({ 'visibility': 'visible' });
                    $('#box' + z_index + "right").addClass('border');

                    vm.select_text(z_index);


                }, 500)



                vm.selectedGraphic = graphic;
                vm.designSelected = true;

            }

        }

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        function set_design_tab(arg) {
            vm.default_design_tab = arg;
        }

        function activate_tab(arg) {
            vm.default_tab = arg;
            if (arg === 2)
                vm.hide = true;

            if (arg === 2 || arg === 3 || arg === 4) {

                $('.user-list').css({ 'visibility': 'hidden' });
                $('.user-box').removeClass('border');

            }
        }
        function loadDefault() {

            //$state.transitionTo('home.create');

        }

        vm.deleteLayer = function (zindex) {
            
            if (vm.default_tab === 1) {
                vm.front_design = _.reject(vm.front_design, function (layer) { return layer.z_index === zindex; });
                calculate_front();

            }

            else if (vm.default_tab === 2) {
                vm.back_design = _.reject(vm.back_design, function (layer) { return layer.z_index === zindex; });
                calculate_back();
            }
            else if (vm.default_tab === 3) {
                vm.left_design = _.reject(vm.left_design, function (layer) { return layer.z_index === zindex; });
                calculate_left();
            }
            else if (vm.default_tab === 4) {
                vm.right_design = _.reject(vm.right_design, function (layer) { return layer.z_index === zindex; });
                calculate_right();
            }
        }

        function init_shirt_drawings() {

            vm.front_design = [
                // {
                //     "type": "text",
                //     "font": 'arial',
                //     "color": "rgb(255,0,0)",
                //     "text": "Abdul",
                //     "z_index": 1,
                //     "selected":false,
                //     "slider" : {
                //     "value": 0,
                //     "options": {
                //         "floor": -360,
                //         "ceil": 360,
                //         "step": 1,
                //       },
                //     }
                // },

                // {
                //     "type": "svg",
                //     "z_index": 4,
                //     "src": "",
                //     "selected":false,
                //     "slider" : {
                //     "value": 0,
                //     "options": {
                //         "floor": -360,
                //         "ceil": 360,
                //         "step": 1,
                //       },
                //     }
                // },
                // {
                //     "type": "img",
                //     "z_index": 5,
                //     "src": "http://demo.tshirtecommerce.com/media/assets/uploaded/2016/09/Smile_thumb.png",
                //     "selected": false,
                //     "slider": {
                //         "value": 0,
                //         "options": {
                //             "floor": -360,
                //             "ceil": 360,
                //             "step": 1,
                //         },
                //     }
                // }


            ];

            vm.back_design = [

                // {
                //     "type": "text",
                //     "font": 'arial',
                //     "color": "rgb(0,0,255)",
                //     "text": "This is back text 2",
                //     "z_index": 1
                // },

                // {
                //     "type": "svg",
                //     "z_index": 4,
                //     "src": ""
                // },
                // {
                //     "type": "img",
                //     "z_index": 5,
                //     "src": ""
                // }


            ];

            vm.left_design = [
                // {
                //     "type": "text",
                //     "font": 'arial',
                //     "color": "rgb(255,0,0)",
                //     "text": "This is left text 1",
                //     "z_index": 2
                // },
                // {
                //     "type": "text",
                //     "font": 'arial',
                //     "color": "rgb(0,0,255)",
                //     "text": "This is left text 2",
                //     "z_index": 1
                // },

                // {
                //     "type": "svg",
                //     "z_index": 4,
                //     "src": ""
                // },
                // {
                //     "type": "img",
                //     "z_index": 5,
                //     "src": ""
                // }


            ];

            vm.right_design = [
                // {
                //     "type": "text",
                //     "font": 'arial',
                //     "color": "rgb(255,0,0)",
                //     "text": "This is right text 1",
                //     "z_index": 2
                // },
                // {
                //     "type": "text",
                //     "font": 'arial',
                //     "color": "rgb(0,0,255)",
                //     "text": "This is right text 2",
                //     "z_index": 1
                // },

                // {
                //     "type": "svg",
                //     "z_index": 4,
                //     "src": ""
                // },
                // {
                //     "type": "img",
                //     "z_index": 5,
                //     "src": ""
                // }
                // {
                //     "type": "img",
                //     "z_index": 5,
                //     "src": "http://demo.tshirtecommerce.com/media/assets/uploaded/2016/09/Smile_thumb.png",
                //     "selected": false,
                //     "slider": {
                //         "value": 0,
                //         "options": {
                //             "floor": -360,
                //             "ceil": 360,
                //             "step": 1,
                //         },
                //     }
                // }

            ];


        }

        vm.select_text = function (index, e) {



            if (vm.default_tab == 1) {

                _index = _.findIndex(vm.front_design,function(x){return x.z_index == index});
                vm.selected_text = vm.front_design[_index];



                vm.default_design_tab = vm.selected_text.type === 'svg' ? 2 : 3;


                var tspan = document.querySelector('#box' + vm.selected_text.z_index + "front" + ' tspan')

                // vm.Bbox = tspan.getBBox();
                // vm.Bbox.height += 30;
                // vm.Bbox.width += 50;
                // var rotationInfo = $('#box'+vm.selected_text.z_index).rotationInfo();
                // console.log(rotationInfo.deg);
                // var updateVisibility = "-webkit-user-select: none; visibility: visible; transform: rotateZ(0deg);";
                // angular.element('#box'+vm.selected_text.z_index)[0].attributes[6].nodeValue = updateVisibility;

                var params = {
                    // Callback fired on rotation start.
                    start: function (event, ui) {

                        //    $('.border').rotationInfo(vm.selected_text.slider.value);
                        //    console.log($('.border').rotationInfo().deg,vm.selected_text.slider.value);

                        // $('.border').css({
                        //     '-webkit-transform' : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-moz-transform'    : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-ms-transform'     : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-o-transform'      : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     'transform'         : 'rotate(' + vm.selected_text.slider.value + 'deg)'
                        // });

                    },
                    // Callback fired during rotation.
                    rotate: function (event, ui) {

                        //  var updateDegree = ui.angle.current * (180/Math.PI);
                        //  vm.selected_text.slider.value = updateDegree;
                        //  $scope.$apply();
                        // console.log("Rotating",updateDegree);
                        // console.log("Rotatating",updateDegree);
                        // var $scope = angular.element('#box').scope();
                        // $scope.slider.value = updateDegree;
                        // $scope.$apply();

                    },
                    // Callback fired on rotation end.
                    stop: function (event, ui) {

                    },

                    // Set the rotation center at (25%, 75%).
                    // rotationCenterX: 25.0, 
                    // rotationCenterY: 75.0
                };

                var oldwidth = 0, oldsize = 0;

                _.each(vm.front_design, function (front) {


                    if (front.z_index == vm.selected_text.z_index) {
                        $('#tools' + vm.selected_text.z_index + "front").css({ 'visibility': 'visible' });
                        $('#box' + vm.selected_text.z_index + "front").addClass('border');
                        $('#box' + vm.selected_text.z_index + "front").resizable({
                            handles: { 'nw': $('#resize' + vm.selected_text.z_index + "front") }, aspectRatio: true, minHeight: 15, minWidth: 15,

                            start: function (event, ui) {
                                oldwidth = ui.size.width;
                            },
                            resize: function (event, ui) {
                                $('.printable-area').css({ 'overflow': 'hidden' });
                                var e = ui.element;
                                var o = e.parent().parent();
                                var left = o.css('left');
                                left = parseInt(left.replace('px', ''));

                                var top = o.css('top');
                                top = parseInt(top.replace('px', ''));
                                var width = o.css('width');
                                width = parseInt(width.replace('px', ''));

                                var height = o.css('height');
                                height = parseInt(height.replace('px', ''));

                                var $left = parseInt(ui.position.left),
                                    $top = parseInt(ui.position.top),
                                    $width = parseInt(ui.size.width),
                                    $height = parseInt(ui.size.height);
                                if (($left + $width) > width || ($top + $height) > height) {
                                    //e.data('block', true);
                                    //  e.css('border', '1px solid #FF0000');
                                    if (parseInt(left + $left + $width) > 490 || parseInt(top + $top + $height) > 490) {
                                        //$jd(this).resizable('widget').trigger('mouseup');
                                    }
                                } else {
                                    // e.data('block', false);
                                    // e.css('border', '1px dashed #444444');
                                }
                                var svg = e.find('svg');

                                svg[0].setAttributeNS(null, 'width', $width);
                                svg[0].setAttributeNS(null, 'height', $height);
                                svg[0].setAttributeNS(null, 'preserveAspectRatio', 'none');




                                var svg = e.find('svg');



                                // if(e.data('type') == 'clipart')
                                // {
                                //     var file = e.data('file');
                                //     if(file.type == 'image')
                                //     {	
                                //         var img = e.find('image');
                                //         img[0].setAttributeNS(null, 'width', $width);
                                //         img[0].setAttributeNS(null, 'height', $height);
                                //     }
                                // }

                                // if(e.data('type') == 'text')
                                // {						
                                //     //var text = e.find('text');
                                //     //text[0].setAttributeNS(null, 'y', 20);						
                                // }

                                jQuery('#' + e.data('type') + '-width').val(parseInt($width));
                                jQuery('#' + e.data('type') + '-height').val(parseInt($height));
                            },
                            stop: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'visible' });
                            }
                        })
                            .rotatable(params, { handle: $('#box' + vm.selected_text.z_index + "front" + ' .icon-rotate-free') });
                        $('#box' + vm.selected_text.z_index + "front" + ' .rotate a').append($('#box' + vm.selected_text.z_index + "front" + ' .icon-rotate-free'));
                        $('#box' + vm.selected_text.z_index + "front").draggable({
                            cancel: '.delete,.drag',
                            drag: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'hidden' });
                                y2 = ui.position.top;
                                x2 = ui.position.left;
                                var printableWidth = $('.printable-area').width() + 20;
                                console.log(printableWidth, x2);
                                if (x2 > printableWidth) {
                                    // alert("Crossing Boundries");
                                    //$('.printable-holder').addClass('crossing_border');
                                }
                                // else if(x2 > -printableWidth){
                                //     console.log("Yeeeedddd");

                                // }
                                // else{

                                //     $('.printable-holder').removeClass('crossing_border');

                                // }
                                //     if(x2<-100){alert("Lesser than -100px");
                                // }

                            },
                            stop: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'visible' });
                            }
                        });

                        // vm.selected_tex.slider.value = rotationInfo.deg;
                        front.selected = true;
                    }
                    else {
                        $('#tools' + front.z_index + "front").css({ 'visibility': 'hidden' });
                        $('#box' + front.z_index + "front").removeClass('border');
                        front.selected = false;
                    }
                })





                // console.log(angular.element('#box'+vm.selected_text.z_index));
                $scope.focus = true;


            }

            else if (vm.default_tab === 2) {
               // _index = vm.back_design.findIndex(x => x.z_index == index);
                _index = _.findIndex(vm.back_design,function(x){return x.z_index == index});
                vm.selected_text = vm.back_design[_index];


                vm.default_design_tab = vm.selected_text.type === 'svg' ? 2 : 3;


                var tspan = document.querySelector('#box' + vm.selected_text.z_index + "back" + ' tspan')

                // vm.Bbox = tspan.getBBox();
                // vm.Bbox.height += 30;
                // vm.Bbox.width += 50;
                // var rotationInfo = $('#box'+vm.selected_text.z_index).rotationInfo();
                // console.log(rotationInfo.deg);
                // var updateVisibility = "-webkit-user-select: none; visibility: visible; transform: rotateZ(0deg);";
                // angular.element('#box'+vm.selected_text.z_index)[0].attributes[6].nodeValue = updateVisibility;

                var params = {
                    // Callback fired on rotation start.
                    start: function (event, ui) {

                        //    $('.border').rotationInfo(vm.selected_text.slider.value);
                        //    console.log($('.border').rotationInfo().deg,vm.selected_text.slider.value);

                        // $('.border').css({
                        //     '-webkit-transform' : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-moz-transform'    : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-ms-transform'     : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-o-transform'      : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     'transform'         : 'rotate(' + vm.selected_text.slider.value + 'deg)'
                        // });

                    },
                    // Callback fired during rotation.
                    rotate: function (event, ui) {

                        //  var updateDegree = ui.angle.current * (180/Math.PI);
                        //  vm.selected_text.slider.value = updateDegree;
                        //  $scope.$apply();
                        // console.log("Rotating",updateDegree);
                        // console.log("Rotatating",updateDegree);
                        // var $scope = angular.element('#box').scope();
                        // $scope.slider.value = updateDegree;
                        // $scope.$apply();

                    },
                    // Callback fired on rotation end.
                    stop: function (event, ui) {

                    },

                    // Set the rotation center at (25%, 75%).
                    // rotationCenterX: 25.0, 
                    // rotationCenterY: 75.0
                };

                var oldwidth = 0, oldsize = 0;

                _.each(vm.back_design, function (front) {


                    if (front.z_index == vm.selected_text.z_index) {
                        $('#tools' + vm.selected_text.z_index + "back").css({ 'visibility': 'visible' });
                        $('#box' + vm.selected_text.z_index + "back").addClass('border');
                        $('#box' + vm.selected_text.z_index + "back").resizable({
                            handles: { 'nw': $('#resize' + vm.selected_text.z_index + "back") }, aspectRatio: true, minHeight: 15, minWidth: 15,

                            start: function (event, ui) {
                                oldwidth = ui.size.width;
                            },
                            resize: function (event, ui) {
                                $('.printable-area').css({ 'overflow': 'hidden' });
                                var e = ui.element;
                                var o = e.parent().parent();
                                var left = o.css('left');
                                left = parseInt(left.replace('px', ''));

                                var top = o.css('top');
                                top = parseInt(top.replace('px', ''));
                                var width = o.css('width');
                                width = parseInt(width.replace('px', ''));

                                var height = o.css('height');
                                height = parseInt(height.replace('px', ''));

                                var $left = parseInt(ui.position.left),
                                    $top = parseInt(ui.position.top),
                                    $width = parseInt(ui.size.width),
                                    $height = parseInt(ui.size.height);
                                if (($left + $width) > width || ($top + $height) > height) {
                                    //e.data('block', true);
                                    //  e.css('border', '1px solid #FF0000');
                                    if (parseInt(left + $left + $width) > 490 || parseInt(top + $top + $height) > 490) {
                                        //$jd(this).resizable('widget').trigger('mouseup');
                                    }
                                } else {
                                    // e.data('block', false);
                                    // e.css('border', '1px dashed #444444');
                                }

                                console.log(e);
                                var svg = e.find('svg');

                                console.log(svg);

                                svg[0].setAttributeNS(null, 'width', $width);
                                svg[0].setAttributeNS(null, 'height', $height);
                                svg[0].setAttributeNS(null, 'preserveAspectRatio', 'none');

                                // if(e.data('type') == 'clipart')
                                // {
                                //     var file = e.data('file');
                                //     if(file.type == 'image')
                                //     {	
                                //         var img = e.find('image');
                                //         img[0].setAttributeNS(null, 'width', $width);
                                //         img[0].setAttributeNS(null, 'height', $height);
                                //     }
                                // }

                                // if(e.data('type') == 'text')
                                // {						
                                //     //var text = e.find('text');
                                //     //text[0].setAttributeNS(null, 'y', 20);						
                                // }

                                jQuery('#' + e.data('type') + '-width').val(parseInt($width));
                                jQuery('#' + e.data('type') + '-height').val(parseInt($height));
                            },
                            stop: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'visible' });
                            }
                        })
                            .rotatable(params, { handle: $('#box' + vm.selected_text.z_index + "back" + ' .icon-rotate-free') });
                        $('#box' + vm.selected_text.z_index + "back" + ' .rotate a').append($('#box' + vm.selected_text.z_index + "back" + ' .icon-rotate-free'));
                        $('#box' + vm.selected_text.z_index + "back").draggable({
                            cancel: '.delete,.drag',
                            drag: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'hidden' });
                                y2 = ui.position.top;
                                x2 = ui.position.left;
                                var printableWidth = $('.printable-area').width() + 20;
                                if (x2 > printableWidth) {
                                    // alert("Crossing Boundries");
                                    console.log(printableWidth, x2);
                                }
                                //     if(x2<-100){alert("Lesser than -100px");
                                // }

                            },
                            stop: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'visible' });
                            }
                        });

                        // vm.selected_tex.slider.value = rotationInfo.deg;
                        front.selected = true;
                    }
                    else {
                        $('#tools' + front.z_index + "back").css({ 'visibility': 'hidden' });
                        $('#box' + front.z_index + "back").removeClass('border');
                        front.selected = false;
                    }
                })





                // console.log(angular.element('#box'+vm.selected_text.z_index));
                $scope.focus = true;


            }

            else if (vm.default_tab === 3) {
                // _index = vm.left_design.findIndex(x => x.z_index == index);
                 _index = _.findIndex(vm.left_design,function(x){return x.z_index == index});
                
                vm.selected_text = vm.left_design[_index];


                vm.default_design_tab = vm.selected_text.type === 'svg' ? 2 : 3;


                var tspan = document.querySelector('#box' + vm.selected_text.z_index + "left" + ' tspan')

                // vm.Bbox = tspan.getBBox();
                // vm.Bbox.height += 30;
                // vm.Bbox.width += 50;
                // var rotationInfo = $('#box'+vm.selected_text.z_index).rotationInfo();
                // console.log(rotationInfo.deg);
                // var updateVisibility = "-webkit-user-select: none; visibility: visible; transform: rotateZ(0deg);";
                // angular.element('#box'+vm.selected_text.z_index)[0].attributes[6].nodeValue = updateVisibility;

                var params = {
                    // Callback fired on rotation start.
                    start: function (event, ui) {

                        //    $('.border').rotationInfo(vm.selected_text.slider.value);
                        //    console.log($('.border').rotationInfo().deg,vm.selected_text.slider.value);

                        // $('.border').css({
                        //     '-webkit-transform' : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-moz-transform'    : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-ms-transform'     : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-o-transform'      : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     'transform'         : 'rotate(' + vm.selected_text.slider.value + 'deg)'
                        // });

                    },
                    // Callback fired during rotation.
                    rotate: function (event, ui) {

                        //  var updateDegree = ui.angle.current * (180/Math.PI);
                        //  vm.selected_text.slider.value = updateDegree;
                        //  $scope.$apply();
                        // console.log("Rotating",updateDegree);
                        // console.log("Rotatating",updateDegree);
                        // var $scope = angular.element('#box').scope();
                        // $scope.slider.value = updateDegree;
                        // $scope.$apply();

                    },
                    // Callback fired on rotation end.
                    stop: function (event, ui) {

                    },

                    // Set the rotation center at (25%, 75%).
                    // rotationCenterX: 25.0, 
                    // rotationCenterY: 75.0
                };

                var oldwidth = 0, oldsize = 0;

                _.each(vm.left_design, function (front) {


                    if (front.z_index == vm.selected_text.z_index) {
                        $('#tools' + vm.selected_text.z_index + "left").css({ 'visibility': 'visible' });
                        $('#box' + vm.selected_text.z_index + "left").addClass('border');
                        $('#box' + vm.selected_text.z_index + "left").resizable({
                            handles: { 'nw': $('#resize' + vm.selected_text.z_index + "left") }, aspectRatio: true, minHeight: 15, minWidth: 15,

                            start: function (event, ui) {
                                oldwidth = ui.size.width;
                            },
                            resize: function (event, ui) {
                                $('.printable-area').css({ 'overflow': 'hidden' });
                                var e = ui.element;
                                var o = e.parent().parent();
                                var left = o.css('left');
                                left = parseInt(left.replace('px', ''));

                                var top = o.css('top');
                                top = parseInt(top.replace('px', ''));
                                var width = o.css('width');
                                width = parseInt(width.replace('px', ''));

                                var height = o.css('height');
                                height = parseInt(height.replace('px', ''));

                                var $left = parseInt(ui.position.left),
                                    $top = parseInt(ui.position.top),
                                    $width = parseInt(ui.size.width),
                                    $height = parseInt(ui.size.height);
                                if (($left + $width) > width || ($top + $height) > height) {
                                    //e.data('block', true);
                                    //  e.css('border', '1px solid #FF0000');
                                    if (parseInt(left + $left + $width) > 490 || parseInt(top + $top + $height) > 490) {
                                        //$jd(this).resizable('widget').trigger('mouseup');
                                    }
                                } else {
                                    // e.data('block', false);
                                    // e.css('border', '1px dashed #444444');
                                }
                                var svg = e.find('svg');

                                svg[0].setAttributeNS(null, 'width', $width);
                                svg[0].setAttributeNS(null, 'height', $height);
                                svg[0].setAttributeNS(null, 'preserveAspectRatio', 'none');

                                // if(e.data('type') == 'clipart')
                                // {
                                //     var file = e.data('file');
                                //     if(file.type == 'image')
                                //     {	
                                //         var img = e.find('image');
                                //         img[0].setAttributeNS(null, 'width', $width);
                                //         img[0].setAttributeNS(null, 'height', $height);
                                //     }
                                // }

                                // if(e.data('type') == 'text')
                                // {						
                                //     //var text = e.find('text');
                                //     //text[0].setAttributeNS(null, 'y', 20);						
                                // }

                                jQuery('#' + e.data('type') + '-width').val(parseInt($width));
                                jQuery('#' + e.data('type') + '-height').val(parseInt($height));
                            },
                            stop: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'visible' });
                            }
                        })
                            .rotatable(params, { handle: $('#box' + vm.selected_text.z_index + "left" + ' .icon-rotate-free') });
                        $('#box' + vm.selected_text.z_index + "left" + ' .rotate a').append($('#box' + vm.selected_text.z_index + "left" + ' .icon-rotate-free'));
                        $('#box' + vm.selected_text.z_index + "left").draggable({
                            cancel: '.delete,.drag',
                            drag: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'hidden' });
                                y2 = ui.position.top;
                                x2 = ui.position.left;
                                var printableWidth = $('.printable-area').width() + 20;
                                if (x2 > printableWidth) {
                                    //alert("Crossing Boundries");
                                    console.log(printableWidth, x2);
                                }
                                //     if(x2<-100){alert("Lesser than -100px");
                                // }

                            },
                            stop: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'visible' });
                            }
                        });

                        // vm.selected_tex.slider.value = rotationInfo.deg;
                        front.selected = true;
                    }
                    else {
                        $('#tools' + front.z_index + "left").css({ 'visibility': 'hidden' });
                        $('#box' + front.z_index + "left").removeClass('border');
                        front.selected = false;
                    }
                })





                // console.log(angular.element('#box'+vm.selected_text.z_index));
                $scope.focus = true;


            }

            else if (vm.default_tab === 4) {
                // _index = vm.right_design.findIndex(x => x.z_index == index);
                 _index = _.findIndex(vm.right_design,function(x){return x.z_index == index});
                vm.selected_text = vm.right_design[_index];


                vm.default_design_tab = vm.selected_text.type === 'svg' ? 2 : 3;


                var tspan = document.querySelector('#box' + vm.selected_text.z_index + "right" + ' tspan')

                // vm.Bbox = tspan.getBBox();
                // vm.Bbox.height += 30;
                // vm.Bbox.width += 50;
                // var rotationInfo = $('#box'+vm.selected_text.z_index).rotationInfo();
                // console.log(rotationInfo.deg);
                // var updateVisibility = "-webkit-user-select: none; visibility: visible; transform: rotateZ(0deg);";
                // angular.element('#box'+vm.selected_text.z_index)[0].attributes[6].nodeValue = updateVisibility;

                var params = {
                    // Callback fired on rotation start.
                    start: function (event, ui) {

                        //    $('.border').rotationInfo(vm.selected_text.slider.value);
                        //    console.log($('.border').rotationInfo().deg,vm.selected_text.slider.value);

                        // $('.border').css({
                        //     '-webkit-transform' : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-moz-transform'    : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-ms-transform'     : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     '-o-transform'      : 'rotate(' + vm.selected_text.slider.value + 'deg)',
                        //     'transform'         : 'rotate(' + vm.selected_text.slider.value + 'deg)'
                        // });

                    },
                    // Callback fired during rotation.
                    rotate: function (event, ui) {

                        //  var updateDegree = ui.angle.current * (180/Math.PI);
                        //  vm.selected_text.slider.value = updateDegree;
                        //  $scope.$apply();
                        // console.log("Rotating",updateDegree);
                        // console.log("Rotatating",updateDegree);
                        // var $scope = angular.element('#box').scope();
                        // $scope.slider.value = updateDegree;
                        // $scope.$apply();

                    },
                    // Callback fired on rotation end.
                    stop: function (event, ui) {

                    },

                    // Set the rotation center at (25%, 75%).
                    // rotationCenterX: 25.0, 
                    // rotationCenterY: 75.0
                };

                var oldwidth = 0, oldsize = 0;

                _.each(vm.right_design, function (front) {


                    if (front.z_index == vm.selected_text.z_index) {
                        $('#tools' + vm.selected_text.z_index + "right").css({ 'visibility': 'visible' });
                        $('#box' + vm.selected_text.z_index + "right").addClass('border');
                        $('#box' + vm.selected_text.z_index + "right").resizable({
                            handles: { 'nw': $('#resize' + vm.selected_text.z_index + "right") }, aspectRatio: true, minHeight: 15, minWidth: 15,

                            start: function (event, ui) {
                                oldwidth = ui.size.width;
                            },
                            resize: function (event, ui) {
                                $('.printable-area').css({ 'overflow': 'hidden' });
                                var e = ui.element;
                                var o = e.parent().parent();
                                var left = o.css('left');
                                left = parseInt(left.replace('px', ''));

                                var top = o.css('top');
                                top = parseInt(top.replace('px', ''));
                                var width = o.css('width');
                                width = parseInt(width.replace('px', ''));

                                var height = o.css('height');
                                height = parseInt(height.replace('px', ''));

                                var $left = parseInt(ui.position.left),
                                    $top = parseInt(ui.position.top),
                                    $width = parseInt(ui.size.width),
                                    $height = parseInt(ui.size.height);
                                if (($left + $width) > width || ($top + $height) > height) {
                                    //e.data('block', true);
                                    //  e.css('border', '1px solid #FF0000');
                                    if (parseInt(left + $left + $width) > 490 || parseInt(top + $top + $height) > 490) {
                                        //$jd(this).resizable('widget').trigger('mouseup');
                                    }
                                } else {
                                    // e.data('block', false);
                                    // e.css('border', '1px dashed #444444');
                                }
                                var svg = e.find('svg');

                                svg[0].setAttributeNS(null, 'width', $width);
                                svg[0].setAttributeNS(null, 'height', $height);
                                svg[0].setAttributeNS(null, 'preserveAspectRatio', 'none');

                                // if(e.data('type') == 'clipart')
                                // {
                                //     var file = e.data('file');
                                //     if(file.type == 'image')
                                //     {	
                                //         var img = e.find('image');
                                //         img[0].setAttributeNS(null, 'width', $width);
                                //         img[0].setAttributeNS(null, 'height', $height);
                                //     }
                                // }

                                // if(e.data('type') == 'text')
                                // {						
                                //     //var text = e.find('text');
                                //     //text[0].setAttributeNS(null, 'y', 20);						
                                // }

                                jQuery('#' + e.data('type') + '-width').val(parseInt($width));
                                jQuery('#' + e.data('type') + '-height').val(parseInt($height));
                            },
                            stop: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'visible' });
                            }
                        })
                            .rotatable(params, { handle: $('#box' + vm.selected_text.z_index + "right" + ' .icon-rotate-free') });
                        $('#box' + vm.selected_text.z_index + "right" + ' .rotate a').append($('#box' + vm.selected_text.z_index + "right" + ' .icon-rotate-free'));
                        $('#box' + vm.selected_text.z_index + "right").draggable({
                            cancel: '.delete,.drag',
                            drag: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'hidden' });
                                y2 = ui.position.top;
                                x2 = ui.position.left;
                                var printableWidth = $('.printable-area').width() + 20;
                                if (x2 > printableWidth) {
                                    console.log(printableWidth, x2);
                                }
                                //     if(x2<-100){alert("Lesser than -100px");
                                // }

                            },
                            stop: function (e, ui) {
                                $('.printable-area').css({ 'overflow': 'visible' });
                            }
                        });

                        // vm.selected_tex.slider.value = rotationInfo.deg;
                        front.selected = true;
                    }
                    else {
                        $('#tools' + front.z_index + "right").css({ 'visibility': 'hidden' });
                        $('#box' + front.z_index + "right").removeClass('border');
                        front.selected = false;
                    }
                })





                // console.log(angular.element('#box'+vm.selected_text.z_index));
                $scope.focus = true;


            }

            // if (vm.default_tab == 2) {

            //     // _index = vm.back_design.findIndex(x => x.z_index == index);

            //     // vm.default_design_tab = 3;
            //     // vm.selected_text = vm.back_design[_index];
            //     // $scope.focus = true;


            //     _index = vm.back_design.findIndex(x => x.z_index == index);
            //     vm.selected_text = vm.back_design[_index];


            //     vm.default_design_tab = vm.selected_text.type==='svg'?2:3;


            //     var tspan = document.querySelector('#box'+vm.selected_text.z_index+"back"+' tspan')

            //     // vm.Bbox = tspan.getBBox();
            //     // vm.Bbox.height += 30;
            //     // vm.Bbox.width += 50;
            //     // var rotationInfo = $('#box'+vm.selected_text.z_index).rotationInfo();
            //     // console.log(rotationInfo.deg);
            //     // var updateVisibility = "-webkit-user-select: none; visibility: visible; transform: rotateZ(0deg);";
            //     // angular.element('#box'+vm.selected_text.z_index)[0].attributes[6].nodeValue = updateVisibility;

            //       var params = {
            //         // Callback fired on rotation start.
            //         start: function(event, ui) {

            //         //    $('.border').rotationInfo(vm.selected_text.slider.value);
            //         //    console.log($('.border').rotationInfo().deg,vm.selected_text.slider.value);

            //             // $('.border').css({
            //             //     '-webkit-transform' : 'rotate(' + vm.selected_text.slider.value + 'deg)',
            //             //     '-moz-transform'    : 'rotate(' + vm.selected_text.slider.value + 'deg)',
            //             //     '-ms-transform'     : 'rotate(' + vm.selected_text.slider.value + 'deg)',
            //             //     '-o-transform'      : 'rotate(' + vm.selected_text.slider.value + 'deg)',
            //             //     'transform'         : 'rotate(' + vm.selected_text.slider.value + 'deg)'
            //             // });

            //           },
            //         // Callback fired during rotation.
            //         rotate: function(event, ui) {

            //             //  var updateDegree = ui.angle.current * (180/Math.PI);
            //             //  vm.selected_text.slider.value = updateDegree;
            //             //  $scope.$apply();
            //             // console.log("Rotating",updateDegree);
            //             // console.log("Rotatating",updateDegree);
            //             // var $scope = angular.element('#box').scope();
            //             // $scope.slider.value = updateDegree;
            //             // $scope.$apply();

            //         },
            //         // Callback fired on rotation end.
            //         stop: function(event, ui) {

            //         },

            //         // Set the rotation center at (25%, 75%).
            //         // rotationCenterX: 25.0, 
            //         // rotationCenterY: 75.0
            //     };

            //     var oldwidth = 0, oldsize=0;

            //     _.each(vm.front_design,function(front){


            //         if(front.z_index == vm.selected_text.z_index){
            //             $('#tools'+vm.selected_text.z_index+"back").css({'visibility':'visible'});
            //             $('#box'+vm.selected_text.z_index+"back").addClass('border');
            //             $('#box'+vm.selected_text.z_index+"back").resizable({handles:{'nw':$('#resize'+vm.selected_text.z_index+"back")}, aspectRatio: true, minHeight: 15, minWidth: 15,

            //                                                            start: function( event, ui ){
            //                                                                     oldwidth = ui.size.width; 
            //                                                                    }, 
            //                                                           resize: function(event,ui){
            //                                                               $('.printable-area').css({'overflow':'hidden'});
            //                                                                     var e = ui.element;
            //                                                                     var o = e.parent().parent();
            //                                                                     var	left = o.css('left');
            //                                                                         left = parseInt(left.replace('px', ''));

            //                                                                     var	top = o.css('top');
            //                                                                         top = parseInt(top.replace('px', ''));
            //                                                                     var	width = o.css('width');
            //                                                                         width = parseInt(width.replace('px', ''));

            //                                                                     var	height = o.css('height');
            //                                                                         height = parseInt(height.replace('px', ''));

            //                                                                     var $left = parseInt(ui.position.left),
            //                                                                         $top = parseInt(ui.position.top),
            //                                                                         $width = parseInt(ui.size.width),
            //                                                                         $height = parseInt(ui.size.height);
            //                                                                     if(($left + $width) > width || ($top + $height)>height){
            //                                                                         //e.data('block', true);
            //                                                                       //  e.css('border', '1px solid #FF0000');
            //                                                                         if(parseInt(left + $left + $width) > 490 || parseInt(top + $top + $height) > 490){
            //                                                                             //$jd(this).resizable('widget').trigger('mouseup');
            //                                                                         }
            //                                                                     }else{
            //                                                                        // e.data('block', false);
            //                                                                        // e.css('border', '1px dashed #444444');
            //                                                                     }
            //                                                                     var svg = e.find('svg');									

            //                                                                     svg[0].setAttributeNS(null, 'width', $width);
            //                                                                     svg[0].setAttributeNS(null, 'height', $height);		
            //                                                                     svg[0].setAttributeNS(null, 'preserveAspectRatio', 'none');					

            //                                                                     // if(e.data('type') == 'clipart')
            //                                                                     // {
            //                                                                     //     var file = e.data('file');
            //                                                                     //     if(file.type == 'image')
            //                                                                     //     {	
            //                                                                     //         var img = e.find('image');
            //                                                                     //         img[0].setAttributeNS(null, 'width', $width);
            //                                                                     //         img[0].setAttributeNS(null, 'height', $height);
            //                                                                     //     }
            //                                                                     // }

            //                                                                     // if(e.data('type') == 'text')
            //                                                                     // {						
            //                                                                     //     //var text = e.find('text');
            //                                                                     //     //text[0].setAttributeNS(null, 'y', 20);						
            //                                                                     // }

            //                                                                     jQuery('#'+e.data('type')+'-width').val(parseInt($width));
            //                                                                     jQuery('#'+e.data('type')+'-height').val(parseInt($height));
            //                                                                 }, 
            //                                                                 stop:function(e,ui){
            //                                                                     $('.printable-area').css({'overflow':'visible'});
            //                                                                 }    
            //                                                          })
            //                                               .rotatable(params,{handle: $('#box'+vm.selected_text.z_index+"back"+' .icon-rotate-free')});
            //                                             $('#box'+vm.selected_text.z_index+"back"+' .rotate a').append($('#box'+vm.selected_text.z_index+"back"+' .icon-rotate-free'));
            //                                             $('#box'+vm.selected_text.z_index+"back").draggable({ cancel: '.delete,.drag',
            //                                                             drag: function (e, ui){
            //                                                                    $('.printable-area').css({'overflow':'hidden'});
            //                                                                     y2 = ui.position.top;
            //                                                                     x2 = ui.position.left;
            //                                                                     var printableWidth = $('.printable-area').width()+20;
            //                                                                     if(x2>printableWidth){
            //                                                                         alert("Crossing Boundries");
            //                                                                         console.log(printableWidth,x2);
            //                                                                     }
            //                                                                         //     if(x2<-100){alert("Lesser than -100px");
            //                                                                         // }

            //                                                               },
            //                                                               stop:function(e,ui){
            //                                                                   $('.printable-area').css({'overflow':'visible'});
            //                                                               }
            //                                                         });

            //            // vm.selected_tex.slider.value = rotationInfo.deg;
            //             front.selected = true;
            //         }
            //         else {
            //               $('#tools'+front.z_index+"back").css({'visibility':'hidden'});
            //               $('#box'+front.z_index+"back").removeClass('border');
            //                front.selected = false;
            //             }
            //     })





            //    // console.log(angular.element('#box'+vm.selected_text.z_index));
            //     $scope.focus = true;

            // }

            // if (vm.default_tab == 3) {

            //     _index = vm.left_design.findIndex(x => x.z_index == index);

            //     vm.default_design_tab = 3;
            //     vm.selected_text = vm.left_design[_index];
            //     $scope.focus = true;


            // }
            // if (vm.default_tab == 4) {

            //     _index = vm.right_design.findIndex(x => x.z_index == index);

            //     vm.default_design_tab = 3;
            //     vm.selected_text = vm.right_design[_index];
            //     $scope.focus = true;


            // }

        }


        vm.deselect_text = function () {
            vm.selected_text = {};
            $scope.focus = false;
        }

        /*        
        vm.updateText = function () {

            if (vm.default_tab == 1) {

                if (!(vm.selected_text.z_index)) {

                    var z_index = vm.front_design[vm.front_design.length - 1].z_index + 1;
                    vm.front_design.push({

                        "type": "text",
                        "font": 'arial',
                        "color": "rgb(255,0,0)",
                        "text": vm.selected_text.text,
                        "z_index": z_index

                    });

                    vm.selected_text = vm.front_design[vm.front_design.length - 1];
                    $scope.focus = true;

                    _.each(vm.front_design, function (front) {

                        console.log(front.z_index == vm.selected_text.z_index);
                        if (front.z_index == vm.selected_text.z_index) {
                            $('#tools' + vm.selected_text.z_index).css({ 'visibility': 'visible' });
                            $('#box' + vm.selected_text.z_index).addClass('border');
                        }
                        else {
                            $('#tools' + front.z_index).css({ 'visibility': 'hidden' });
                            $('#box' + front.z_index).removeClass('border');
                        }
                    })

                }


            }

            if (vm.default_tab == 2) {

                if (!(vm.selected_text.z_index)) {

                    var z_index = vm.back_design[vm.back_design.length - 1];
                    vm.back_design.push({

                        "type": "text",
                        "font": 'arial',
                        "color": "rgb(255,0,0)",
                        "text": vm.selected_text.text,
                        "z_index": z_index

                    });

                    vm.selected_text = vm.back_design[vm.back_design.length - 1];
                    $scope.focus = true;

                }


            }

            if (vm.default_tab == 3) {

                if (!(vm.selected_text.z_index)) {

                    var z_index = vm.left_design[vm.left_design.length - 1];
                    vm.left_design.push({

                        "type": "text",
                        "font": 'arial',
                        "color": "rgb(255,0,0)",
                        "text": vm.selected_text.text,
                        "z_index": z_index

                    });

                    vm.selected_text = vm.left_design[vm.left_design.length - 1];
                    $scope.focus = true;

                }


            }
            if (vm.default_tab == 4) {

                if (!(vm.selected_text.z_index)) {

                    var z_index = vm.right_design[vm.right_design.length - 1];
                    vm.right_design.push({

                        "type": "text",
                        "font": 'arial',
                        "color": "rgb(255,0,0)",
                        "text": vm.selected_text.text,
                        "z_index": z_index

                    });

                    vm.selected_text = vm.right_design[vm.right_design.length - 1];
                    $scope.focus = true;

                }
            }
        }

        */
        function updateSVGText(textObj) {

            if (textObj && textObj.z_index) {

                var text = document.querySelectorAll('#box' + textObj.z_index + ' tspan');
                var $w = parseInt(text[0].getBoundingClientRect().width);
                var $h = parseInt(text[0].getBoundingClientRect().height);
                //  vm.Bbox = text.getBBox();
                $('#box' + textObj.z_index).css('width', $w + 'px');
                $('#box' + textObj.z_index).css('height', $h + 'px');

                var svg = document.querySelectorAll('svg'),
                    width = svg[0].getAttribute('width'),
                    height = svg[0].getAttribute('height'),
                    view = svg[0].getAttribute('viewBox').split(' '),
                    vw = (view[2] * $w) / width,
                    vh = (view[3] * $h) / height;
                svg[0].setAttributeNS(null, 'width', $w + 5);
                svg[0].setAttributeNS(null, 'height', $h);
                svg[0].setAttributeNS(null, 'viewBox', '0 0 ' + vw + ' ' + vh);
                return true;
            }
        }

        //Text Selection

        // vm.updateText = function(event){
        //  var tspan = document.querySelector('tspan');
        //    // console.log(document.querySelector('tspan').getComputedTextLength());
        // // var rotationangle = $('.user-box').css('styles');
        //   var rotationInfo = $('.user-box').rotationInfo();
        // //  var deg = 90;
        //   $scope.slider.value = rotationInfo.deg;
        //   console.log(vm.currentRotation);
        //     if(vm.addText.length > 0){
        //         vm.designSelected = true;
        //         vm.Bbox = tspan.getBBox();
        //         vm.Bbox.height += 30;
        //         vm.Bbox.width += 50;
        //     }
        //     else{
        //         vm.designSelected = false;
        //     }

        // }

        vm.updateText = function () {

            var unitWidth = 0;
            var unitHeight = 0;

            // vm.Bbox = document.querySelector('tspan').getBBox();



            //  $('#box'+vm.selected_text.z_index+' svg').css('width', $w + 'px');
            // $('#box'+vm.selected_text.z_index).css('height', $h + 'px');

            //  debugger;



            if (vm.default_tab == 1) {

                if (vm.selected_text.z_index && vm.selected_text.type == 'text') {
                    var text = document.querySelectorAll('#box' + vm.selected_text.z_index + "front" + ' tspan');
                    var $w = parseInt(text[0].getBoundingClientRect().width) + 13;
                    var $h = parseInt(text[0].getBoundingClientRect().height);

                    //  vm.Bbox = text.getBBox();
                    $('#box' + vm.selected_text.z_index + "front").css('width', $w + 'px');
                    $('#box' + vm.selected_text.z_index + "front").css('height', $h + 'px');

                    var svg = document.querySelectorAll('#box' + vm.selected_text.z_index + "front" + ' svg'),
                        width = svg[0].getAttribute('width'),
                        height = svg[0].getAttribute('height'),
                        view = svg[0].getAttribute('viewBox').split(' '),
                        vw = (view[2] * $w) / width,
                        vh = (view[3] * $h) / height;
                    svg[0].setAttributeNS(null, 'width', $w);
                    svg[0].setAttributeNS(null, 'height', $h);
                    svg[0].setAttributeNS(null, 'viewBox', '0 0 ' + vw + ' ' + vh);
                }

                if (!(vm.selected_text.z_index)) {

                    // var z_index = vm.front_design[vm.front_design.length - 1].z_index+1;
                    var z_index = 0;
                    var obj = {

                        "type": "text",
                        "font": 'arial',
                        "color": "rgb(255,0,0)",
                        "text": vm.selected_text.text,
                        "z_index": z_index,
                        "selected": false,
                        "slider": {
                            "value": 0,
                            "options": {
                                "floor": -360,
                                "ceil": 360,
                                "step": 1,
                            },
                        }

                    };

                    if (!vm.front_design.length) {
                        obj.z_index = 1;

                    }
                    else {
                        obj.z_index = vm.front_design[vm.front_design.length - 1].z_index + 1;
                    }
                    vm.front_design.push(obj);

                    _.each(vm.front_design, function (front) {



                        if (front.z_index != obj.z_index) {
                            $('#tools' + front.z_index + "front").css({ 'visibility': 'hidden' });
                            $('#box' + front.z_index + "front").removeClass('border');
                            front.selected = false;
                        }
                        else {

                            setTimeout(function () {

                                var text = document.querySelectorAll('#box' + obj.z_index + "front" + ' tspan');
                                var $w = parseInt(text[0].getBoundingClientRect().width);
                                var $h = parseInt(text[0].getBoundingClientRect().height);
                                unitWidth = $w;
                                unitHeight = $h;


                                //  vm.Bbox = text.getBBox();
                                $('#box' + obj.z_index + "front").css('width', $w + $w + 'px');
                                $('#box' + obj.z_index + "front").css('height', $h + 'px');

                                var svg = document.querySelectorAll('#box' + obj.z_index + "front" + ' svg'),
                                    width = svg[0].getAttribute('width'),
                                    height = svg[0].getAttribute('height');

                                //    var  view = svg[0].getAttribute('viewBox').split(' '),
                                //     vw = (view[2] * $w)/width,
                                //     vh = (view[3] * $h)/height;




                                svg[0].setAttributeNS(null, 'width', $w);
                                svg[0].setAttributeNS(null, 'height', $h);
                                svg[0].setAttributeNS(null, 'viewBox', '0 0 ' + $w + ' ' + $h);


                                $('#tools' + obj.z_index + "front").css({ 'visibility': 'visible' });
                                $('#box' + obj.z_index + "front").addClass('border');
                                front.selected = true;
                                vm.select_text(obj.z_index);
                            }, 0)


                        }


                    });

                    $scope.focus = true;
                    vm.selected_text = obj;


                    //       _.each(vm.front_design,function(front){
                    //   if(front.type==='text'){
                    //     console.log(front);
                    //   }
                    //     if(front.z_index == vm.selected_text.z_index){

                    //     }
                    //     else {
                    //         //   $('#tools'+front.z_index).css({'visibility':'hidden'});
                    //         //   $('#box'+front.z_index).removeClass('border');
                    //         }
                    //    })

                }
                else {



                }

            }

            else if (vm.default_tab == 2) {





                if (vm.selected_text.z_index && vm.selected_text.type == 'text') {
                    //alert("Calleeeed");
                    var text = document.querySelectorAll('#box' + vm.selected_text.z_index + "back" + ' tspan');
                    var $w = parseInt(text[0].getBoundingClientRect().width) + 13;
                    var $h = parseInt(text[0].getBoundingClientRect().height);

                    //  vm.Bbox = text.getBBox();
                    $('#box' + vm.selected_text.z_index + "back").css('width', $w + 'px');
                    $('#box' + vm.selected_text.z_index + "back").css('height', $h + 'px');

                    var svg = document.querySelectorAll('#box' + vm.selected_text.z_index + "back" + ' svg'),
                        width = svg[0].getAttribute('width'),
                        height = svg[0].getAttribute('height'),
                        view = svg[0].getAttribute('viewBox').split(' '),
                        vw = (view[2] * $w) / width,
                        vh = (view[3] * $h) / height;
                    svg[0].setAttributeNS(null, 'width', $w);
                    svg[0].setAttributeNS(null, 'height', $h);
                    svg[0].setAttributeNS(null, 'viewBox', '0 0 ' + vw + ' ' + vh);
                }

                if (!(vm.selected_text.z_index)) {

                    // var z_index = vm.front_design[vm.front_design.length - 1].z_index+1;
                    var z_index = 0;
                    var obj = {

                        "type": "text",
                        "font": 'arial',
                        "color": "rgb(255,0,0)",
                        "text": vm.selected_text.text,
                        "z_index": z_index,
                        "selected": false,
                        "slider": {
                            "value": 0,
                            "options": {
                                "floor": -360,
                                "ceil": 360,
                                "step": 1,
                            },
                        }

                    };

                    if (!vm.back_design.length) {
                        obj.z_index = 1;

                    }
                    else {
                        obj.z_index = vm.back_design[vm.back_design.length - 1].z_index + 1;
                    }
                    vm.back_design.push(obj);

                    _.each(vm.back_design, function (front) {



                        if (front.z_index != obj.z_index) {
                            $('#tools' + front.z_index + "back").css({ 'visibility': 'hidden' });
                            $('#box' + front.z_index + "back").removeClass('border');
                            front.selected = false;
                        }
                        else {

                            setTimeout(function () {

                                var text = document.querySelectorAll('#box' + obj.z_index + "back" + ' tspan');
                                var $w = parseInt(text[0].getBoundingClientRect().width);
                                var $h = parseInt(text[0].getBoundingClientRect().height);
                                unitWidth = $w;
                                unitHeight = $h;


                                //  vm.Bbox = text.getBBox();
                                $('#box' + obj.z_index + "back").css('width', $w + $w + 'px');
                                $('#box' + obj.z_index + "back").css('height', $h + 'px');

                                var svg = document.querySelectorAll('#box' + obj.z_index + "back" + ' svg'),
                                    width = svg[0].getAttribute('width'),
                                    height = svg[0].getAttribute('height');

                                //    var  view = svg[0].getAttribute('viewBox').split(' '),
                                //     vw = (view[2] * $w)/width,
                                //     vh = (view[3] * $h)/height;




                                svg[0].setAttributeNS(null, 'width', $w);
                                svg[0].setAttributeNS(null, 'height', $h);
                                svg[0].setAttributeNS(null, 'viewBox', '0 0 ' + $w + ' ' + $h);


                                $('#tools' + obj.z_index + "back").css({ 'visibility': 'visible' });
                                $('#box' + obj.z_index + "back").addClass('border');
                                front.selected = true;
                                vm.select_text(obj.z_index);
                            }, 0)


                        }


                    });

                    $scope.focus = true;
                    vm.selected_text = obj;


                    //       _.each(vm.front_design,function(front){
                    //   if(front.type==='text'){
                    //     console.log(front);
                    //   }
                    //     if(front.z_index == vm.selected_text.z_index){

                    //     }
                    //     else {
                    //         //   $('#tools'+front.z_index).css({'visibility':'hidden'});
                    //         //   $('#box'+front.z_index).removeClass('border');
                    //         }
                    //    })

                }
                else {



                }


            }

            else if (vm.default_tab == 3) {

                if (vm.selected_text.z_index && vm.selected_text.type == 'text') {

                    var text = document.querySelectorAll('#box' + vm.selected_text.z_index + "left" + ' tspan');
                    var $w = parseInt(text[0].getBoundingClientRect().width) + 13;
                    var $h = parseInt(text[0].getBoundingClientRect().height);

                    //  vm.Bbox = text.getBBox();
                    $('#box' + vm.selected_text.z_index + "left").css('width', $w + 'px');
                    $('#box' + vm.selected_text.z_index + "left").css('height', $h + 'px');

                    var svg = document.querySelectorAll('#box' + vm.selected_text.z_index + "left" + ' svg'),
                        width = svg[0].getAttribute('width'),
                        height = svg[0].getAttribute('height'),
                        view = svg[0].getAttribute('viewBox').split(' '),
                        vw = (view[2] * $w) / width,
                        vh = (view[3] * $h) / height;
                    svg[0].setAttributeNS(null, 'width', $w);
                    svg[0].setAttributeNS(null, 'height', $h);
                    svg[0].setAttributeNS(null, 'viewBox', '0 0 ' + vw + ' ' + vh);
                }

                if (!(vm.selected_text.z_index)) {

                    // var z_index = vm.front_design[vm.front_design.length - 1].z_index+1;
                    var z_index = 0;
                    var obj = {

                        "type": "text",
                        "font": 'arial',
                        "color": "rgb(255,0,0)",
                        "text": vm.selected_text.text,
                        "z_index": z_index,
                        "selected": false,
                        "slider": {
                            "value": 0,
                            "options": {
                                "floor": -360,
                                "ceil": 360,
                                "step": 1,
                            },
                        }

                    };

                    if (!vm.left_design.length) {
                        obj.z_index = 1;

                    }
                    else {
                        obj.z_index = vm.left_design[vm.left_design.length - 1].z_index + 1;
                    }
                    vm.left_design.push(obj);

                    _.each(vm.left_design, function (front) {



                        if (front.z_index != obj.z_index) {
                            $('#tools' + front.z_index + "left").css({ 'visibility': 'hidden' });
                            $('#box' + front.z_index + "left").removeClass('border');
                            front.selected = false;
                        }
                        else {

                            setTimeout(function () {

                                var text = document.querySelectorAll('#box' + obj.z_index + "left" + ' tspan');
                                var $w = parseInt(text[0].getBoundingClientRect().width);
                                var $h = parseInt(text[0].getBoundingClientRect().height);
                                unitWidth = $w;
                                unitHeight = $h;


                                //  vm.Bbox = text.getBBox();
                                $('#box' + obj.z_index + "left").css('width', $w + $w + 'px');
                                $('#box' + obj.z_index + "left").css('height', $h + 'px');

                                var svg = document.querySelectorAll('#box' + obj.z_index + "left" + ' svg'),
                                    width = svg[0].getAttribute('width'),
                                    height = svg[0].getAttribute('height');

                                //    var  view = svg[0].getAttribute('viewBox').split(' '),
                                //     vw = (view[2] * $w)/width,
                                //     vh = (view[3] * $h)/height;




                                svg[0].setAttributeNS(null, 'width', $w);
                                svg[0].setAttributeNS(null, 'height', $h);
                                svg[0].setAttributeNS(null, 'viewBox', '0 0 ' + $w + ' ' + $h);


                                $('#tools' + obj.z_index + "left").css({ 'visibility': 'visible' });
                                $('#box' + obj.z_index + "left").addClass('border');
                                front.selected = true;
                                vm.select_text(obj.z_index);
                            }, 0)


                        }


                    });

                    $scope.focus = true;
                    vm.selected_text = obj;


                    //       _.each(vm.front_design,function(front){
                    //   if(front.type==='text'){
                    //     console.log(front);
                    //   }
                    //     if(front.z_index == vm.selected_text.z_index){

                    //     }
                    //     else {
                    //         //   $('#tools'+front.z_index).css({'visibility':'hidden'});
                    //         //   $('#box'+front.z_index).removeClass('border');
                    //         }
                    //    })

                }
                else {



                }


            }

            else if (vm.default_tab == 4) {

                if (vm.selected_text.z_index && vm.selected_text.type == 'text') {

                    var text = document.querySelectorAll('#box' + vm.selected_text.z_index + "right" + ' tspan');
                    var $w = parseInt(text[0].getBoundingClientRect().width) + 13;
                    var $h = parseInt(text[0].getBoundingClientRect().height);

                    //  vm.Bbox = text.getBBox();
                    $('#box' + vm.selected_text.z_index + "right").css('width', $w + 'px');
                    $('#box' + vm.selected_text.z_index + "right").css('height', $h + 'px');

                    var svg = document.querySelectorAll('#box' + vm.selected_text.z_index + "right" + ' svg'),
                        width = svg[0].getAttribute('width'),
                        height = svg[0].getAttribute('height'),
                        view = svg[0].getAttribute('viewBox').split(' '),
                        vw = (view[2] * $w) / width,
                        vh = (view[3] * $h) / height;
                    svg[0].setAttributeNS(null, 'width', $w);
                    svg[0].setAttributeNS(null, 'height', $h);
                    svg[0].setAttributeNS(null, 'viewBox', '0 0 ' + vw + ' ' + vh);
                }

                if (!(vm.selected_text.z_index)) {

                    // var z_index = vm.front_design[vm.front_design.length - 1].z_index+1;
                    var z_index = 0;
                    var obj = {

                        "type": "text",
                        "font": 'arial',
                        "color": "rgb(255,0,0)",
                        "text": vm.selected_text.text,
                        "z_index": z_index,
                        "selected": false,
                        "slider": {
                            "value": 0,
                            "options": {
                                "floor": -360,
                                "ceil": 360,
                                "step": 1,
                            },
                        }

                    };

                    if (!vm.right_design.length) {
                        obj.z_index = 1;

                    }
                    else {
                        obj.z_index = vm.right_design[vm.right_design.length - 1].z_index + 1;
                    }
                    vm.right_design.push(obj);

                    _.each(vm.right_design, function (front) {



                        if (front.z_index != obj.z_index) {
                            $('#tools' + front.z_index + "right").css({ 'visibility': 'hidden' });
                            $('#box' + front.z_index + "right").removeClass('border');
                            front.selected = false;
                        }
                        else {

                            setTimeout(function () {

                                var text = document.querySelectorAll('#box' + obj.z_index + "right" + ' tspan');
                                var $w = parseInt(text[0].getBoundingClientRect().width);
                                var $h = parseInt(text[0].getBoundingClientRect().height);
                                unitWidth = $w;
                                unitHeight = $h;


                                //  vm.Bbox = text.getBBox();
                                $('#box' + obj.z_index + "right").css('width', $w + $w + 'px');
                                $('#box' + obj.z_index + "right").css('height', $h + 'px');

                                var svg = document.querySelectorAll('#box' + obj.z_index + "right" + ' svg'),
                                    width = svg[0].getAttribute('width'),
                                    height = svg[0].getAttribute('height');

                                //    var  view = svg[0].getAttribute('viewBox').split(' '),
                                //     vw = (view[2] * $w)/width,
                                //     vh = (view[3] * $h)/height;




                                svg[0].setAttributeNS(null, 'width', $w);
                                svg[0].setAttributeNS(null, 'height', $h);
                                svg[0].setAttributeNS(null, 'viewBox', '0 0 ' + $w + ' ' + $h);


                                $('#tools' + obj.z_index + "right").css({ 'visibility': 'visible' });
                                $('#box' + obj.z_index + "right").addClass('border');
                                front.selected = true;
                                vm.select_text(obj.z_index);
                            }, 0)


                        }


                    });

                    $scope.focus = true;
                    vm.selected_text = obj;


                    //       _.each(vm.front_design,function(front){
                    //   if(front.type==='text'){
                    //     console.log(front);
                    //   }
                    //     if(front.z_index == vm.selected_text.z_index){

                    //     }
                    //     else {
                    //         //   $('#tools'+front.z_index).css({'visibility':'hidden'});
                    //         //   $('#box'+front.z_index).removeClass('border');
                    //         }
                    //    })

                }
                else {



                }
            }
        }



        vm.blockEnter = function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                return false;
            }
        }

        $scope.slider = {
            value: 0,
            options: {
                floor: -360,
                ceil: 360,
                step: 1,
            }
        };

        vm.onDrag = function (value) {
            vm.currentRotation = value;
        }


        vm.onDragEnd = function (value) {

            vm.currentRotation = value;
            console.log("DRAG_END", value)
        }


        vm.mousedown = function () {
            vm.rotation = true;
        }

        vm.mouseup = function () {
            vm.rotation = false;
            console.log("Fireeeddd");
        }

        vm.mousemove = function (e) {
            console.log(vm.rotation);
            var target = $("#box");
            if (vm.rotation) {
                //     var mouse_x = e.pageX;
                //     var mouse_y = e.pageY;
                //     var radians = Math.atan2(mouse_x - 10, mouse_y - 10);
                //     var degree = (radians * (180 / Math.PI) * -1) + 90;

                //    target.css('-moz-transform', 'rotate(' + degree + 'deg)');
                //    target.css('-moz-transform-origin', '0% 40%');
                //    target.css('-webkit-transform', 'rotate(' + degree + 'deg)');
                //    target.css('-webkit-transform-origin', '0% 40%');
                //    target.css('-o-transform', 'rotate(' + degree + 'deg)');
                //    target.css('-o-transform-origin', '0% 40%');
                //    target.css('-ms-transform', 'rotate(' + degree + 'deg)');
                //    target.css('-ms-transform-origin', '0% 40%');

            }
        }
    }






