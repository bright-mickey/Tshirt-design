var baseURL = "http://www.teedesign.ae/api";
var imageURL = "http://cdn.teedesign.ae/images/products/apparel/";
var imageURL1 = "http://d1b2zzpxewkr9z.cloudfront.net/images/products/apparel/";
var graphicsURL = "http://cdn.teedesign.ae/vectors/";
var fontsURL="http://cdn.teedesign.ae/webfonts/";
var serverURL = "http://www.teedesign.ae/";

/*To DO List
1 text use cases
2 on set_goal page, designs should come with svg images
*/

var DashboardModule = angular.module("DashboardModule", [])
DashboardModule.controller('DashboardController', DashboardController);

DashboardController.$inject = ['$scope', '$rootScope', '$modal', '$http', '$location', '$state', 'DashboardService', 'AnimationService', '_', '$popover', '$sce', 'Upload', '$timeout','$interval','SweetAlert'];

function DashboardController($scope, $rootScope, $modal, $http, $location, $state, DashboardService, AnimationService, _, $popover, $sce, Upload, $timeout,$interval,SweetAlert) {
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


    window.timeoutList = new Array();
window.intervalList = new Array();

window.oldSetTimeout = window.setTimeout;
window.oldSetInterval = window.setInterval;
window.oldClearTimeout = window.clearTimeout;
window.oldClearInterval = window.clearInterval;

window.setTimeout = function(code, delay) {
    var retval = window.oldSetTimeout(code, delay);
    window.timeoutList.push(retval);
    return retval;
};
window.clearTimeout = function(id) {
    var ind = window.timeoutList.indexOf(id);
    if(ind >= 0) {
        window.timeoutList.splice(ind, 1);
    }
    var retval = window.oldClearTimeout(id);
    return retval;
};
window.setInterval = function(code, delay) {
  
    var retval = window.oldSetInterval(code, delay);
    window.intervalList.push(retval);
    return retval;
};
window.clearInterval = function(id) {
     
    var ind = window.intervalList.indexOf(id);
    if(ind >= 0) {
        window.intervalList.splice(ind, 1);
    }
    var retval = window.oldClearInterval(id);
    return retval;
};


window.clearAllIntervals = function() {
    for(var i in window.intervalList) {
        window.oldClearInterval(window.intervalList[i]);
    }
    window.intervalList = new Array();
};

function Alert(message){

            SweetAlert.swal({
                        title: 'Hang on!',
                        text: message,
                        type: 'info',
                        showCancelButton: false,
                        closeOnConfirm: true,
                        disableButtonsOnConfirm: true,
                        animation: 'animated fadeInRightBig',
                        confirmLoadingButtonColor: '#DD6B55'
                    });


        }


    //function launch_compaign() {
    //  debugger;

    // if(vm.front_design.length || vm.back_design.length || vm.right_design.length || vm.left_design.length){
    // var to_be_sent = [];
    // var shirts = _.where(vm.shirts_in_styles, { selected: true });
    // for (var i = 0; i < shirts.length; i++) {
    //     to_be_sent[i] = {};
    //     to_be_sent[i].id = shirts[i].id;
    //     to_be_sent[i].price = shirts[i].total_unit_cost + shirts[i].profit;

    //     var colors = _.where(shirts[i].colors_available, { selected: true });
    //     var clr_ids = [];
    //     for (var j = 0; j < colors.length; j++) {
    //         clr_ids.push(colors[j].color_id);
    //     }
    //     //  debugger;
    //     to_be_sent[i].colors = clr_ids;
    //     //id price colors


    // }
    // var defaultProduct = {};
    // defaultProduct.id = vm.selectedShirt.id;
    // var clrs_default = [];
    // for (var i = 0; i < vm.selectedShirt.colors_available.length; i++) {
    //     var color = vm.selectedShirt.colors_available[i];
    //     if (color.selected)
    //         clrs_default.push(color.color_id);


    // }
    // var tags_arr = "";
    // for (var i = 0; i < vm.tags.length - 1; i++) {

    //     tags_arr = tags_arr + vm.tags[i] + ",";

    // }
    // tags_arr += vm.tags[vm.tags.length - 1];
    // //  tags_arr=tags_arr.substr(0,tags_arr.length-1);
    // defaultProduct.colors = clrs_default;
    // // debugger;
    // var days = Number(vm.compaign_length.trim().substr(0, 1));
    // // var compaign_json = new FormData();
    // // compaign_json.append("name",vm.compaign_title);
    // // compaign_json.append("url",vm.url);
    // // compaign_json.append("description",$scope.htmlcontenttwo);
    // // compaign_json.append("length",days);
    // // compaign_json.append("products",to_be_sent);
    // // compaign_json.append("defaultProduct",defaultProduct);
    // // compaign_json.append("tags",tags_arr);
    // // compaign_json.append("category_id",vm.description.category);

    // var compaign_json = {};

    // compaign_json.name = vm.compaign_title;
    // compaign_json.url = vm.url;
    // compaign_jsondescription = $scope.htmlcontenttwo;
    // compaign_json.length = days;
    // compaign_json.products = to_be_sent;
    // compaign_json.defaultProduct = defaultProduct;
    // compaign_json.tags = tags_arr;
    // compaign_json.category_id = vm.description.category;

    // var sides = [];

    // var activeSide = vm.default_tab === 1 ? "front" : vm.default_tab === 2 ? "back" : vm.default_tab === 3 ? "left" : "right";
    // // var front = $("#box1front");
    // // var svg = front.find('svg');
    // // var view = svg[0].getAttributeNS(null, 'viewBox');
    // // var arr = view.split(' ');



    // for (var i = 0; i < 4; i++) {

    //     if (i == 0) {



    //         var svgText = "";
    //         var layers = [];
    //         for (var j = 0; j < vm.front_design.length; j++) {
    //             var element = $('#box' + vm.front_design[j].z_index + "front");
    //             var pipe = j == 0 ? "||" : "";
    //             svgText += _.escape(element.prop('outerHTML')) + pipe;
    //         }

    //         for (var k = 0; k < vm.front_design.length; k++) {
    //             if (vm.front_design[k].type === 'text') {
    //                 var obj_ = vm.front_design[k];
    //                 //  var _obj = _.findWhere(vm.graphics, {id:obj_.id});
    //                 var element = $('#box' + vm.front_design[k].z_index + "front");
    //                 var svg = element.find('svg');
    //                 var view = svg[0].getAttributeNS(null, 'viewBox');
    //                 var arr = view.split(' ');

    //                 var textObj = {
    //                     "string": vm.front_design[k].text,
    //                     font: {
    //                         id: k,
    //                         family: vm.front_design[k].font,
    //                         filename: vm.front_design[k].font,
    //                         tags: [],
    //                         priority: 1,
    //                         url: null
    //                     },
    //                     fontSize: 24,
    //                     tag: "Popular",
    //                     lineHeight: 1.2,
    //                     alignment: "center",
    //                     colors: obj_.color,
    //                     outlineThickness: 0,
    //                     transformations: [],
    //                     matrix: {},
    //                     beingEdited: false,
    //                     origin: "Native",
    //                     type: "Text",
    //                     bbox: {
    //                         x: parseInt(arr[0]),
    //                         y: parseInt(arr[1]),
    //                         width: parseInt(arr[2]),
    //                         height: parseInt(arr[3]),
    //                     },
    //                     filename: "",
    //                     "preserve-colors": false,
    //                     fillColor: {
    //                         id: k,
    //                         value: vm.front_design[k].color,
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     outlineColor: {
    //                         id: "default" + k,
    //                         value: "#000000",
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     newDesignData: {
    //                         transform: {

    //                         }
    //                     }

    //                 }

    //                 layers.push(textObj);
    //             }

    //             if (vm.front_design[k].type === "svg") {
    //                 var obj_ = vm.front_design[k];


    //                 var _obj = _.findWhere(vm.graphics, { id: obj_.id });
    //                 var element = $('#box' + vm.front_design[k].z_index + "front");
    //                 var svg = element.find('svg');
    //                 var view = svg[0].getAttributeNS(null, 'viewBox');
    //                 var arr = view.split(' ');

    //                 var svgObj = {
    //                     "urlParams": {
    //                         "filename": ""
    //                     },
    //                     name: "",
    //                     format: "",
    //                     "original_key": "",
    //                     sourceFilename: "",
    //                     svg_key: "",
    //                     png_key: "",
    //                     category: [],
    //                     colors: _obj.colors,
    //                     uploadId: null,
    //                     initialScale: 1,
    //                     transformations: [],
    //                     matrix: {},
    //                     beingEdited: false,
    //                     origin: "Native",
    //                     type: "Art",
    //                     bbox: {
    //                         x: parseInt(arr[0]),
    //                         y: parseInt(arr[1]),
    //                         width: parseInt(arr[2]),
    //                         height: parseInt(arr[3]),
    //                     },
    //                     filename: "",
    //                     "preserve-colors": false,
    //                     fillColor: {
    //                         id: k,
    //                         value: vm.front_design[k].color,
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     outlineColor: {
    //                         id: "default" + k,
    //                         value: "#000000",
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     newDesignData: {
    //                         transform: {

    //                         }
    //                     }

    //                 }

    //                 layers.push(svgObj);

    //             }
    //         }


    //         var front = {
    //             removeLayerBinding: {},
    //             name: "front",
    //             layers: layers,
    //             bbox: {
    //                 x: parseInt(arr[0]),
    //                 y: parseInt(arr[1]),
    //                 width: parseInt(arr[2]),
    //                 height: parseInt(arr[3]),
    //             },
    //             absoluteBBox: {
    //                 x: parseInt(arr[0]),
    //                 y: parseInt(arr[1]),
    //                 width: parseInt(arr[2]),
    //                 height: parseInt(arr[3]),
    //             },
    //             beingViewed: false,
    //             initialFreeTransformAttrs: null,
    //             initialPrintableArea: null,
    //             referencePoint: {},
    //             ppi: 18,
    //             editable: null,
    //             sequence: 2,
    //            // priorPrintableBox: parseInt(arr[0]) + "," + $("#box1front").parent().parent().parent().css('top').substr(0, $("#box1front").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
    //             scaleAndMove: null,
    //             rasterImageInfo: [],
    //             svg: svgText,


    //         }
    //         sides.push(front);

    // }

    //     if (i == 1) {

    //         var svgText = "";
    //         var element;
    //         var layers = [];
    //         for (var j = 0; j < vm.back_design.length; j++) {
    //             var element = $('#box' + vm.back_design[j].z_index + "back");
    //             var pipe = j == 0 ? "||" : "";
    //             svgText += _.escape(element.prop('outerHTML')) + pipe;
    //         }

    //         for (var k = 0; k < vm.back_design.length; k++) {
    //             if (vm.back_design[k].type === 'text') {

    //                 var obj_ = vm.back_design[k];
    //                 // var _obj = _.findWhere(vm.graphics, {id:obj_.id});
    //                 var element = $('#box' + vm.back_design[k].z_index + "back");
    //                 var svg = element.find('svg');
    //                 var view = svg[0].getAttributeNS(null, 'viewBox');
    //                 var arr = view.split(' ');

    //                 var textObj = {
    //                     "string": vm.back_design[k].text,
    //                     font: {
    //                         id: k,
    //                         family: vm.back_design[k].font,
    //                         filename: vm.back_design[k].font,
    //                         tags: [],
    //                         priority: 1,
    //                         url: null
    //                     },
    //                     fontSize: 24,
    //                     tag: "Popular",
    //                     lineHeight: 1.2,
    //                     alignment: "center",
    //                     colors: obj_.color,
    //                     outlineThickness: 0,
    //                     transformations: [],
    //                     matrix: {},
    //                     beingEdited: false,
    //                     origin: "Native",
    //                     type: "Text",
    //                     bbox: {
    //                         x: parseInt(arr[0]),
    //                         y: parseInt(arr[1]),
    //                         width: parseInt(arr[2]),
    //                         height: parseInt(arr[3]),
    //                     },
    //                     filename: "",
    //                     "preserve-colors": false,
    //                     fillColor: {
    //                         id: k,
    //                         value: vm.back_design[k].color,
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     outlineColor: {
    //                         id: "default" + k,
    //                         value: "#000000",
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     newDesignData: {
    //                         transform: {

    //                         }
    //                     }

    //                 }

    //                 layers.push(textObj);
    //             }

    //             if (vm.back_design[k].type === "svg") {
    //                 var obj_ = vm.back_design[k];
    //                 var _obj = _.findWhere(vm.graphics, { id: obj_.id });
    //                 //   debugger;
    //                 var element = $('#box' + vm.back_design[k].z_index + "back");
    //                 var svg = element.find('svg');
    //                 var view = svg[0].getAttributeNS(null, 'viewBox');
    //                 var arr = view.split(' ');

    //                 var svgObj = {
    //                     "urlParams": {
    //                         "filename": ""
    //                     },
    //                     name: "",
    //                     format: "",
    //                     "original_key": "",
    //                     sourceFilename: "",
    //                     svg_key: "",
    //                     png_key: "",
    //                     category: [],
    //                     colors: _obj.colors,
    //                     uploadId: null,
    //                     initialScale: 1,
    //                     transformations: [],
    //                     matrix: {},
    //                     beingEdited: false,
    //                     origin: "Native",
    //                     type: "Art",
    //                     bbox: {
    //                         x: parseInt(arr[0]),
    //                         y: parseInt(arr[1]),
    //                         width: parseInt(arr[2]),
    //                         height: parseInt(arr[3]),
    //                     },
    //                     filename: "",
    //                     "preserve-colors": false,
    //                     fillColor: {
    //                         id: k,
    //                         value: vm.back_design[k].color,
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     outlineColor: {
    //                         id: "default" + k,
    //                         value: "#000000",
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     newDesignData: {
    //                         transform: {

    //                         }
    //                     }

    //                 }

    //                 layers.push(svgObj);

    //             }
    //         }


    //         var back = {
    //             removeLayerBinding: {},
    //             name: "back",
    //             layers: layers,
    //             bbox: {
    //                 x: parseInt(arr[0]),
    //                 y: parseInt(arr[1]),
    //                 width: parseInt(arr[2]),
    //                 height: parseInt(arr[3]),
    //             },
    //             absoluteBBox: {
    //                 x: parseInt(arr[0]),
    //                 y: parseInt(arr[1]),
    //                 width: parseInt(arr[2]),
    //                 height: parseInt(arr[3]),
    //             },
    //             beingViewed: false,
    //             initialFreeTransformAttrs: null,
    //             initialPrintableArea: null,
    //             referencePoint: {},
    //             ppi: 18,
    //             editable: null,
    //             sequence: 2,
    //            // priorPrintableBox: parseInt(arr[0]) + "," + $("#box1back").parent().parent().parent().css('top').substr(0, $("#box1back").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
    //             scaleAndMove: null,
    //             rasterImageInfo: [],
    //             svg: svgText,


    //         }

    //         sides.push(back);
    //     }

    //      if (i == 2) {

    //         var svgText = "";
    //         var element;
    //         var layers = [];
    //         for (var j = 0; j < vm.left_design.length; j++) {
    //             var element = $('#box' + vm.left_design[j].z_index + "left");
    //             var pipe = j == 0 ? "||" : "";
    //             svgText += _.escape(element.prop('outerHTML')) + pipe;
    //         }

    //         for (var k = 0; k < vm.left_design.length; k++) {
    //             if (vm.left_design[k].type === 'text') {

    //                 var obj_ = vm.left_design[k];
    //                 // var _obj = _.findWhere(vm.graphics, {id:obj_.id});
    //                 var element = $('#box' + vm.left_design[k].z_index + "left");
    //                 var svg = element.find('svg');
    //                 var view = svg[0].getAttributeNS(null, 'viewBox');
    //                 var arr = view.split(' ');

    //                 var textObj = {
    //                     "string": vm.left_design[k].text,
    //                     font: {
    //                         id: k,
    //                         family: vm.left_design[k].font,
    //                         filename: vm.left_design[k].font,
    //                         tags: [],
    //                         priority: 1,
    //                         url: null
    //                     },
    //                     fontSize: 24,
    //                     tag: "Popular",
    //                     lineHeight: 1.2,
    //                     alignment: "center",
    //                     colors: obj_.color,
    //                     outlineThickness: 0,
    //                     transformations: [],
    //                     matrix: {},
    //                     beingEdited: false,
    //                     origin: "Native",
    //                     type: "Text",
    //                     bbox: {
    //                         x: parseInt(arr[0]),
    //                         y: parseInt(arr[1]),
    //                         width: parseInt(arr[2]),
    //                         height: parseInt(arr[3]),
    //                     },
    //                     filename: "",
    //                     "preserve-colors": false,
    //                     fillColor: {
    //                         id: k,
    //                         value: vm.left_design[k].color,
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     outlineColor: {
    //                         id: "default" + k,
    //                         value: "#000000",
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     newDesignData: {
    //                         transform: {

    //                         }
    //                     }

    //                 }

    //                 layers.push(textObj);
    //             }

    //             if (vm.left_design[k].type === "svg") {
    //                 var obj_ = vm.left_design[k];
    //                 var _obj = _.findWhere(vm.graphics, { id: obj_.id });
    //                 //   debugger;
    //                 var element = $('#box' + vm.left_design[k].z_index + "left");
    //                 var svg = element.find('svg');
    //                 var view = svg[0].getAttributeNS(null, 'viewBox');
    //                 var arr = view.split(' ');

    //                 var svgObj = {
    //                     "urlParams": {
    //                         "filename": ""
    //                     },
    //                     name: "",
    //                     format: "",
    //                     "original_key": "",
    //                     sourceFilename: "",
    //                     svg_key: "",
    //                     png_key: "",
    //                     category: [],
    //                     colors: _obj.colors,
    //                     uploadId: null,
    //                     initialScale: 1,
    //                     transformations: [],
    //                     matrix: {},
    //                     beingEdited: false,
    //                     origin: "Native",
    //                     type: "Art",
    //                     bbox: {
    //                         x: parseInt(arr[0]),
    //                         y: parseInt(arr[1]),
    //                         width: parseInt(arr[2]),
    //                         height: parseInt(arr[3]),
    //                     },
    //                     filename: "",
    //                     "preserve-colors": false,
    //                     fillColor: {
    //                         id: k,
    //                         value: vm.left_design[k].color,
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     outlineColor: {
    //                         id: "default" + k,
    //                         value: "#000000",
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     newDesignData: {
    //                         transform: {

    //                         }
    //                     }

    //                 }

    //                 layers.push(svgObj);

    //             }
    //         }


    //         var left = {
    //             removeLayerBinding: {},
    //             name: "left",
    //             layers: layers,
    //             bbox: {
    //                 x: parseInt(arr[0]),
    //                 y: parseInt(arr[1]),
    //                 width: parseInt(arr[2]),
    //                 height: parseInt(arr[3]),
    //             },
    //             absoluteBBox: {
    //                 x: parseInt(arr[0]),
    //                 y: parseInt(arr[1]),
    //                 width: parseInt(arr[2]),
    //                 height: parseInt(arr[3]),
    //             },
    //             beingViewed: false,
    //             initialFreeTransformAttrs: null,
    //             initialPrintableArea: null,
    //             referencePoint: {},
    //             ppi: 18,
    //             editable: null,
    //             sequence: 2,
    //            // priorPrintableBox: parseInt(arr[0]) + "," + $("#box1left").parent().parent().parent().css('top').substr(0, $("#box1left").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
    //             scaleAndMove: null,
    //             rasterImageInfo: [],
    //             svg: svgText,


    //         }

    //         sides.push(left);
    //     }

    //      if (i == 3) {

    //         var svgText = "";
    //         var element;
    //         var layers = [];
    //         for (var j = 0; j < vm.right_design.length; j++) {
    //             var element = $('#box' + vm.right_design[j].z_index + "right");
    //             var pipe = j == 0 ? "||" : "";
    //             svgText += _.escape(element.prop('outerHTML')) + pipe;
    //         }

    //         for (var k = 0; k < vm.right_design.length; k++) {
    //             if (vm.right_design[k].type === 'text') {

    //                 var obj_ = vm.right_design[k];
    //                 // var _obj = _.findWhere(vm.graphics, {id:obj_.id});
    //                 var element = $('#box' + vm.right_design[k].z_index + "right");
    //                 var svg = element.find('svg');
    //                 var view = svg[0].getAttributeNS(null, 'viewBox');
    //                 var arr = view.split(' ');

    //                 var textObj = {
    //                     "string": vm.right_design[k].text,
    //                     font: {
    //                         id: k,
    //                         family: vm.right_design[k].font,
    //                         filename: vm.right_design[k].font,
    //                         tags: [],
    //                         priority: 1,
    //                         url: null
    //                     },
    //                     fontSize: 24,
    //                     tag: "Popular",
    //                     lineHeight: 1.2,
    //                     alignment: "center",
    //                     colors: obj_.color,
    //                     outlineThickness: 0,
    //                     transformations: [],
    //                     matrix: {},
    //                     beingEdited: false,
    //                     origin: "Native",
    //                     type: "Text",
    //                     bbox: {
    //                         x: parseInt(arr[0]),
    //                         y: parseInt(arr[1]),
    //                         width: parseInt(arr[2]),
    //                         height: parseInt(arr[3]),
    //                     },
    //                     filename: "",
    //                     "preserve-colors": false,
    //                     fillColor: {
    //                         id: k,
    //                         value: vm.right_design[k].color,
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     outlineColor: {
    //                         id: "default" + k,
    //                         value: "#000000",
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     newDesignData: {
    //                         transform: {

    //                         }
    //                     }

    //                 }

    //                 layers.push(textObj);
    //             }

    //             if (vm.right_design[k].type === "svg") {
    //                 var obj_ = vm.back_design[k];
    //                 var _obj = _.findWhere(vm.graphics, { id: obj_.id });
    //                 //   debugger;
    //                 var element = $('#box' + vm.right_design[k].z_index + "right");
    //                 var svg = element.find('svg');
    //                 var view = svg[0].getAttributeNS(null, 'viewBox');
    //                 var arr = view.split(' ');

    //                 var svgObj = {
    //                     "urlParams": {
    //                         "filename": ""
    //                     },
    //                     name: "",
    //                     format: "",
    //                     "original_key": "",
    //                     sourceFilename: "",
    //                     svg_key: "",
    //                     png_key: "",
    //                     category: [],
    //                     colors: _obj.colors,
    //                     uploadId: null,
    //                     initialScale: 1,
    //                     transformations: [],
    //                     matrix: {},
    //                     beingEdited: false,
    //                     origin: "Native",
    //                     type: "Art",
    //                     bbox: {
    //                         x: parseInt(arr[0]),
    //                         y: parseInt(arr[1]),
    //                         width: parseInt(arr[2]),
    //                         height: parseInt(arr[3]),
    //                     },
    //                     filename: "",
    //                     "preserve-colors": false,
    //                     fillColor: {
    //                         id: k,
    //                         value: vm.right_design[k].color,
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     outlineColor: {
    //                         id: "default" + k,
    //                         value: "#000000",
    //                         origin: null,
    //                         heather: false,
    //                         texture: "",
    //                     },
    //                     newDesignData: {
    //                         transform: {

    //                         }
    //                     }

    //                 }

    //                 layers.push(svgObj);

    //             }
    //         }


    //         var right = {
    //             removeLayerBinding: {},
    //             name: "right",
    //             layers: layers,
    //             bbox: {
    //                 x: parseInt(arr[0]),
    //                 y: parseInt(arr[1]),
    //                 width: parseInt(arr[2]),
    //                 height: parseInt(arr[3]),
    //             },
    //             absoluteBBox: {
    //                 x: parseInt(arr[0]),
    //                 y: parseInt(arr[1]),
    //                 width: parseInt(arr[2]),
    //                 height: parseInt(arr[3]),
    //             },
    //             beingViewed: false,
    //             initialFreeTransformAttrs: null,
    //             initialPrintableArea: null,
    //             referencePoint: {},
    //             ppi: 18,
    //             editable: null,
    //             sequence: 2,
    //            // priorPrintableBox: parseInt(arr[0]) + "," + $("#box1right").parent().parent().parent().css('top').substr(0, $("#box1right").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
    //             scaleAndMove: null,
    //             rasterImageInfo: [],
    //             svg: svgText,


    //         }

    //         sides.push(right);
    //     }
    // }

    // }



    // var design = {

    //     lookupId: "f2345",
    //     sides: sides,
    //     activeSide: activeSide,
    //     high_quality_artwork: true,
    //     crap_quality_artwork: false,
    //     product_type_id: parseInt(vm.selectedShirt.id),
    //     frontColors: vm.total_front_colors.length,
    //     flashFront: false,
    //     backColors: vm.total_back_colors.length,
    //     flashBack: false,
    //     leftColors: vm.total_left_colors.length,
    //     flashLeft: false,
    //     rightColors: vm.total_right_colors.length,
    //     flashRight: false

    // }

    // console.log(JSON.stringify(obj,null,4));

    // for (o in obj) {
    //     console.log(o, obj[o]);
    // }


    // compaign_json.design = design;
    // compaign_json.priorPrintableArea = {"front":"152,100,220,330","back":"155,60,215,330","left":"155,60,215,330","right":"155,60,215,330"};
    // console.log(JSON.stringify(compaign_json,null,4));


    // var data = {'hey':"hellllo"};
    // var fd = objectToFormData(data);

    // var formData  =  new FormData();
    // formData.append('test',JSON.stringify(data));


    // var xsrf = {fkey: 'xsrf key'};

    //           $http({
    //             method: 'POST',
    //             url: 'http://www.teedesign.ae/api/save',
    //             headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    //             transformRequest: function(obj) {
    //                 var str = [];
    //                 for(var p in obj)
    //                 str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    //                 return str.join("&");
    //             },
    //             data: fd
    //         }).success(function (data) {console.log(data)});

    //console.log(fd);
    // var formData = new FormData();
    // formData.append('compaign_json', JSON.stringify(compaign_json));

    //console.log(data);
    // DashboardService.LaunchCompaign(formData).then(function(data){
    //     //console.clear();
    //     console.log(data);
    // });



    // }


   function outsideCollision($div1, $div2) {
      var x1 = $div1.offset().left;
      var y1 = $div1.offset().top;
      var h1 = $div1.outerHeight(true);
      var w1 = $div1.outerWidth(true);
      var b1 = y1 + h1;
      var r1 = x1 + w1;
      var x2 = $div2.offset().left;
      var y2 = $div2.offset().top;
      var h2 = $div2.outerHeight(true);
      var w2 = $div2.outerWidth(true);
      var b2 = y2 + h2;
      var r2 = x2 + w2;

      if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
      return true;
    }


    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;


        //y1>=2 b1- < y2 || y1 > (b2-h1) || r1 < x2 || x1 > r2
        if (((b1 - h1) < y2) || (y1 > (b2 - h1)) || ((r1 - w1) < x2) || (x1 > (r2 - w1))) return false;
        return true;
    }



    // window.setInterval(function() {
    // 	if(!collision($('#test1'), $('#test2'))){
    //          $('.printable-area').addClass('crossing_border');
    // 	}
    // 	else $('.printable-area').removeClass('crossing_border');
    // }, 200);


    function getRotationDegrees(obj) {
        var matrix = obj.css("-webkit-transform") ||
            obj.css("-moz-transform") ||
            obj.css("-ms-transform") ||
            obj.css("-o-transform") ||
            obj.css("transform");
        if (matrix !== 'none') {
            var values = matrix.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        } else { var angle = 0; }
        return (angle < 0) ? angle + 360 : angle;
    }


     
  function launch_compaign() {
        //  debugger;

        if (vm.front_design.length || vm.back_design.length || vm.right_design.length || vm.left_design.length) {
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
            // var days = Number(vm.compaign_length.trim().substr(0, 1));
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
            // compaign_json.description = vm.desc;
            compaign_json.description = $scope.desc;
            compaign_json.length = vm.compaign_length;
            compaign_json.products = JSON.stringify(to_be_sent);
            compaign_json.defaultProduct = JSON.stringify(defaultProduct);
            compaign_json.tags = JSON.stringify(tags_arr);
            compaign_json.category_id = vm.description.category;
            compaign_json.tipping_point = vm.goal_target;

            console.log("jskldfjklasdf", compaign_json.description);

            var sides = [];
            var activeSide = vm.default_tab === 1 ? "front" : vm.default_tab === 2 ? "back" : vm.default_tab === 3 ? "left" : "right";
            // var front = $("#box1front");
            // var svg = front.find('svg');
            // var view = svg[0].getAttributeNS(null, 'viewBox');
            // var arr = view.split(' ');
            var counter = 0;



            for (var i = 0; i < 4; i++) {

                if (i == 0) {

                    
                    var printableAreaWidthWithoutPX = $('.printable-area').css('width').substr(0,$('.printable-area').css('width').length-2);
                    var printableAreaHeightWithoutPX = $('.printable-area').css('height').substr(0,$('.printable-area').css('height').length-2);
                    console.log(printableAreaWidthWithoutPX);

                        console.log(printableAreaHeightWithoutPX);
                    var svgParent = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgParent.setAttribute('style', 'border: 1px solid black');
                    svgParent.setAttribute('width', printableAreaWidthWithoutPX);
                    svgParent.setAttribute('height', printableAreaHeightWithoutPX);
                    svgParent.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                    svgParent.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
                    svgParent.setAttributeNS(null, 'viewBox', '0 0 '+ printableAreaWidthWithoutPX +' ' + printableAreaHeightWithoutPX);

                    //  var svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
                    //                 svgimg.setAttributeNS('http://www.w3.org/2000/svg','height','100');
                    //                 svgimg.setAttributeNS('http://www.w3.org/2000/svg','width','100');
                    //                 svgimg.setAttributeNS('http://www.w3.org/1999/xlink','href','http://i.imgur.com/LQIsf.jpg');
                    //                 svgimg.setAttributeNS('http://www.w3.org/2000/svg','x','0');
                    //                 svgimg.setAttributeNS('http://www.w3.org/2000/svg','y','0');


                    var layers = [];
                    for (var j = 0; j < vm.front_design.length; j++) {
                        $('#box' + vm.front_design[j].z_index + "front");
                        var element = $('#box' + vm.front_design[j].z_index + "front");
                        var pipe = j == 0 ? "||" : "";
                        // svgText += _.escape(element.prop('outerHTML')) + pipe;

                        //element.find('svg')[0].removeAttribute("style");
                        //    svgText = element.find('image')[0].outerHTML;
                        //    svgText = svgText.replace(/\r?\n|\r/g,' ');
                        //    svgText = svgText.replace(/\t/g,'');


                        //    svgText = svgText.replace(/\r?\n|\r/g,' ');
                        //    svgText = svgText.replace(/\t/g,'');
                        // console.log(element.find('svg')[0].outerHTML);
                    }

                    for (var k = 0; k < vm.front_design.length; k++) {
                        if (vm.front_design[k].type === 'text') {
                            var obj_ = vm.front_design[k];
                            console.log(vm.front_design[k].z_index);
                            //  var _obj = _.findWhere(vm.graphics, {id:obj_.id});
                            var element = $('#box' + vm.front_design[k].z_index + "front");
                            var svg = element.children('svg')[0];
                            var view = svg.getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');
                           


                            
                            var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                           // g.setAttributeNS('http://www.w3.org/2000/svg','transform',$('#box' + vm.front_design[k].z_index + "front").css('transform'));
                        

                            var svgText;

                            svgText = $('#box' + vm.front_design[k].z_index + "front text").clone()[0];


                            console.log(svgText);

                            svgText.children[0].setAttributeNS(null, 'x', parseInt(element.css('left')));
                            svgText.children[0].setAttributeNS(null, 'y', parseInt(element.css('top')));
                            svgText.children[0].setAttributeNS(null, 'width', parseInt(element.css('width')));
                            svgText.children[0].setAttributeNS(null, 'height', parseInt(element.css('height')));
                            g.appendChild(svgText);
                            svgParent.appendChild(g);


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

                        if (vm.front_design[k].type === "svg" || vm.front_design[k].type === "img") {

                            counter++;

                            var element = $('#box' + vm.front_design[k].z_index + "front");
                            var svgText;

                            //  var tranformText = element.prop('outerHTML');
                            // tranformText = tranformText.substr(tranformText.indexOf('transform'),85);
                            // tranformText = tranformText.substr(tranformText.indexOf('('),tranformText.indexOf(');'));
                            // var regExp = /\(([^)]+)\)/;
                            // var matches = regExp.exec(tranformText);
                            // tranformText = matches[1];
                            // tranformText = tranformText.substr(0,tranformText.length-3);

                            // var deg = (parseFloat(tranformText)*(180/Math.PI));

                            // var rotation = "rotate("+deg+",)";

                            
                            // console.log(rotation);



                            svgText = element.find('image').clone()[0];

                             var g = document.createElementNS("http://www.w3.org/2000/svg", "g");



                           

                            //  var tranformText = element.prop('outerHTML');
                            // tranformText = tranformText.substr(tranformText.indexOf('transform'),85);
                            // tranformText = tranformText.substr(tranformText.indexOf('('),tranformText.indexOf(');'));
                            // var regExp = /\(([^)]+)\)/;
                            // var matches = regExp.exec(tranformText);
                            // tranformText = matches[1];
                            // tranformText = tranformText.substr(0,tranformText.length-3);

                            // var deg = (parseFloat(tranformText)*(180/Math.PI));

                            // var rotation = "rotate("+deg+",100,135)";

                        
                            console.log(rotation);

                          //   g.setAttributeNS('http://www.w3.org/2000/svg','transform',rotation);


                           // console.log(svgText);

                            svgText.setAttributeNS(null, 'x', parseFloat(element.css('left')));
                            svgText.setAttributeNS(null, 'y', parseFloat(element.css('top')));
                            svgText.setAttributeNS(null, 'width', parseFloat($('#box' + vm.front_design[k].z_index + "front svg").css('width')));
                            svgText.setAttributeNS(null, 'height', parseFloat($('#box' + vm.front_design[k].z_index + "front svg").css('height')));

                            console.log("x",parseFloat(element.css('left')));
                            console.log("y",parseFloat(element.css('top')));
                            console.log("width",parseFloat($('#box' + vm.front_design[k].z_index + "front svg").css('width')));
                            console.log("height",parseFloat($('#box' + vm.front_design[k].z_index + "front svg").css('height')));

                            g.appendChild(svgText);
                            svgParent.appendChild(g);
                            //  $('#global')[0].appendChild(oldSvg);
                            //console.log(svgParent).prop('html');

                            var obj_ = vm.front_design[k];


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

                            if(vm.front_design[k].type === "svg" ){
                                svgObj.colors = _obj.colors;
                            }

                            layers.push(svgObj);

                        }
                    }

                    console.log(svgParent);

                    svgParent = svgParent.outerHTML;
                    svgParent = svgParent.replace(/\r?\n|\r/g, ' ');
                    svgParent = svgParent.replace(/\t/g, '');
                    console.log(svgParent);



                    var front = {
                        removeLayerBinding: {},
                        name: "front",
                        layers: layers,
                        colors: vm.total_front_colors,
                       
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
                        // priorPrintableBox: parseInt(arr[0]) + "," + $("#box1front").parent().parent().parent().css('top').substr(0, $("#box1front").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
                        scaleAndMove: null,
                        rasterImageInfo: [],
                       
                    }

                    if(vm.front_design.length){
                        front.bbox =  {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        };
                        front.absoluteBBox= {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        }
                        front.svg= svgParent
                    }


                    console.log(front);

                    sides.push(front);
                    //  console.log(front);

                } 

                if (i == 1) {

                    var printableAreaWidthWithoutPX = $('.printable-area').css('width').substr(0,$('.printable-area').css('width').length-2);
                    var printableAreaHeightWithoutPX = $('.printable-area').css('height').substr(0,$('.printable-area').css('height').length-2);

                    var svgParent1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgParent1.setAttribute('style', 'border: 1px solid black');
                    svgParent1.setAttribute('width', printableAreaWidthWithoutPX);
                    svgParent1.setAttribute('height', printableAreaHeightWithoutPX);
                    svgParent1.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                    svgParent1.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
                    svgParent1.setAttributeNS(null, 'viewBox', '0 0 '+ printableAreaWidthWithoutPX +' ' + printableAreaHeightWithoutPX);

                    var layers = [];
                    for (var j = 0; j < vm.back_design.length; j++) {
                        var element = $('#box' + vm.back_design[j].z_index + "back");
                        var pipe = j == 0 ? "||" : "";
                        // svgText += _.escape(element.prop('outerHTML')) + pipe;

                        //    element.find('svg')[0].removeAttribute("style");
                        //    svgText = element.find('svg')[0].outerHTML;
                        //    svgText = svgText.replace(/\r?\n|\r/g,' ');
                        //    svgText = svgText.replace(/\t/g,'');
                    }

                    for (var k = 0; k < vm.back_design.length; k++) {
                        if (vm.back_design[k].type === 'text') {

                            var obj_ = vm.back_design[k];
                            // var _obj = _.findWhere(vm.graphics, {id:obj_.id});
                            var element = $('#box' + vm.back_design[k].z_index + "back");
                            var svg = element.children('svg')[0];
                            var view = svg.getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');

                            var svgText;

                            svgText = $('#box' + vm.back_design[k].z_index + "back text").clone()[0];



                            console.log(svgText);

                            svgText.children[0].setAttributeNS(null, 'x', parseInt(element.css('left')));
                            svgText.children[0].setAttributeNS(null, 'y', parseInt(element.css('top')));
                            svgText.children[0].setAttributeNS(null, 'width', parseInt(element.css('width')));
                            svgText.children[0].setAttributeNS(null, 'height', parseInt(element.css('height')));
                            svgParent1.appendChild(svgText);

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

                        if (vm.back_design[k].type === "svg" || vm.back_design[k].type === "img") {

                            var element = $('#box' + vm.back_design[k].z_index + "back");
                            var svgText;

                            svgText = element.find('image').clone()[0];
                            svgText.setAttributeNS(null, 'x', parseInt(element.css('left')));
                            svgText.setAttributeNS(null, 'y', parseInt(element.css('top')));
                            svgText.setAttributeNS(null, 'width', parseInt($('#box' + vm.back_design[k].z_index + "back svg").css('width')));
                            svgText.setAttributeNS(null, 'height', parseInt($('#box' + vm.back_design[k].z_index + "back svg").css('height')));

                            // console.log(svgText);
                            svgParent1.appendChild(svgText);


                            var obj_ = vm.back_design[k];
                            var _obj = _.findWhere(vm.graphics, { id: obj_.id });
                            //   debugger;
                            var element = $('#box' + vm.back_design[k].z_index + "back");
                            var svg = element.find('svg');
                            var view = svg[0].getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');
0
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

                            if(vm.back_design[k].type==="svg"){
                                svgObj.colors= _obj.colors
                            }

                            layers.push(svgObj);

                        }
                    }

                    console.log(svgParent1);

                    svgParent1 = svgParent1.outerHTML;
                    svgParent1 = svgParent1.replace(/\r?\n|\r/g, ' ');
                    svgParent1 = svgParent1.replace(/\t/g, '');
                    console.log(svgParent1);


                    var back = {
                        removeLayerBinding: {},
                        name: "back",
                        layers: layers,
                        colors: vm.total_back_colors,
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
                        // priorPrintableBox: parseInt(arr[0]) + "," + $("#box1back").parent().parent().parent().css('top').substr(0, $("#box1back").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
                        scaleAndMove: null,
                        rasterImageInfo: [],
                        
                    }

                    if(vm.back_design.length){
                        back.bbox= {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        };
                        back.absoluteBBox= {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        };
                        back.svg= svgParent1
                    }

                    sides.push(back);

                }

                if (i == 2) {

                    var svgParent2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgParent2.setAttribute('style', 'border: 1px solid black');
                    svgParent2.setAttribute('width', printableAreaWidthWithoutPX);
                    svgParent2.setAttribute('height', printableAreaHeightWithoutPX);
                    svgParent2.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                    svgParent2.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");

                    svgParent2.setAttributeNS(null, 'viewBox', '0 0 '+ printableAreaWidthWithoutPX +' '+ printableAreaHeightWithoutPX);
                    var layers = [];
                    for (var j = 0; j < vm.left_design.length; j++) {
                        var element = $('#box' + vm.left_design[j].z_index + "left");
                        var pipe = j == 0 ? "||" : "";
                        //svgText += _.escape(element.prop('outerHTML')) + pipe;

                        //    element.find('svg')[0].removeAttribute("style");
                        //    svgText = element.find('svg')[0].outerHTML;
                        //    svgText = svgText.replace(/\r?\n|\r/g,' ');
                        //    svgText = svgText.replace(/\t/g,'');
                    }

                    for (var k = 0; k < vm.left_design.length; k++) {
                        if (vm.left_design[k].type === 'text') {

                            var obj_ = vm.left_design[k];
                            // var _obj = _.findWhere(vm.graphics, {id:obj_.id});
                            var element = $('#box' + vm.left_design[k].z_index + "left");
                            var svg = element.children('svg')[0];
                            var view = svg.getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');

                            var svgText;

                            svgText = $('#box' + vm.left_design[k].z_index + "left text").clone()[0];



                            console.log(svgText);

                            svgText.children[0].setAttributeNS(null, 'x', parseInt(element.css('left')));
                            svgText.children[0].setAttributeNS(null, 'y', parseInt(element.css('top')));
                            svgText.children[0].setAttributeNS(null, 'width', parseInt(element.css('width')));0
                            svgText.children[0].setAttributeNS(null, 'height', parseInt(element.css('height')));
                            svgParent2.appendChild(svgText);
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

                        if (vm.left_design[k].type === "svg" || vm.left_design[k].type === "img") {

                            var element = $('#box' + vm.left_design[k].z_index + "left");
                            var svgText;

                            svgText = element.find('image').clone()[0];
                            svgText.setAttributeNS(null, 'x', parseInt(element.css('left')));
                            svgText.setAttributeNS(null, 'y', parseInt(element.css('top')));
                            svgText.setAttributeNS(null, 'width', parseInt($('#box' + vm.left_design[k].z_index + "left svg").css('width')));
                            svgText.setAttributeNS(null, 'height', parseInt($('#box' + vm.left_design[k].z_index + "left svg").css('height')));
                            svgParent2.appendChild(svgText);


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

                            if(vm.left_design[k].type==="svg"){
                                left.bbox= {
                                    x: parseInt(arr[0]),
                                    y: parseInt(arr[1]),
                                    width: parseInt(arr[2]),
                                    height: parseInt(arr[3]),
                                };
                                left.absoluteBBox= {
                                    x: parseInt(arr[0]),
                                    y: parseInt(arr[1]),
                                    width: parseInt(arr[2]),
                                    height: parseInt(arr[3]),
                                };
                                svgObj.colors= _obj.colors
                            }

                            layers.push(svgObj);

                        }
                    }

                    console.log(svgParent2);

                    svgParent2 = svgParent2.outerHTML;
                    svgParent2 = svgParent2.replace(/\r?\n|\r/g, ' ');
                    svgParent2 = svgParent2.replace(/\t/g, '');
                    console.log(svgParent2);


                    var left = {
                        removeLayerBinding: {},
                        name: "left",
                        layers: layers,
                        colors: vm.total_left_colors,
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
                        // priorPrintableBox: parseInt(arr[0]) + "," + $("#box1left").parent().parent().parent().css('top').substr(0, $("#box1left").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
                        scaleAndMove: null,
                        rasterImageInfo: [],
                        svg: svgParent2,


                    }

                    if(vm.left_design.length){
                        left.svg= svgParent2
                    }

                    sides.push(left);
                }

                if (i == 3) {

                    var printableAreaWidthWithoutPX = $('.printable-area').css('width').substr(0,$('.printable-area').css('width').length-2);
                    var printableAreaHeightWithoutPX = $('.printable-area').css('height').substr(0,$('.printable-area').css('height').length-2);
                    var svgParent3 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgParent3.setAttribute('style', 'border: 1px solid black');
                    svgParent3.setAttribute('width', printableAreaWidthWithoutPX);
                    svgParent3.setAttribute('height', printableAreaHeightWithoutPX);
                    svgParent3.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                    svgParent3.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
                    svgParent3.setAttributeNS(null, 'viewBox', '0 0 ' + printableAreaWidthWithoutPX +' '+  printableAreaHeightWithoutPX);

                    var layers = [];
                    for (var j = 0; j < vm.right_design.length; j++) {
                        var element = $('#box' + vm.right_design[j].z_index + "right");
                        var pipe = j == 0 ? "||" : "";
                        // svgText += _.escape(element.prop('outerHTML')) + pipe;

                        //      element.find('svg')[0].removeAttribute("style");
                        //    svgText = element.find('svg')[0].outerHTML;
                        //    svgText = svgText.replace(/\r?\n|\r/g,' ');
                        //    svgText = svgText.replace(/\t/g,'');
                    }

                    for (var k = 0; k < vm.right_design.length; k++) {
                        if (vm.right_design[k].type === 'text') {



                            var obj_ = vm.right_design[k];
                            // var _obj = _.findWhere(vm.graphics, {id:obj_.id});
                            var element = $('#box' + vm.right_design[k].z_index + "right");
                            var svg = element.children('svg')[0];
                            var view = svg.getAttributeNS(null, 'viewBox');
                            var arr = view.split(' ');

                            var svgText;

                            svgText = $('#box' + vm.right_design[k].z_index + "right text").clone()[0];


                            console.log(svgText);
                            svgText.children[0].setAttributeNS(null, 'x', parseInt(element.css('left')));
                            svgText.children[0].setAttributeNS(null, 'y', parseInt(element.css('top')));
                            svgText.children[0].setAttributeNS(null, 'width', parseInt(element.css('width')));
                            svgText.children[0].setAttributeNS(null, 'height', parseInt(element.css('height')));
                            svgParent3.appendChild(svgText);

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

                        if (vm.right_design[k].type === "svg" || vm.right_design[k].type === "img") {
                            var element = $('#box' + vm.right_design[k].z_index + "right");
                            var svgText;

                            svgText = element.find('image').clone()[0];
                            svgText.setAttributeNS(null, 'x', parseInt(element.css('left')));
                            svgText.setAttributeNS(null, 'y', parseInt(element.css('top')));
                            svgText.setAttributeNS(null, 'width', parseInt($('#box' + vm.right_design[k].z_index + "right svg").css('width')));
                            svgText.setAttributeNS(null, 'height', parseInt($('#box' + vm.right_design[k].z_index + "right svg").css('height')));
                            svgParent3.appendChild(svgText);

                            var obj_ = vm.right_design[k];
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

                              if(vm.right_design[k].type==="svg"){
                                svgObj.colors= _obj.colors
                            }

                            layers.push(svgObj);

                        }
                    }

                    console.log(svgParent3);

                    svgParent3 = svgParent3.outerHTML;
                    svgParent3 = svgParent3.replace(/\r?\n|\r/g, ' ');
                    svgParent3 = svgParent3.replace(/\t/g, '');
                    console.log(svgParent3);

                    var right = {
                        removeLayerBinding: {},
                        name: "right",
                        layers: layers,
                        colors: vm.total_right_colors,
                      
                        beingViewed: false,
                        initialFreeTransformAttrs: null,
                        initialPrintableArea: null,
                        referencePoint: {},
                        ppi: 18,
                        editable: null,
                        sequence: 2,
                        // priorPrintableBox: parseInt(arr[0]) + "," + $("#box1right").parent().parent().parent().css('top').substr(0, $("#box1right").parent().parent().parent().css('top').length - 2) + "," + parseInt(arr[2]) + ",240",
                        scaleAndMove: null,
                        rasterImageInfo: [],
                      

                    }

                     if(vm.right_design.length){
                        right.bbox= {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        };
                        right.absoluteBBox= {
                            x: parseInt(arr[0]),
                            y: parseInt(arr[1]),
                            width: parseInt(arr[2]),
                            height: parseInt(arr[3]),
                        };
                        right.svg= svgParent3
                    }

                    sides.push(right);
                }
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

        console.log(sides);
        compaign_json.design = JSON.stringify(design);
        compaign_json.priorPrintableArea = JSON.stringify({ "front": "152,100,220,330", "back": "155,60,215,330", "left": "155,60,215,330", "right": "155,60,215,330" });
        //console.log(JSON.stringify(compaign_json,null,4));


        //  var fd = objectToFormData(compaign_json);


        //console.log(fd);
        // var formData = new FormData();
        // formData.append('compaign_json', JSON.stringify(compaign_json));
        DashboardService.LaunchCompaign(compaign_json).then(function (data) {
            //console.clear();
            //     console.log(data);

                    if(data.code==210){
                    //  loginModal.$promise.then(loginModal.show);                    
                    $scope.show_login_form();
                    return;
                }
                else if(data.code==200){
                //  location = baseURL+data.data.campaign;
                //   location.reload(true);
            //  $http({method: 'GET', url: baseURL+data.data.campaign});
            window.location.href = serverURL+data.data.campaign;
                }
                else if(data.code==211){
                alert(data.message);
            // window.location.href = serverURL+data.data.campaign;
                }
                    console.log(data)


        });

    }


    vm.manage_colors = function(shirt){
            //    shirt.selected = false;
            vm.manage_colors_bool = true;
            vm.selectedModalShirt = shirt;
            angular.forEach(shirt.colors_available, function (color) {

                    for (var i = 0; i < vm.colors.length; i++) {
                        //   debugger;
                        var globalColor = vm.colors[i];
                        if (globalColor.id == color.color_id) {
                            color.color = "#" + globalColor.hex;
                        }
                    }

                });
                
                viewShirtColors.$promise.then(viewShirtColors.show);

        }

    vm.search_tees = function () {
        //    debugger;
        if (vm.tee_search_name) {
            //  window.location.href = ("www.google.com");
            window.location.assign(serverURL + "search?p=1&q=" + vm.tee_search_name);

        }


    }

    var objectToFormData = function (obj, form, namespace) {

        var fd = form || new FormData();
        var formKey;

        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {

                if (namespace) {
                    formKey = namespace + '[' + property + ']';
                } else {
                    formKey = property;
                }

                // if the property is an object, but not a File,
                // use recursivity.
                if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {

                    objectToFormData(obj[property], fd, property);

                } else {

                    // if it's a string or a File object
                    fd.append(formKey, obj[property]);
                }

            }
        }

        return fd;

    };

    // function validate_url() {
    //     if (vm.url && vm.url.length > 5)

    //         alert("URL is available and valid");

    // }


    // function build_url() {

    //     vm.url = vm.compaign_title.replace('/', '-');
    //     vm.url = vm.url.replace(/\s/g, '');

    // }


     $scope.startsWith = function(state, viewValue) {
       return state.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase();
    }

    function build_url() {

        vm.url = vm.compaign_title.replace('/', '-');
        vm.url = vm.url.replace(/\s/g, '');
        vm.url = vm.url.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

        //debugger;

        if (vm.url.charAt(vm.url.length - 1) == '-') {
            
            while(vm.url.charAt(vm.url.length - 1) == '-'){
            vm.url = vm.url.substring(0, vm.url.length - 1);
            //return;
        }
        return;
    }
        validate_url();
    }



   function validate_url() {

        if (!vm.url.length) {
            vm.url_available = false;
            return;
        }
        vm.url = vm.url.replace(/[^a-zA-Z0-9]/g, '-');
        if (vm.url.charAt(vm.url.length - 1) == '-') {
            vm.url = vm.url.substring(0, vm.url.length - 1);
            return;
        }
        vm.is_loading_url = true;
        setTimeout(function () {
            DashboardService.ValidateURL(vm.url).then(function (data) {
                //   debugger;
                vm.is_loading_url = false;
                if (data.data.available)
                    vm.url_available = true;
                else vm.url_available = false;
                // console.clear();
            });
        }, 500);



        // alert("URL is available and valid");

    }


    vm.register_user = function () {
        DashboardService.SignUp(vm.sign_up).then(function (data) {
            if (data.code != 200) {
                Alert(data.message);
            }
            else {
                sign_up_modal.$promise.then(sign_up_modal.hide);
                DashboardService.GetConfig().then(function (data) {
                    // debugger;
                    vm.user = {};
                    vm.user.pages = {};
                    vm.config = data.data;

                    //  vm.footer_pages = vm.config.pages;
                    if (vm.config.login.status == 1) {
                        vm.user.id = vm.config.login.id;
                        vm.user.name = vm.config.login.name;
                        vm.user.pages = vm.config.login.pages;
                    }



                });
                //  loadConfig(arg);
                Alert("Account created and you are now logged in!");

            }


        });


    }


    vm.show_shirts_modal = function(){
        if(vm.manage_colors_bool){
        vm.manage_colors_bool = false;

        }

        else  viewOptionsModal.$promise.then(viewOptionsModal.show);
            viewShirtColors.$promise.then(viewShirtColors.hide);
   }


    $scope.show_signUpForm = function () {
        loginModal.$promise.then(loginModal.hide);
        sign_up_modal.$promise.then(sign_up_modal.show);

    }

    $scope.show_login_form = function () {

        sign_up_modal.$promise.then(sign_up_modal.hide);
        loginModal.$promise.then(loginModal.show);


    }


    var loginModal = $modal({
        scope: $scope,
        animation: 'am-fade-and-scale',
        placement: 'center',
        template: 'NgApp/Home/VIews/login_modal.html',
        show: false,
        title: 'Login with teedesign'
    });


    var sign_up_modal = $modal({
        scope: $scope,
        animation: 'am-fade-and-scale',
        placement: 'center',
        template: 'NgApp/Home/VIews/sign_up_modal.html',
        show: false,
        title: 'Login with teedesign'
    });




    vm.login = function () {
        DashboardService.Login(vm.loginCred).then(function (data) {

            // debugger;
            if (data.code != 200) {
                Alert(data.message);
            }
            else {
                loginModal.$promise.then(loginModal.hide);
                DashboardService.GetConfig().then(function (data) {

                    vm.user = {};
                    vm.user.pages = {};
                    vm.config = data.data;


                    if (vm.config.login.status == 1) {
                        vm.user.id = vm.config.login.id;
                        vm.user.name = vm.config.login.name;
                        vm.user.pages = vm.config.login.pages;
                    }



                });
                launch_compaign();
                //  loadConfig(arg);
            }

        });
    }


    function remove_tag(index) {

        vm.tags.splice(index, 1);

    }

    
        function extract_tags(e) {
        //    debugger;
        if (!vm.raw_tags) return;


        if (vm.tags.length > 4) {
            Alert("Max 5 tags are allowed");
            return;
        }
        if (vm.raw_tags.slice(-1) == ',' && vm.raw_tags.length == 1) {
            vm.raw_tags = "";
            return;

        }
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

    vm.extract_tag_on_blur = function () {

        if (!vm.raw_tags) return;


        if (vm.tags.length > 4) {
            Alert("Max 5 tags are allowed");
            return;
        }
        if (vm.raw_tags.slice(-1) == ',' && vm.raw_tags.length == 1) {
            vm.raw_tags = "";
            return;

        }

        if (vm.raw_tags.slice(-1) == ',') {
            vm.tags.push(vm.raw_tags.substr(0, vm.raw_tags.length - 1));

            vm.raw_tags = "";
            return;
        }

        vm.tags.push(vm.raw_tags);
        vm.raw_tags = "";

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
        if(color.selected){

            if(vm.selectedModalShirt.id == vm.selectedShirt.id){
                    var selected_colors_num = _.where(vm.selectedModalShirt.colors_available, { selected: true }).length;
                    if(selected_colors_num==1) return;
            }

        }
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

        if(shirt.id==vm.selectedShirt.id) {shirt.selected=true;shirt.colors_available[0].selected=true;return;}

      //  viewOptionsModal.$promise.then(viewOptionsModal.hide);
        //   debugger;
        // angular.forEach(shirt.colors_available, function (color) {

        //     for (var i = 0; i < vm.colors.length; i++) {
        //         //   debugger;
        //         var globalColor = vm.colors[i];
        //         if (globalColor.id == color.color_id) {
        //             color.color = "#" + globalColor.hex;
        //         }
        //     }

        // });
       

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
        // setColor(shirt.colors_available[0]);
        shirt.colors_available[0].selected = true;
        count = _.where(shirt.colors_available, { selected: true }).length;
        vm.total_color_selected += count;
        var sould_be_selected = _.where(vm.selectedModalShirt.colors_available, { selected: true }).length;
        if (!sould_be_selected) vm.selectedModalShirt.selected = false;
      //  viewShirtColors.$promise.then(viewShirtColors.show);
    }

    function prepare_shirts() {




    }


    function is_available(shirt) {

        // if(vm.selectedShirt.id == shirt.id)
        // return false;
        return true;

    }



    vm.validate_goal_value = function(){
    
        if(!$scope.$$phase) $scope.$apply();
        if (vm.goal_target < vm.goal_range_min || vm.goal_target > vm.goal_range_max) {
                    //    debugger;
                        if (vm.goal_target < vm.goal_range_min)
                            vm.goal_target = vm.goal_range_min;
                        else vm.goal_target = vm.goal_range_max;
                        if (!$scope.$$phase) $scope.$apply();
                    }
                    if (!vm.goal_target) { vm.goal_target = vm.goal_range_min; if (!$scope.$$phase) $scope.$apply(); }


                    rotate_goal();


    }



     vm.quick_verify_goal = function(){
//debugger;
        vm.invalid_goal = false;

        if (vm.goal_target < vm.goal_range_min || vm.goal_target > vm.goal_range_max || !vm.goal_target) {

                vm.invalid_goal = true;
        }

    }

    function rotate_goal(arg) {



        $timeout(function () {
            //   debugger;
            if (vm.goal_target < vm.goal_range_min || vm.goal_target > vm.goal_range_max) {
                if (vm.goal_target < vm.goal_range_min)
                    vm.goal_target = vm.goal_range_min;
                else vm.goal_target = vm.goal_range_max;
                if (!$scope.$$phase) $scope.$apply();
            }
            if (!vm.goal_target) { vm.goal_target = vm.goal_range_min; if (!$scope.$$phase) $scope.$apply(); }
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

        }, 100);



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
            vm.is_uploading_file = true;
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
                       
                      //  debugger;
                      vm.is_uploading_file = false;

                        if(resp.data.code!=200){

                            Alert(resp.data.data);

                            return;

                        }

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
            title: 'Select Product'
    });

      var viewShirtColors = $modal({
            scope: $scope,
            animation: 'am-fade-and-scale',
            placement: 'center',
            template: 'NgApp/Home/VIews/setShirtColors.html',
            show: false,
            title: 'Select Colors'
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

        $scope.serverURL = serverURL;
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
        vm.selected_text.color = '#000000';
        vm.is_loading_graphics = false;
        search_query = '';

        $rootScope.target_state = 'home.create';
        $state.go('home.create');

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

   vm.validate_profit = function (profit, shirt) {
        //debugger;
        $timeout(function () {
           // debugger;

            if (profit && profit < 1) {
                shirt.profit = 1;
                


            }

             if (profit && profit > 10000) {
                shirt.profit = 10000;
                


            }
            if (!shirt.profit) shirt.profit = 1;

            vm.calculate_total_shirt_cost(shirt);

            if(!$scope.$$phase) $scope.$apply();

        }, 100);


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

        calculate_total_front_colors();

    }, true);

    function calculate_total_front_colors() {

        //  var front_colors = 0;
        vm.total_front_colors = [];
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
    }

    $scope.$watch('vm.back_design', function (newVal, oldVal) {
        if (newVal == oldVal) return;
        // debugger;

        calculate_total_back_colors();



    }, true);


    function calculate_total_back_colors() {
        vm.total_back_colors = [];
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


    $scope.$watch('vm.left_design', function (newVal, oldVal) {
        if (newVal == oldVal) return;
        // debugger;
        //  var front_colors = 0;
        calculate_total_left_colors();

    }, true);

    function calculate_total_left_colors() {
        vm.total_left_colors = [];
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

    $scope.$watch('vm.right_design', function (newVal, oldVal) {
        if (newVal == oldVal) return;
        // debugger;
        //  var front_colors = 0;
        calculate_total_right_colors();

    }, true);

    function calculate_total_right_colors() {
        vm.total_right_colors = [];
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

     $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams, options) {

            //  event.preventDefault();
            //debugger;


            if (get_total_design_count() <= 0) {
                Alert("Please design at least one side before going to next screen.");
                //$state.go('home.create');                 
                //$location.path("/home/create");

                event.preventDefault();
                $rootScope.target_state = 'home.create';
                //$state.transitionTo('home.create');
                return;

            }

            if (fromState.name == 'home.create') {

                if (toState.name == 'home.description') {

                    event.preventDefault();
                    $rootScope.target_state = 'home.goal';
                    $state.go('home.goal');
                    //Alert("You need to set the goal before you add description.");
                    Alert("You need to set the goal before you add description.");

                }


            }
        });

        function get_total_design_count(){

            var front_count = vm.front_design.length;
            var back_count = vm.back_design.length;
            var left_count = vm.left_design.length;
            var right_count = vm.right_design.length;



            var total = front_count+back_count+left_count+right_count;

            if(vm.selectedShirt.left==0){
                total = total-left_count;
            }

            if(vm.selectedShirt.right==0){
                total = total-right_count;
            }

            if(vm.selectedShirt.back==0){
                total = total-back_count;
            }

            return total;

        }


     $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams, options) {


            //  event.preventDefault(); 
            window.scrollTo(0, 0);
        });


        

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
        if (vm.selectedShirt)
            if (!arg && vm.selectedShirt.left != 1) {
                left = 0;
                right = 0;
                if (vm.selectedShirt.back != 1) back = 0;
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

                if(!vm.selectedShirt)  return;

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
             //   debugger;
                vm.profits.min = Number(values[0].total_profit);
                vm.profits.max = Number(values[values.length - 1].total_profit);
                if(isNaN(vm.profits.min)) vm.profits.min = 0;
                if(isNaN(vm.profits.max)) vm.profits.max = 0; 
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

        if (vm.default_tab == 1) {
            calculate_total_front_colors();


        }

        else if (vm.default_tab == 2) {
            calculate_total_back_colors();

        }

        else if (vm.default_tab == 3) {
            calculate_total_left_colors();

        }
        else if (vm.default_tab == 4) {
            calculate_total_right_colors();
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
                _.each(vm.shirts, function (shirt) {

                    var reg = /(.*)\.[^.]+$/
                    var front_thumb = reg.exec(shirt.image_front_url);
                    shirt.front_small = front_thumb[1] + "_small.png";

                });
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


   vm.select_products = function(){

       viewOptionsModal.$promise.then(viewOptionsModal.show);


   }



    function loadConfig(exclude_goals) {
        //   debugger;
        DashboardService.GetConfig().then(function (data) {
            //   debugger;
            vm.user = {};
            vm.user.pages = {};
            vm.config = data.data;
            if (!exclude_goals) {
                vm.goal_range_max = Number(vm.config.config.goal_range_max);
                vm.goal_range_min = Number(vm.config.config.goal_range_min);
                vm.goal_target = Number(vm.goal_range_min);
                rotate_goal(vm.goal_range_min);
            }

            vm.footer_pages = vm.config.pages;
            if (vm.config.login.status == 1) {
                vm.user.id = vm.config.login.id;
                vm.user.name = vm.config.login.name;
                vm.user.pages = vm.config.login.pages;




            }



        });
    }


    vm.hold_display = function () {
        vm.is_printable_area_visible = false;

        {

            setTimeout(function () {

                vm.is_printable_area_visible = true;
                if (!$scope.$$phase)
                    $scope.$apply();

            }, 3000);


        }
    }



 vm.confirm_profit_calculated = function(){

     _.each(vm.shirts_in_styles, function (shirt) {
                        if (shirt.id == vm.selectedShirt.id)
                            shirt.selected = true;
                        else shirt.selected = false;
                        if(!vm.shirt_color)
                        setColor(vm.filtered_colors[0]);
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

                console.log(z_index);

            //    _.each(vm.front_design.length,function(front){


            //         console.log(front.z_index,z_index);
                        
            //         //      if(front.z_index !== z_index){
            //         //        $('.printable-area').removeClass('crossing_border');
                         
            //         //      }
            //         //      else{

            //         //               window.setInterval(function (first,second) {
            //         // //console.log(currentSvg[0]);
            //         //                 if (!collision($("#box"+z_index+"front"), $('.printable-area'))) {
            //         //                     $('.printable-area').addClass('crossing_border');
            //         //                 }
            //         //                 else {

            //         //                     $('.printable-area').removeClass('crossing_border');

                            
                                    
            //         //                 }
            //         //             }, 200);

            //         //      }

            //             }) 

          

                

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
        if(vm.default_design_tab == 3){
            //vm.deselect_text();
          //  $scope.focus = false;

        
        }

        if(vm.default_design_tab === 3 || vm.default_design_tab === 4){
            angular.forEach(intervals, function(interval) {
                $interval.cancel(interval);
            });
            intervals.length = 0;
        }
    }

    function activate_tab(arg) {
        vm.default_tab = arg;
        if (arg === 2){
            vm.hide = true;        
        }

        if(arg===1){
            angular.forEach(intervals, function(interval) {
                $interval.cancel(interval);
            });
            intervals.length = 0;
           $('.printable-area').removeClass('crossing_border');

        }

        if (arg === 2 || arg === 3 || arg === 4) {

            $('.user-list').css({ 'visibility': 'hidden' });
            $('.user-box').removeClass('border');

            angular.forEach(intervals, function(interval) {
                $interval.cancel(interval);
            });
            intervals.length = 0;
           $('.printable-area').removeClass('crossing_border');

        }
    }
    function loadDefault() {

        //$state.transitionTo('home.create');

    }

    vm.deleteLayer = function (zindex) {

        if((!vm.front_design.length) || (!vm.back_design.length) || (!vm.left_design.length) || (!vm.right_design.length)){

            angular.forEach(intervals, function(interval) {
              $interval.cancel(interval);
            });
            intervals.length = 0;

        }

        if($(".printable-area").hasClass('crossing_border')){
            $(".printable-area").removeClass('crossing_border');
        }

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


        var intervals = []
      //  intervals.push($interval(function() { /*doStuff*/ }, /*timeout*/));
       // intervals.push($interval(function() { /*doDifferentStuff*/ }, /*timeout*/));


       

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

   // vm.front_interve_ids = [];

    vm.select_text = function (index, e) {



        if (vm.default_tab == 1) {

            _index = _.findIndex(vm.front_design, function (x) { return x.z_index == index });
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

                  
                    // if(front.type==="text"){
                        
                        
                    //       setTimeout(function(){
                    //           $scope.focus = true;
                    //       },0)
                        
                    //     //console.log($scope.focus)
                    // }

                    intervals.push($interval(function(){
                        if(!outsideCollision($("#box"+vm.selected_text.z_index+"front svg"),$('.printable-area'))){
                           vm.deleteLayer(front.z_index);
                        }
                    },200))
                intervals.push( $interval(function() {
                               if (!collision($("#box"+vm.selected_text.z_index+"front svg"), $('.printable-area'))) {
                            $('.printable-area').addClass('crossing_border');
                        }
                        else {

                            $('.printable-area').removeClass('crossing_border');
                        
                        }
                        }, 200))
//  setInterval(function () {
                
//                         if (!collision($("#box"+vm.selected_text.z_index+"front svg"), $('.printable-area'))) {
//                             $('.printable-area').addClass('crossing_border');
//                         }
//                         else {

//                             $('.printable-area').removeClass('crossing_border');
                        
//                         }
//                     }, 200);

                    console.log(vm.interval_id);
                    

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

                            $(this).css({
                                'top': parseInt(ui.position.top, 10) + ((ui.originalSize.height - ui.size.height)) / 2,
                                'left': parseInt(ui.position.left, 10) + ((ui.originalSize.width - ui.size.width)) / 2
                            });
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
                            // alert("Calleeed");
                            $('.printable-area').css({ 'overflow': 'visible' });
                        }
                    })
                        .rotatable(params, { handle: $('#box' + vm.selected_text.z_index + "front" + ' .icon-rotate-free') });
                    $('#box' + vm.selected_text.z_index + "front" + ' .rotate a').append($('#box' + vm.selected_text.z_index + "front" + ' .icon-rotate-free'));
                    var recoupLeft, recoupTop;
                    $('#box' + vm.selected_text.z_index + "front").draggable({
                         start: function (event, ui) {
                            var left = parseInt($(this).css('left'),10);
                            left = isNaN(left) ? 0 : left;
                            var top = parseInt($(this).css('top'),10);
                            top = isNaN(top) ? 0 : top;
                            recoupLeft = left - ui.position.left;
                            recoupTop = top - ui.position.top;
                        },
                        cancel: '.delete,.drag',
                        drag: function (e, ui) {
                            $('.printable-area').css({ 'overflow': 'hidden' });
                            y2 = ui.position.top;
                            x2 = ui.position.left;
                            ui.position.left += recoupLeft;
                            ui.position.top += recoupTop;
                            var printableWidth = $('.printable-area').width()+20;
                            //  console.log(printableWidth, x2);
                            if (x2 > printableWidth) {
                                // alert("Crossing Boundries");
                                // $('.printable-holder').addClass('crossing_border');
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
            _index = _.findIndex(vm.back_design, function (x) { return x.z_index == index });
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
                    
                

                intervals.push($interval(function(){
                        if(!outsideCollision($("#box"+vm.selected_text.z_index+"back svg"),$('.printable-area'))){
                           vm.deleteLayer(front.z_index);
                        }
                    },200))

                    intervals.push($interval(function(){
                        if(!outsideCollision($("#box"+vm.selected_text.z_index+"back svg"),$('.printable-area'))){
                           vm.deleteLayer(front.z_index);
                        }
                    },200))
                 
                     intervals.push( $interval(function() {
                               if (!collision($("#box"+vm.selected_text.z_index+"back svg"), $('.printable-area'))) {
                            $('.printable-area').addClass('crossing_border');
                        }
                        else {

                            $('.printable-area').removeClass('crossing_border');
                        
                        }
                        }, 200))

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

                            $(this).css({
                                'top': parseInt(ui.position.top, 10) + ((ui.originalSize.height - ui.size.height)) / 2,
                                'left': parseInt(ui.position.left, 10) + ((ui.originalSize.width - ui.size.width)) / 2
                            });

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
                    var recoupLeft, recoupTop;
                    $('#box' + vm.selected_text.z_index + "back").draggable({
                        start: function (event, ui) {
                            var left = parseInt($(this).css('left'),10);
                            left = isNaN(left) ? 0 : left;
                            var top = parseInt($(this).css('top'),10);
                            top = isNaN(top) ? 0 : top;
                            recoupLeft = left - ui.position.left;
                            recoupTop = top - ui.position.top;
                        },
                        cancel: '.delete,.drag',
                        drag: function (e, ui) {
                            $('.printable-area').css({ 'overflow': 'hidden' });
                            y2 = ui.position.top;
                            x2 = ui.position.left;
                            ui.position.left += recoupLeft;
                            ui.position.top += recoupTop;
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
            _index = _.findIndex(vm.left_design, function (x) { return x.z_index == index });

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

                    intervals.push($interval(function(){
                        if(!outsideCollision($("#box"+vm.selected_text.z_index+"left svg"),$('.printable-area'))){
                           vm.deleteLayer(front.z_index);
                        }
                    },200))

                     intervals.push( $interval(function() {
                               if (!collision($("#box"+vm.selected_text.z_index+"left svg"), $('.printable-area'))) {
                            $('.printable-area').addClass('crossing_border');
                        }
                        else {

                            $('.printable-area').removeClass('crossing_border');
                        
                        }
                        }, 200))

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

                            $(this).css({
                                'top': parseInt(ui.position.top, 10) + ((ui.originalSize.height - ui.size.height)) / 2,
                                'left': parseInt(ui.position.left, 10) + ((ui.originalSize.width - ui.size.width)) / 2
                            });

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
                    var recoupLeft, recoupTop;
                    $('#box' + vm.selected_text.z_index + "left").draggable({
                        start: function (event, ui) {
                            var left = parseInt($(this).css('left'),10);
                            left = isNaN(left) ? 0 : left;
                            var top = parseInt($(this).css('top'),10);
                            top = isNaN(top) ? 0 : top;
                            recoupLeft = left - ui.position.left;
                            recoupTop = top - ui.position.top;
                        },
                        cancel: '.delete,.drag',
                        drag: function (e, ui) {
                            $('.printable-area').css({ 'overflow': 'hidden' });
                            y2 = ui.position.top;
                            x2 = ui.position.left;
                            ui.position.left += recoupLeft;
                            ui.position.top += recoupTop;
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
            _index = _.findIndex(vm.right_design, function (x) { return x.z_index == index });
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

                    intervals.push($interval(function(){
                        if(!outsideCollision($("#box"+vm.selected_text.z_index+"right svg"),$('.printable-area'))){
                           vm.deleteLayer(front.z_index);
                        }
                    },200))
                     intervals.push( $interval(function() {
                               if (!collision($("#box"+vm.selected_text.z_index+"right svg"), $('.printable-area'))) {
                            $('.printable-area').addClass('crossing_border');
                        }
                        else {

                            $('.printable-area').removeClass('crossing_border');
                        
                        }
                        }, 200))

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

                            $(this).css({
                                'top': parseInt(ui.position.top, 10) + ((ui.originalSize.height - ui.size.height)) / 2,
                                'left': parseInt(ui.position.left, 10) + ((ui.originalSize.width - ui.size.width)) / 2
                            });

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
                    var recoupLeft, recoupTop;
                    $('#box' + vm.selected_text.z_index + "right").draggable({
                        start: function (event, ui) {
                            var left = parseInt($(this).css('left'),10);
                            left = isNaN(left) ? 0 : left;
                            var top = parseInt($(this).css('top'),10);
                            top = isNaN(top) ? 0 : top;
                            recoupLeft = left - ui.position.left;
                            recoupTop = top - ui.position.top;
                        },
                        cancel: '.delete,.drag',
                        drag: function (e, ui) {
                            $('.printable-area').css({ 'overflow': 'hidden' });
                            y2 = ui.position.top;
                            x2 = ui.position.left;
                            ui.position.left += recoupLeft;
                            ui.position.top += recoupTop;
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
        angular.forEach(intervals, function(interval) {
           $interval.cancel(interval);
        });
        intervals.length = 0;
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

                console.log(text[0]);

                var $w = parseInt(text[0].getBoundingClientRect().width)+10;
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
                    "color": "rgb(0,0,0)",
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
                    "color": "rgb(0,0,0)",
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
                    "color": "rgb(0,0,0)",
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
                    "color": "rgb(0,0,0)",
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








    var AnimationServiceModule = angular.module('AnimationModule', []);
        AnimationServiceModule.service('AnimationService', AnimationService);



    function AnimationService() {

        var animations = [
            "bounce",
            "flash",
            "pulse",
            "rubberBand",
            "shake",
            "headShake",
            "swing",
            "tada",
            "wobble",
            "jello",
            "bounceIn",
            "bounceInDown",
            "bounceInLeft",
            "bounceInRight",
            "bounceInUp",
            "bounceOut",
            "bounceOutDown",
            "bounceOutLeft",
            "bounceOutRight",
            "bounceOutUp",
            "fadeIn",
            "fadeInDown",
            "fadeInDownBig",
            "fadeInLeft",
            "fadeInLeftBig",
            "fadeInRight",
            "fadeInRightBig",
            "fadeInUp",
            "fadeInUpBig",
            "fadeOut",
            "fadeOutDown",
            "fadeOutDownBig",
            "fadeOutLeft",
            "fadeOutLeftBig",
            "fadeOutRight",
            "fadeOutRightBig",
            "fadeOutUp",
            "fadeOutUpBig",
            "flipInX",
            "flipInY",
            "flipOutX",
            "flipOutY",
            "lightSpeedIn",
            "lightSpeedOut",
            "rotateIn",
            "rotateInDownLeft",
            "rotateInDownRight",
            "rotateInUpLeft",
            "rotateInUpRight",
            "rotateOut",
            "rotateOutDownLeft",
            "rotateOutDownRight",
            "rotateOutUpLeft",
            "rotateOutUpRight",
            "hinge",
            "rollIn",
            "rollOut",
            "zoomIn",
            "zoomInDown",
            "zoomInLeft",
            "zoomInRight",
            "zoomInUp",
            "zoomOut",
            "zoomOutDown",
            "zoomOutLeft",
            "zoomOutRight",
            "zoomOutUp",
            "slideInDown",
            "slideInLeft",
            "slideInRight",
            "slideInUp",
            "slideOutDown",
            "slideOutLeft",
            "slideOutRight",
            "slideOutUp"
        ];


        var  getRandonAnimation = function(arg) {
            arg = arg || 1;
            var valid = false;
            if (arg == 1) { //NO OUT ANIMATIONS
                do {
                    var num = getRandomInt(1, animations.length);
                    var animation = animations[num];
                    if(animation.indexOf('Out') != -1)
                        valid = true;

                }
                while(!valid);

        }
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var service = {
            GetRandomInAnimation: function() {
                
                var animation = "";
            var valid = false;
         
                do {
                    var num = getRandomInt(1, animations.length);
                     animation = animations[num];
                     if(!animation) return;
                    if(animation.indexOf('Out') == -1)
                        valid = true;

                }
                while(!valid);
                return animation;

        
        },
        GetRandomOutAnimation: function() {
                
                var animation = "";
            var valid = false;
         
                do {
                    var num = getRandomInt(1, animations.length);
                     animation = animations[num];
                    if(animation.indexOf('In') == -1)
                        valid = true;

                }
                while(!valid);
                return animation;

        
        },
        GetRandomAnimation: function() {
                var animation = "";
            
                    var num = getRandomInt(1, animations.length);
                     animation = animations[num];
                        valid = true;

                
                return animation;

        
        }
            

        };

        return service;

    }





    var HttpServiceModule = angular.module('HttpServiceModule',[])
        HttpServiceModule.service('HttpService', HttpService);

    HttpService.$inject = ['$q', '$http'];

    function HttpService($q, $http) {

   

        var _Get = function (url, reqData) {
            return _SendRequest('GET', url, reqData);

        }

        // var _Post = function (url, reqData) {

        //     return _SendRequest('POST', url, reqData);

        // };
       
        var _Post = function (url, reqData) {
            
            return _SendRequest('POST', url, reqData);

        };

        var _Put = function (url, reqData) {

            return _SendRequest('PUT', url, reqData);

        };

        var _Delete = function (url, reqData) {
           
            return _SendRequest('Delete', url, reqData);

        }

        //var _Delete = function (url, reqData,header) {
        //    //console.log("reqData " + reqData);
        //    return _SendRequest('Delete', url, reqData,header);

        //}

     //Removed Header from parameter.

        var _SendRequest = function (method, url, reqData) {

            var req = "";
          
            req = {
                'method': method,

                'url': baseURL + url,

                'data': reqData,
            

                'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
               },
            };


            var deferred = $q.defer();

          //  var headers = {};

            // if (header) {
            //     headers['Content-Type'] = undefined;
            // }
            // else {
            //     headers['Content-Type'] = 'application/json';
            // }


           // req['headers'] = {'Content-Type': 'application/x-www-form-urlencoded'};

            var _successCallback = function (data) {
                deferred.resolve(data);
            };

            var _errorCallback = function (data) {

            };



            console.log("API URl " + req.url);
            console.log("Req " + JSON.stringify(req.data));

            $http(req)
                .success(_successCallback)
                .error(_errorCallback);

            return deferred.promise;
        };

        var service = {
            Get: _Get,
            Post: _Post,
            Put: _Put,
            Delete: _Delete
        }

        return service;

    }





    var dashboardService = angular.module('DashboardModule')
        dashboardService.service('DashboardService', DashboardService);

    DashboardService.$inject = ['$q', '$http', 'HttpService','$timeout'];

    function DashboardService($q, $http, HttpService, $timeout) {

        var key = 'fstky2e4mdt';

        var _GetGraphics = function () {

            var deferred = $q.defer();

            HttpService.Post("/art_random", {'key':key})
                .then(function (data) {
                  
                    deferred.resolve(data);
                    return deferred.promise;
                }, function (err) {
                deferred.reject(err);
                return deferred.promise;
            });
            return deferred.promise;
        };

        var _GetShirtStyle = function () {

            var deferred = $q.defer();

            HttpService.Post("/styles", {'key':key})
                .then(function (data) {
                  console.log(data);
                    deferred.resolve(data);
                    return deferred.promise;
                }, function (err) {
                deferred.reject(err);
                return deferred.promise;
            });
            return deferred.promise;
        };
 
        var _GetFonts = function () {

            var deferred = $q.defer();

            HttpService.Post("/fonts", {'key':key})
                .then(function (data) {
                  
                    deferred.resolve(data);
                    return deferred.promise;
                }, function (err) {
                deferred.reject(err);
                return deferred.promise;
            });
            return deferred.promise;
        };

        var _GetConfig = function () {

            var deferred = $q.defer();

            HttpService.Post("/config", {'key':key})
                .then(function (data) {
                  
                    deferred.resolve(data);
                    return deferred.promise;
                }, function (err) {
                deferred.reject(err);
                return deferred.promise;
            });
            return deferred.promise;
        };

         var _GetSvg = function (url) {

              var deferred = $q.defer();

            $http.get(url).then(function(data) {
                // process response here..
                deferred.resolve(data);
                return deferred.promise;
                }, function(err) {

                deferred.reject(err);
                return deferred.promise;
            });

            return deferred.promise;
        };

        var _GetColors = function () {

            var deferred = $q.defer();

            HttpService.Post("/colors", {'key':key})
                .then(function (data) {
                  
                    deferred.resolve(data);
                    return deferred.promise;
                }, function (err) {
                deferred.reject(err);
                return deferred.promise;
            });
            return deferred.promise;
        };

        var _GetGoogleFonts = function () {

           var fonts =  [
                            // {
                            //     "family": "ABeeZee",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Abel",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Abril Fatface",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            {
                                "family": "Aclonica",
                                "category": "sans-serif",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v6",
                                "lastModified": "2015-04-06"
                            },
                            // {
                            //     "family": "Acme",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Actor",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            {
                                "family": "Adamina",
                                "category": "serif",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v7",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Advent Pro",
                                "category": "sans-serif",
                                "variants": [
                                    "100",
                                    "200",
                                    "300",
                                    "regular",
                                    "500",
                                    "600",
                                    "700"
                                ],
                                "version": "v4",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Aguafina Script",
                                "category": "handwriting",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v5",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Akronim",
                                "category": "display",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v5",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Aladin",
                                "category": "handwriting",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v5",
                                "lastModified": "2015-04-06"
                            },
                            // {
                            //     "family": "Aldrich",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Alef",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-08"
                            // },
                            // {
                            //     "family": "Alegreya",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Alegreya SC",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            {
                                "family": "Alegreya Sans",
                                "category": "sans-serif",
                                "variants": [
                                    "100",
                                    "100italic",
                                    "300",
                                    "300italic",
                                    "regular",
                                    "italic",
                                    "500",
                                    "500italic",
                                    "700",
                                    "700italic",
                                    "800",
                                    "800italic",
                                    "900",
                                    "900italic"
                                ],
                                "version": "v3",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Alegreya Sans SC",
                                "category": "sans-serif",
                                "variants": [
                                    "100",
                                    "100italic",
                                    "300",
                                    "300italic",
                                    "regular",
                                    "italic",
                                    "500",
                                    "500italic",
                                    "700",
                                    "700italic",
                                    "800",
                                    "800italic",
                                    "900",
                                    "900italic"
                                ],
                                "version": "v3",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Alex Brush",
                                "category": "handwriting",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v6",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Alfa Slab One",
                                "category": "display",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v5",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Alice",
                                "category": "serif",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v7",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Alike",
                                "category": "serif",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v7",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Alike Angular",
                                "category": "serif",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v6",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Allan",
                                "category": "display",
                                "variants": [
                                    "regular",
                                    "700"
                                ],
                                "version": "v7",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Allerta",
                                "category": "sans-serif",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v7",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Allerta Stencil",
                                "category": "sans-serif",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v7",
                                "lastModified": "2015-04-06"
                            },
                            {
                                "family": "Allura",
                                "category": "handwriting",
                                "variants": [
                                    "regular"
                                ],
                                "version": "v4",
                                "lastModified": "2015-04-06"
                            },
                            // {
                            //     "family": "Almendra",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Almendra Display",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Almendra SC",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Amarante",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Amaranth",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Amatic SC",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-07-22"
                            // },
                            // {
                            //     "family": "Amethysta",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Amiri",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Amita",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-03"
                            // },
                            // {
                            //     "family": "Anaheim",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Andada",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Andika",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Angkor",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Annie Use Your Telescope",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Anonymous Pro",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Antic",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Antic Didone",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Antic Slab",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Anton",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Arapey",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Arbutus",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Arbutus Slab",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Architects Daughter",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Archivo Black",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Archivo Narrow",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Arimo",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-28"
                            // },
                            // {
                            //     "family": "Arizonia",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Armata",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Artifika",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Arvo",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Arya",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-05-21"
                            // },
                            // {
                            //     "family": "Asap",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Asar",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-17"
                            // },
                            // {
                            //     "family": "Asset",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Astloch",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Asul",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Atomic Age",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Aubrey",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Audiowide",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Autour One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Average",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Average Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Averia Gruesa Libre",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Averia Libre",
                            //     "category": "display",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Averia Sans Libre",
                            //     "category": "display",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Averia Serif Libre",
                            //     "category": "display",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bad Script",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Balthazar",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bangers",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Basic",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Battambang",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Baumans",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bayon",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Belgrano",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Belleza",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "BenchNine",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bentham",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Berkshire Swash",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bevan",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bigelow Rules",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Bigshot One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bilbo",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bilbo Swash Caps",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Biryani",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "200",
                            //         "300",
                            //         "regular",
                            //         "600",
                            //         "700",
                            //         "800",
                            //         "900"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-22"
                            // },
                            // {
                            //     "family": "Bitter",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Black Ops One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bokor",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bonbon",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Boogaloo",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bowlby One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bowlby One SC",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Brawler",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bree Serif",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bubblegum Sans",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Bubbler One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Buda",
                            //     "category": "display",
                            //     "variants": [
                            //         "300"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Buenard",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Butcherman",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Butterfly Kids",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cabin",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "500",
                            //         "500italic",
                            //         "600",
                            //         "600italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cabin Condensed",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cabin Sketch",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Caesar Dressing",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cagliostro",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Calligraffitti",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cambay",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Cambo",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Candal",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cantarell",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cantata One",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cantora One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Capriola",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cardo",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Carme",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Carrois Gothic",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Carrois Gothic SC",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Carter One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Caudex",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cedarville Cursive",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ceviche One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Changa One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Chango",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Chau Philomene One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Chela One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Chelsea Market",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Chenla",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Cherry Cream Soda",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cherry Swash",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Chewy",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Chicle",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Chivo",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cinzel",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700",
                            //         "900"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cinzel Decorative",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700",
                            //         "900"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Clicker Script",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Coda",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "800"
                            //     ],
                            //     "version": "v10",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Coda Caption",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "800"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Codystar",
                            //     "category": "display",
                            //     "variants": [
                            //         "300",
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Combo",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Comfortaa",
                            //     "category": "display",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Coming Soon",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Concert One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Condiment",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Content",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Contrail One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Convergence",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cookie",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Copse",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Corben",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Courgette",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cousine",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v10",
                            //     "lastModified": "2015-04-28"
                            // },
                            // {
                            //     "family": "Coustard",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "900"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Covered By Your Grace",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Crafty Girls",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Creepster",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Crete Round",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Crimson Text",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "600",
                            //         "600italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Croissant One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Crushed",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cuprum",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cutive",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Cutive Mono",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Damion",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Dancing Script",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Dangrek",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Dawning of a New Day",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Days One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Dekko",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v2",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Delius",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Delius Swash Caps",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Delius Unicase",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Della Respira",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Denk One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Devonshire",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Dhurjati",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Didact Gothic",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Diplomata",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-03-20"
                            // },
                            // {
                            //     "family": "Diplomata SC",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Domine",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Donegal One",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Doppio One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Dorsa",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Dosis",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "200",
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700",
                            //         "800"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Dr Sugiyama",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Droid Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Droid Sans Mono",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Droid Serif",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Duru Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Dynalight",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "EB Garamond",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Eagle Lake",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Eater",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Economica",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Eczar",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700",
                            //         "800"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-03"
                            // },
                            // {
                            //     "family": "Ek Mukta",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "200",
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700",
                            //         "800"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Electrolize",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Elsie",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "900"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Elsie Swash Caps",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "900"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Emblema One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Emilys Candy",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Engagement",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Englebert",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Enriqueta",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Erica One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Esteban",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Euphoria Script",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ewert",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Exo",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "100",
                            //         "100italic",
                            //         "200",
                            //         "200italic",
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "500",
                            //         "500italic",
                            //         "600",
                            //         "600italic",
                            //         "700",
                            //         "700italic",
                            //         "800",
                            //         "800italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Exo 2",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "100",
                            //         "100italic",
                            //         "200",
                            //         "200italic",
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "500",
                            //         "500italic",
                            //         "600",
                            //         "600italic",
                            //         "700",
                            //         "700italic",
                            //         "800",
                            //         "800italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v3",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Expletus Sans",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "500",
                            //         "500italic",
                            //         "600",
                            //         "600italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fanwood Text",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fascinate",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Fascinate Inline",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Faster One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fasthand",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Fauna One",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Federant",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Federo",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Felipa",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fenix",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Finger Paint",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fira Mono",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v3",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fira Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "500",
                            //         "500italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fjalla One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fjord One",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Flamenco",
                            //     "category": "display",
                            //     "variants": [
                            //         "300",
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Flavors",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Fondamento",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fontdiner Swanky",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Forum",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Francois One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Freckle Face",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fredericka the Great",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fredoka One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Freehand",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fresca",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Frijole",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Fruktur",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Fugaz One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "GFS Didot",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "GFS Neohellenic",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gabriela",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gafata",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Galdeano",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Galindo",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gentium Basic",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gentium Book Basic",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Geo",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Geostar",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Geostar Fill",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Germania One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gidugu",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v3",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Gilda Display",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Give You Glory",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Glass Antiqua",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Glegoo",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gloria Hallelujah",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Goblin One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gochi Hand",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gorditas",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Goudy Bookletter 1911",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Graduate",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Grand Hotel",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gravitas One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Great Vibes",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Griffy",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gruppo",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gudea",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Gurajada",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Habibi",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Halant",
                            //     "category": "serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-01"
                            // },
                            // {
                            //     "family": "Hammersmith One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Hanalei",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Hanalei Fill",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Handlee",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Hanuman",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Happy Monkey",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Headland One",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Henny Penny",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Herr Von Muellerhoff",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Hind",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Holtwood One SC",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Homemade Apple",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Homenaje",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "IM Fell DW Pica",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "IM Fell DW Pica SC",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "IM Fell Double Pica",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "IM Fell Double Pica SC",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "IM Fell English",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "IM Fell English SC",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "IM Fell French Canon",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "IM Fell French Canon SC",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "IM Fell Great Primer",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "IM Fell Great Primer SC",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Iceberg",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Iceland",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Imprima",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Inconsolata",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v11",
                            //     "lastModified": "2015-05-14"
                            // },
                            // {
                            //     "family": "Inder",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Indie Flower",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Inika",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Inknut Antiqua",
                            //     "category": "serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700",
                            //         "800",
                            //         "900"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-11"
                            // },
                            // {
                            //     "family": "Irish Grover",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Istok Web",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v10",
                            //     "lastModified": "2015-06-11"
                            // },
                            // {
                            //     "family": "Italiana",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Italianno",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Jacques Francois",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Jacques Francois Shadow",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Jaldi",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v2",
                            //     "lastModified": "2015-06-10"
                            // },
                            // {
                            //     "family": "Jim Nightshade",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Jockey One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Jolly Lodger",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Josefin Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "100",
                            //         "100italic",
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "600",
                            //         "600italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Josefin Slab",
                            //     "category": "serif",
                            //     "variants": [
                            //         "100",
                            //         "100italic",
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "600",
                            //         "600italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Joti One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Judson",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Julee",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Julius Sans One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-22"
                            // },
                            // {
                            //     "family": "Junge",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Jura",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Just Another Hand",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Just Me Again Down Here",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kadwa",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-17"
                            // },
                            // {
                            //     "family": "Kalam",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kameron",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kantumruy",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v3",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Karla",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Karma",
                            //     "category": "serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kaushan Script",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kavoon",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kdam Thmor",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v3",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Keania One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kelly Slab",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kenia",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Khand",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Khmer",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Khula",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "600",
                            //         "700",
                            //         "800"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kite One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Knewave",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kotta One",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Koulen",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v10",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kranky",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kreon",
                            //     "category": "serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kristi",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Krona One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Kurale",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-05-14"
                            // },
                            // {
                            //     "family": "La Belle Aurore",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Laila",
                            //     "category": "serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-01"
                            // },
                            // {
                            //     "family": "Lakki Reddy",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v3",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Lancelot",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Lateef",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v10",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Lato",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "100",
                            //         "100italic",
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v11",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "League Script",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Leckerli One",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ledger",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Lekton",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Lemon",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Libre Baskerville",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Life Savers",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Lilita One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Lily Script One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Limelight",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Linden Hill",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Lobster",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v15",
                            //     "lastModified": "2015-07-21"
                            // },
                            // {
                            //     "family": "Lobster Two",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Londrina Outline",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Londrina Shadow",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Londrina Sketch",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Londrina Solid",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Lora",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Love Ya Like A Sister",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Loved by the King",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Lovers Quarrel",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Luckiest Guy",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Lusitana",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Lustria",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Macondo",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Macondo Swash Caps",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Magra",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Maiden Orange",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Mako",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Mallanna",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Mandali",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Marcellus",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Marcellus SC",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Marck Script",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Margarine",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Marko One",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Marmelad",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Martel",
                            //     "category": "serif",
                            //     "variants": [
                            //         "200",
                            //         "300",
                            //         "regular",
                            //         "600",
                            //         "700",
                            //         "800",
                            //         "900"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-22"
                            // },
                            // {
                            //     "family": "Martel Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "200",
                            //         "300",
                            //         "regular",
                            //         "600",
                            //         "700",
                            //         "800",
                            //         "900"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Marvel",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Mate",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Mate SC",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Maven Pro",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "500",
                            //         "700",
                            //         "900"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "McLaren",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Meddon",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-08"
                            // },
                            // {
                            //     "family": "MedievalSharp",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Medula One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Megrim",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Meie Script",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Merienda",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Merienda One",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Merriweather",
                            //     "category": "serif",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Merriweather Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic",
                            //         "800",
                            //         "800italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Metal",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Metal Mania",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Metamorphous",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Metrophobic",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Michroma",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Milonga",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Miltonian",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Miltonian Tattoo",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Miniver",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Miss Fajardose",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Modak",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Modern Antiqua",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Molengo",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Molle",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Monda",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Monofett",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Monoton",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Monsieur La Doulaise",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Montaga",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Montez",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Montserrat",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Montserrat Alternates",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Montserrat Subrayada",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Moul",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Moulpali",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Mountains of Christmas",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Mouse Memoirs",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Mr Bedfort",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Mr Dafoe",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Mr De Haviland",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Mrs Saint Delafield",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Mrs Sheppards",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Muli",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Mystery Quest",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "NTR",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Neucha",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Neuton",
                            //     "category": "serif",
                            //     "variants": [
                            //         "200",
                            //         "300",
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "800"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "New Rocker",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "News Cycle",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v13",
                            //     "lastModified": "2015-04-16"
                            // },
                            // {
                            //     "family": "Niconne",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nixie One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nobile",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nokora",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Norican",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nosifer",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nothing You Could Do",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Noticia Text",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Noto Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Noto Serif",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nova Cut",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nova Flat",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nova Mono",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nova Oval",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nova Round",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nova Script",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nova Slim",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nova Square",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Numans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Nunito",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Odor Mean Chey",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Offside",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Old Standard TT",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Oldenburg",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Oleo Script",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Oleo Script Swash Caps",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Open Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "600",
                            //         "600italic",
                            //         "700",
                            //         "700italic",
                            //         "800",
                            //         "800italic"
                            //     ],
                            //     "version": "v13",
                            //     "lastModified": "2015-05-18"
                            // },
                            // {
                            //     "family": "Open Sans Condensed",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "700"
                            //     ],
                            //     "version": "v10",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Oranienbaum",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Orbitron",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "500",
                            //         "700",
                            //         "900"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Oregano",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Orienta",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Original Surfer",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Oswald",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v10",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Over the Rainbow",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Overlock",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Overlock SC",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ovo",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Oxygen",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Oxygen Mono",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "PT Mono",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "PT Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "PT Sans Caption",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "PT Sans Narrow",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "PT Serif",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "PT Serif Caption",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Pacifico",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Palanquin",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "100",
                            //         "200",
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-22"
                            // },
                            // {
                            //     "family": "Palanquin Dark",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-22"
                            // },
                            // {
                            //     "family": "Paprika",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Parisienne",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Passero One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Passion One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700",
                            //         "900"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Pathway Gothic One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Patrick Hand",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v10",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Patrick Hand SC",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Patua One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Paytone One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Peddana",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Peralta",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Permanent Marker",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Petit Formal Script",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Petrona",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Philosopher",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Piedra",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Pinyon Script",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Pirata One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Plaster",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Play",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Playball",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Playfair Display",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v10",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Playfair Display SC",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Podkova",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Poiret One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Poller One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Poly",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Pompiere",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Pontano Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Poppins",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-03"
                            // },
                            // {
                            //     "family": "Port Lligat Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Port Lligat Slab",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Pragati Narrow",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v2",
                            //     "lastModified": "2015-06-10"
                            // },
                            // {
                            //     "family": "Prata",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Preahvihear",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Press Start 2P",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Princess Sofia",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Prociono",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Prosto One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Puritan",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Purple Purse",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Quando",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Quantico",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Quattrocento",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Quattrocento Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Questrial",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Quicksand",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Quintessential",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Qwigley",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Racing Sans One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Radley",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rajdhani",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Raleway",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "100",
                            //         "200",
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700",
                            //         "800",
                            //         "900"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Raleway Dots",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ramabhadra",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Ramaraja",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Rambla",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rammetto One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ranchers",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rancho",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ranga",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Rationale",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ravi Prakash",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v3",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Redressed",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Reenie Beanie",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Revalia",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rhodium Libre",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-03"
                            // },
                            // {
                            //     "family": "Ribeye",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ribeye Marrow",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Righteous",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Risque",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Roboto",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "100",
                            //         "100italic",
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "500",
                            //         "500italic",
                            //         "700",
                            //         "700italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v15",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Roboto Condensed",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v13",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Roboto Mono",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "100",
                            //         "100italic",
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "500",
                            //         "500italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-05-28"
                            // },
                            // {
                            //     "family": "Roboto Slab",
                            //     "category": "serif",
                            //     "variants": [
                            //         "100",
                            //         "300",
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rochester",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rock Salt",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rokkitt",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Romanesco",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ropa Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rosario",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v10",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rosarivo",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rouge Script",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rozha One",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v2",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Rubik",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "500",
                            //         "500italic",
                            //         "700",
                            //         "700italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-07-22"
                            // },
                            // {
                            //     "family": "Rubik Mono One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-07-22"
                            // },
                            // {
                            //     "family": "Rubik One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-07-22"
                            // },
                            // {
                            //     "family": "Ruda",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700",
                            //         "900"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rufina",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ruge Boogie",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Ruluko",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rum Raisin",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ruslan Display",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Russo One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ruthie",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Rye",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sacramento",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sahitya",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-17"
                            // },
                            // {
                            //     "family": "Sail",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Salsa",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sanchez",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sancreek",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sansita One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sarala",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-17"
                            // },
                            // {
                            //     "family": "Sarina",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sarpanch",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700",
                            //         "800",
                            //         "900"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Satisfy",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Scada",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Scheherazade",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v10",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Schoolbell",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Seaweed Script",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sevillana",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Seymour One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Shadows Into Light",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Shadows Into Light Two",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Shanti",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Share",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Share Tech",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Share Tech Mono",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-07-22"
                            // },
                            // {
                            //     "family": "Shojumaru",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Short Stack",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Siemreap",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sigmar One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Signika",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Signika Negative",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Simonetta",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sintony",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sirin Stencil",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Six Caps",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Skranji",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Slabo 13px",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v3",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Slabo 27px",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v3",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Slackey",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Smokum",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Smythe",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sniglet",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "800"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Snippet",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Snowburst One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sofadi One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sofia",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sonsie One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sorts Mill Goudy",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Source Code Pro",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "200",
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700",
                            //         "900"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Source Sans Pro",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "200",
                            //         "200italic",
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "600",
                            //         "600italic",
                            //         "700",
                            //         "700italic",
                            //         "900",
                            //         "900italic"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Source Serif Pro",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Special Elite",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Spicy Rice",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Spinnaker",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Spirax",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Squada One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sree Krushnadevaraya",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Stalemate",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Stalinist One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-07-23"
                            // },
                            // {
                            //     "family": "Stardos Stencil",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Stint Ultra Condensed",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Stint Ultra Expanded",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Stoke",
                            //     "category": "serif",
                            //     "variants": [
                            //         "300",
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Strait",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sue Ellen Francisco",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sumana",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-05-04"
                            // },
                            // {
                            //     "family": "Sunshiney",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Supermercado One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Sura",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-17"
                            // },
                            // {
                            //     "family": "Suranna",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Suravaram",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v3",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Suwannaphum",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Swanky and Moo Moo",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Syncopate",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Tangerine",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Taprom",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Tauri",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Teko",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Telex",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Tenali Ramakrishna",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v3",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Tenor Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Text Me One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "The Girl Next Door",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Tienne",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "700",
                            //         "900"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Tillana",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700",
                            //         "800"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-03"
                            // },
                            // {
                            //     "family": "Timmana",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-04-07"
                            // },
                            // {
                            //     "family": "Tinos",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-28"
                            // },
                            // {
                            //     "family": "Titan One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Titillium Web",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "200",
                            //         "200italic",
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "600",
                            //         "600italic",
                            //         "700",
                            //         "700italic",
                            //         "900"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Trade Winds",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Trocchi",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Trochut",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Trykker",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Tulpen One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ubuntu",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "300",
                            //         "300italic",
                            //         "regular",
                            //         "italic",
                            //         "500",
                            //         "500italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ubuntu Condensed",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ubuntu Mono",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Ultra",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Uncial Antiqua",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Underdog",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Unica One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "UnifrakturCook",
                            //     "category": "display",
                            //     "variants": [
                            //         "700"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "UnifrakturMaguntia",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Unkempt",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Unlock",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Unna",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "VT323",
                            //     "category": "monospace",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Vampiro One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Varela",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Varela Round",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Vast Shadow",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Vesper Libre",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "500",
                            //         "700",
                            //         "900"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-06-03"
                            // },
                            // {
                            //     "family": "Vibur",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Vidaloka",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Viga",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Voces",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Volkhov",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v8",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Vollkorn",
                            //     "category": "serif",
                            //     "variants": [
                            //         "regular",
                            //         "italic",
                            //         "700",
                            //         "700italic"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Voltaire",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Waiting for the Sunrise",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Wallpoet",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Walter Turncoat",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Warnes",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-03"
                            // },
                            // {
                            //     "family": "Wellfleet",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Wendy One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v4",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Wire One",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Work Sans",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "100",
                            //         "200",
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "600",
                            //         "700",
                            //         "800",
                            //         "900"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-07-22"
                            // },
                            // {
                            //     "family": "Yanone Kaffeesatz",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "200",
                            //         "300",
                            //         "regular",
                            //         "700"
                            //     ],
                            //     "version": "v7",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Yantramanav",
                            //     "category": "sans-serif",
                            //     "variants": [
                            //         "100",
                            //         "300",
                            //         "regular",
                            //         "500",
                            //         "700",
                            //         "900"
                            //     ],
                            //     "version": "v1",
                            //     "lastModified": "2015-06-03"
                            // },
                            // {
                            //     "family": "Yellowtail",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Yeseva One",
                            //     "category": "display",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v9",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Yesteryear",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v5",
                            //     "lastModified": "2015-04-06"
                            // },
                            // {
                            //     "family": "Zeyada",
                            //     "category": "handwriting",
                            //     "variants": [
                            //         "regular"
                            //     ],
                            //     "version": "v6",
                            //     "lastModified": "2015-04-06"
                            // }
                        ]
        return fonts;

        };

        var _GetCategories = function () {

            var deferred = $q.defer();

            HttpService.Post("/categories", {'key':key})
                .then(function (data) {
                  
                    deferred.resolve(data);
                    return deferred.promise;
                }, function (err) {
                deferred.reject(err);
               
        });
         return deferred.promise;
    };
    var _SearchArts = function (query, page) {

            var deferred = $q.defer();

            HttpService.Post("/art_search", {'key':key, 'page':page, 'query':query })
                .then(function (data) {
                  
                    deferred.resolve(data);
                    return deferred.promise;
                }, function (err) {
                deferred.reject(err);
               
        });
         return deferred.promise;
    };

     var _LaunchCompaign = function (obj) {

            var deferred = $q.defer();
            obj.key = key;
            HttpService.Post("/save", obj,{'key':key})
                .then(function (data) {
                  
                    deferred.resolve(data);
                    return deferred.promise;
                }, function (err) {
                deferred.reject(err);
               
        });
         return deferred.promise;
    };

    
    var _signUp = function (obj) {

            var deferred = $q.defer();
            obj.key = key;
            HttpService.Post("/signup", obj,{'key':key})
                .then(function (data) {
                  
                    deferred.resolve(data);
                    return deferred.promise;
                }, function (err) {
                deferred.reject(err);
               
        });
         return deferred.promise;
    }
    var _login = function (obj) {

            var deferred = $q.defer();
            obj.key = key;
            HttpService.Post("/login",obj)
                .then(function (data) {
                  
                    deferred.resolve(data);
                    return deferred.promise;
                }, function (err) {
                deferred.reject(err);
               
        });
         return deferred.promise;
    };
 
    var _validateUrl = function (url) {

            var deferred = $q.defer();

            HttpService.Post("/available", {'key':key, 'url':url})
                .then(function (data) {
                  
                    deferred.resolve(data);
                    return deferred.promise;
                }, function (err) {
                deferred.reject(err);
               
        });
         return deferred.promise;
    };
 
        var services = {

            GetGraphics: _GetGraphics,
            GetShirtStyle:_GetShirtStyle,
            GetFonts:_GetFonts,
            GetGoogleFonts:_GetGoogleFonts,
            GetColors : _GetColors,
            GetConfig: _GetConfig,
            GetSvg:_GetSvg,
            GetCategories: _GetCategories,
            SearchArts:_SearchArts,
            LaunchCompaign :_LaunchCompaign,
            SignUp: _signUp,
            Login: _login,
            ValidateURL: _validateUrl
            
   

        };
        return services;


    }





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
     'oitozero.ngSweetAlert'


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

   app.directive( 'emHeightSource', [ '$window', function(  $window ) {
    return {
        link: function( scope, elem, attrs ){

           var win = angular.element($window);
           win.bind("resize",function(e){

              console.log("WIdttthhh",elem.css('width'));
              console.log("height",elem.css('height'));
              // Your relevant code here...

           })
        }
    }    
   } ] );
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


var utils = angular.module('teedesign');

//utils.constant("OidcTokenManager", OidcTokenManager);

//utils.constant('_', window._);

utils.factory('_', function () {
    return window._; // assumes underscore has already been loaded on the page
});