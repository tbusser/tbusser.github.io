(function(root, factory) {
	'use strict';
	root.responseUtil = factory();
}(this, function() {
	'use strict';

	var _response;



	/* ====================================================================== *\
		PRIVATE METHODS
	\* ====================================================================== */
	function getContextByIndex(index) {
		if (_response == null) {
			return null;
		}

		if (_response.result == null || _response.result.contexts == null) {
			return null;
		}

		index = index || 0;
		if (index >= _response.result.contexts.length) {
			return null;
		}

		return _response.result.contexts[index];
	}
	/* == PRIVATE METHODS =================================================== */



	/* ====================================================================== *\
		PUBLIC API
	\* ====================================================================== */
	function getAction() {
		if (!hasAction()) {
			return null;
		}

		return _response.result.action;
	}

	function getContext(contextId) {
		if (_response == null) {
			return null;
		}

		if (_response.result == null || _response.result.contexts == null) {
			return null;
		}

		var index = 0,
			ubound = _response.result.contexts.length;

		for (; index < ubound; index++) {
			if (_response.result.contexts[index].name === contextId) {
				return _response.result.contexts[index];
			}
		}

		return null;
	}

	function getContextParameter(parameter, contextId) {
		var context;
		if (contextId) {
			context = getContext(contextId);
		} else {
			context = getContextByIndex(0);
		}

		if (context === null) {
			return undefined;
		}

		return context.parameters[parameter];
	}

	function getSpeechResponse() {
		if (_response == null || _response.result == null || _response.result.fulfillment == null) {
			return null;
		}

		return _response.result.fulfillment.speech;
	}

	function hasAction() {
		if (_response == null || _response.result == null || _response.result.action == null) {
			return false;
		}

		return _response.result.action !== '';
	}

	function hasContext(contextId) {
		return (getContext(contextId) !== null);
	}

	function setResponse(response) {
		_response = response;
	}
	/* == PUBLIC API ======================================================== */



	return {
		getAction           : getAction,
		getContext          : getContext,
		getContextParameter : getContextParameter,
		getSpeechResponse   : getSpeechResponse,
		hasAction           : hasAction,
		hasContext          : hasContext,
		setResponse         : setResponse
	};
}));
