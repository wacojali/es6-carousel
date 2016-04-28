import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngTouch from 'angular-touch';
import template from './carousel.html';
import './carousel.scss';

class carousel {
    constructor($scope) {

        this.currentIndex = 0;
        this.data = $scope.data;
        $scope.moveNext = this.moveNext.bind(this);
        $scope.movePrev = this.movePrev.bind(this);
        $scope.isLast = this.isLast.bind(this);
        $scope.isFirst = this.isFirst.bind(this);

        $scope.$watch('itemWidth', function(newVal, oldVal){
            this.updateDimensions(newVal);
        }.bind(this));
    }

    movePrev() {
        if (this.data.length > 0 && this.currentIndex > 0) {
            this.currentIndex--;
        }
    }

    moveNext() {
        if (this.data.length > 0 && this.currentIndex < this.data.length - 1) {
            this.currentIndex++;
        }
    }

    isLast() {
        return this.currentIndex === this.data.length - 1;
    }

    isFirst() {
        return this.currentIndex === 0;
    }

    getListElementStyle(index) {
        var a = {
            display: 'inline-block',
            transform: 'translateX(' + ((index - this.currentIndex) * this.widthValue) + this.widthUnit + ')',
            width: this.widthValue + this.widthUnit,
            'padding-right': '8px'
        }

        return a;
    }

    updateDimensions(itemWidth) {
        // get the unit if specified
        var parts = itemWidth ? itemWidth.match(/(^[0-9]{1,})(\%$|px$|em$)/) : ['', '100', '%'];
        this.widthValue = parts[1];
        this.widthUnit = parts[2];
    }
}

carousel.$inject = ['$scope'];

export default angular.module('carouselComponentModule', [
    ngAnimate,
    ngTouch
]).directive( 'carousel', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            data: '=',
            moveNext: '=',
            movePrev: '=',
            isFirst: '=',
            isLast: '=',
            itemWidth: '=',
            eventHash: '='
        },
        template: template,
        controller: carousel,
        controllerAs: 'vm'
    }
}).directive('inject', function() {
    return {
        link: function($scope, $element, $attrs, controller, $transclude) {
            if (!$transclude) {
                throw ('Illegal use of ngTransclude directive in the template! ' +
                'No parent directive that requires a transclusion found. ' +
                'Element: ' + angular.startingTag($element));
            }
            var innerScope = $scope.$new();
            innerScope.eventHash = $scope.eventHash;
            $transclude(innerScope, function(clone) {
                $element.empty();
                $element.append(clone);
                $element.on('$destroy', function() {
                    innerScope.$destroy();
                });
            });
        }
    };
}).name;
