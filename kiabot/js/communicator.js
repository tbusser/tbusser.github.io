/* global $ */
(function(root, factory) {
	'use strict';
	root.communicator = factory($);
}(this, function($) {
	'use strict';

	var _clearContext = false,
		_agentId = null,
		_baseURL = 'https://api.api.ai/v1/',
		_sessionId = generateUUID(),
		_apiVersion = '20160601';



	/* ====================================================================== *\
		PRIVATE METHODS
	\* ====================================================================== */
	/**
	 * http://stackoverflow.com/a/2117523/1244780
	 */
	function generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}
	/* == PRIVATE METHODS =================================================== */



	/* ====================================================================== *\
		PUBLIC API
	\* ====================================================================== */
	function addContext(contextId, lifespan) {
		var data = JSON.stringify({
			lifespan      : lifespan,
			name          : contextId
		});

		return $.ajax({
			contentType : 'application/json',
			data        : data,
			dataType    : 'json',
			headers     : { 'Authorization' : 'Bearer ' + _agentId },
			type        : 'POST',
			url         : _baseURL + 'contexts?v=' + _apiVersion + '&sessionId=' + _sessionId
		});
	}

	function clearContextOnNextRequest() {
		_clearContext = true;
	}

	function sendQuery(query) {
		var data = JSON.stringify({
			query         : query,
			lang          : 'NL',
			resetContexts : _clearContext,
			sessionId     : _sessionId
		});

		_clearContext = false;

		return $.ajax({
			contentType : 'application/json',
			data        : data,
			dataType    : 'json',
			headers     : { 'Authorization' : 'Bearer ' + _agentId },
			type        : 'POST',
			url         : _baseURL + 'query?v=' + _apiVersion
		});
	}

	function setAgentId(agentId) {
		_agentId = agentId;
	}
	/* == PUBLIC API ======================================================== */



	return {
		addContext                : addContext,
		clearContextOnNextRequest : clearContextOnNextRequest,
		sendQuery                 : sendQuery,
		setAgentId                : setAgentId
	};
}));
