/**
 * Cajas - CSS Animated JavaScript Slider
 *
 * @copyright 2015, Lauri Tunnela (http://tunne.la)
 * @license http://tunne.la/MIT.txt The MIT License
 */

;!function(window, document, $, undefined) {

	"use strict";

	var transitionEnd = function(el) {
		var transEndEventNames = {
			WebkitTransition: 'webkitTransitionEnd',
			MozTransition: 'transitionend',
			OTransition: 'oTransitionEnd otransitionend',
			transition: 'transitionend'
		};

		for (var name in transEndEventNames) {
			if (typeof el.style[name] !== 'undefined') {
				return transEndEventNames[name];
			}
		}
	    return false;
	}

	if (!Function.prototype.bind) {
		Function.prototype.bind = function(oThis) {
			if (typeof this !== 'function') {
				throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}
			var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function() {},
			fBound = function() {
				return fToBind.apply(this instanceof fNOP
				? this
				: oThis,
				aArgs.concat(Array.prototype.slice.call(arguments)));
			};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}

	var element, slides = [], controls = [], options = [], 
	childElements, childElement, id, transitionEndEvent, item, 
	elements = document.getElementsByTagName('*'),
	addEvent = function(element, event, fn) {
		if (element.addEventListener) {
			element.addEventListener(event, fn, false);
		} else {
			element.attachEvent("on" + event, function() {
				return fn.call(element, window.event);   
			});
		}
	},
	group = 0,
	onTransitionEnd = function() {
		var group = this.group;
	};
	
	for (var i = 0, n = elements.length; i < n; i++) {
		element = elements[i];

		if (element.getAttribute('cajas') !== null) {
			var slideIndex = 0, controlIndex = 0,
			duration = element.getAttribute('cajas-duration');

			if (duration === null) {
				duration = 5000;
			}
			childElements = element.getElementsByTagName('*');

			for (var j = 0, m = childElements.length; j < m; j++) {
				childElement = childElements[j];

				if (childElement.getAttribute('cajas-slide') !== null) {
					if (typeof options[group] === 'undefined') {
						options[group] = { 
							index: null, transitionCount: 0, transitionMax: 0
						};
					}
					if (typeof slides[group] === 'undefined') {
						slides[group] = [];
					}
					if (childElement.getAttribute('cajas-active') !== null) {
						options[group].index = slideIndex;
					}
					item = slides[group][slideIndex] = { 
						index: slideIndex, element: childElement, 
						group: group, transitionEvent: transitionEnd(childElement), 
						duration: childElement.getAttribute('cajas-duration') 
					};

					if (item.duration === null) {
						item.duration = duration;
					}
					if (item.transitionEvent) {
						addEvent(childElement, item.transitionEvent, onTransitionEnd.bind(item));
					}
					slideIndex++;
				}
				if (childElement.getAttribute('cajas-control') !== null) {
					if (typeof controls[group] === 'undefined') {
						controls[group] = [];
					}
					controls[group][controlIndex] = { index: controlIndex++, element: childElement, group: group };
				}
			}
			group++;
		}
	}
	if (!slides) {
		return;
	}
	var	inActivate = function(group) {
		var slideCount = slides[group].length, element;

		for (var i = 0; i < slideCount; i++) {
			element = slides[group][i].element;
			element.removeAttribute('cajas-active');
			element.removeAttribute('cajas-inactive');

			if (typeof controls[group][i] !== 'undefined') {
				element = controls[group][i].element;
				element.removeAttribute('cajas-active');
				element.removeAttribute('cajas-inactive');
			}
		}
	},
	timer = null,
	resetTimer = function() {
		clearTimeout(timer);
		timer = null;
	},
	onClick = function() {
		var group = this.group;	

		if (timer !== null && options[group].index === this.index) {
			return;
		}
		resetTimer();

		inActivate(group);

		var element, currentIndex = options[group].index;
		options[group].index = this.index;

		if (currentIndex !== null) {
			element = slides[group][currentIndex].element;
			element.removeAttribute('cajas-active');
			element.setAttribute('cajas-inactive', true);

			if (typeof controls[group][currentIndex] !== 'undefined') {
				element = controls[group][currentIndex].element;
				element.removeAttribute('cajas-active');
				element.setAttribute('cajas-inactive', true);
			}
		}
		element = this.element;
		element.setAttribute('cajas-active', true);

		if (typeof controls[group][this.index] !== 'undefined') {
			element = controls[group][this.index].element;
			element.setAttribute('cajas-active', true);
		}
		var nextSlide;

		if ((this.index + 1) >= slides[group].length) {
			nextSlide = slides[group][0];
		} else {
			nextSlide = slides[group][this.index + 1];
		}
		timer = setTimeout(onClick.bind(nextSlide), this.duration);
	},
	slideGroupCount = slides.length, callable;

	for (var i = 0, n = slideGroupCount; i < n; i++) {
		var slideCount = slides[i].length,
		currentIndex = options[i].index;

		if (currentIndex === null) {
			currentIndex = 0;
		}
		for (var j = 0, m = slideCount; j < m; j++) {
			if (slides[i][j].index === currentIndex) {
				callable = onClick.bind(slides[i][j]);
				callable();
			}
			if (typeof controls[i] !== 'undefined' && typeof controls[i][j] !== 'undefined') {
				addEvent(controls[i][j].element, 'click', onClick.bind(slides[i][j]));
			}
		}
	}

}(window, document, window.Zepto || window.jQuery);