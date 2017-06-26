/*
* rwdImageMaps AngularJS Directive v1.0
*
* Allows image maps to be used in a responsive design by recalculating the area coordinates to match the actual image size on load and window.resize
*
* Original Copyright (c) 2013 Matt Stow
* https://github.com/stowball/jQuery-rwdImageMaps
* http://mattstow.com
* Licensed under the MIT license
*
* angular-rwdImageMaps.js (by Philip Saa)
* https://github.com/cowglow/
* @cowglow
*/

angular.module('rwdImageMaps',[])
    .directive('rwdimgmap', ['$window', function($window){
        return{
            restrict: 'CA',
            link: function(scope, elements, attrs){
                var element = elements[0];
                element.addEventListener('load', function() {
                    var clone = new Image();
                    clone.src = element.src || element.getAttribute('ng-src');
                    // Once element.ngSrc is resolved, we can load a clone image
                    clone.addEventListener('load', function() {
                        // Once the clone is loaded, we can retrieve the original image width
                        var w = clone.width;
                        var h = clone.height;

                        function resize(){
                            var wPercent = $(element).width()/100,
                                hPercent = $(element).height()/100,
                                map = attrs.usemap.replace('#', ''),
                                c = 'coords';

                            angular.element('map[name="' + map + '"]').find('area').each(function(){
                                var $this = $(this);

                                if (!$this.data(c)){
                                    $this.data(c, $this.attr(c));
                                }

                                var coords = $this.data(c).split(','),
                                    coordsPercent = new Array(coords.length);

                                for (var i = 0; i<coordsPercent.length; ++i){
                                    if (i % 2 === 0){
                                        coordsPercent[i] = parseInt(((coords[i]/w)*100)*wPercent);
                                    } else {
                                        coordsPercent[i] = parseInt(((coords[i]/h)*100)*hPercent);
                                    };
                                };
                                $this.attr(c, coordsPercent.toString());
                            });
                        }
                        angular.element($window).on('resize', function() {
                            resize();
                        });
                        resize();
                    });
                });
            }
        };
    }]);
