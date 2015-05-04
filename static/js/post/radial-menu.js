(function() {
	'use strict';

	function openOrCloseMenu(event) {
		var elem = event.currentTarget;
		if (hasClass(elem.parentElement, 'open')){
			removeClass(elem.parentElement, 'open');
		} else {
			addClass(elem.parentElement, 'open');
		}
	}

	function addClass(elem, className) {
		if (!hasClass(elem, className)) {
			elem.className += ' ' + className;
		}
	}

	function hasClass(elem, className) {
		return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
	}

	function removeClass(elem, className) {
		var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
		if (hasClass(elem, className)) {
			while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
				newClass = newClass.replace(' ' + className + ' ', ' ');
			}
			elem.className = newClass.replace(/^\s+|\s+$/g, '');
		}
	}

	var triggers = document.querySelectorAll('[data-index="0"]');
	for (var index=0, ubound=triggers.length; index<ubound; index++) {
		triggers[index].addEventListener('click', openOrCloseMenu.bind(this), false);
	}
})();