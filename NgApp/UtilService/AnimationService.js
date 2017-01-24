
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


