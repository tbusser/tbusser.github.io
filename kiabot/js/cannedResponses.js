(function(root, factory) {
	'use strict';
	root.cannedResponses = factory();
}(this, function() {
	'use strict';

	var responses = {
		done  : [
			'Oké, ik heb geen verdere vragen voor je. Dit is het einde van de demo.',
			'Bedankt voor al je antwoorden. De demo is afgerond.',
			'Dit is het einde van de demonstratie. Bedankt voor je interesse.'
		],
		rephraseGeneral : [
			'Sorry, I didn\'t understand you? Can you please repeat'
		],
		start : [
			'Hallo, ik ben Alex. Voor wie wil je iets vragen, jezelf of iemand anders?',
			'Hallo, mijn naam is Alex. Voor ik je advies kan geven moet ik eerst weten voor wie het is. Wil je advies voor jezelf of voor iemand anders?'
		]
	};



	/* ====================================================================== *\
		PRIVATE METHODS
	\* ====================================================================== */
	function getRandomIndex(ubound) {
		return Math.floor(Math.random() * ubound);
	}
	/* == PRIVATE METHODS =================================================== */



	/* ====================================================================== *\
		PUBLIC API
	\* ====================================================================== */
	function getResponse(responseId) {
		var responseOptions = responses[responseId];

		if (responseOptions == null || responseOptions.length === 0) {
			return null;
		}

		// When there is only one possible response we can just return it
		// straight away
		if (responseOptions.length === 1) {
			return responseOptions[0];
		}

		// Get a random index
		var index = getRandomIndex(responseOptions.length);
		// Return the response at the random index
		return responseOptions[index];
	}
	/* == PUBLIC API ======================================================== */



	return {
		getResponse : getResponse
	};
}));
