/* global $, Promise */
(function(root, factory) {
	'use strict';
	root.chat = factory($, root.responseUtil, root.communicator, root.cannedResponses);
}(this, function($, responseUtil, communicator, cannedResponses) {
	'use strict';

	var chatInputForm = document.querySelector('form'),
		chatInputField = chatInputForm.querySelector('input'),
		chatLog = document.querySelector('.chat-messages__log'),
		chatBusy = document.querySelector('.chat-messages__typing-indicator'),
		chatSubmit = document.querySelector('.chat__input__send-button'),
		submitDisabled = true,
		config = {
			accessToken    : '4f3c073828d14645ac2454480275336c',
			attrDirection  : 'data-incoming',
			cssHidden      : 'is-hidden',
			cssDisplayNone : 'u-display--none'
		};



	/* ====================================================================== *\
		HELPER METHODS
	\* ====================================================================== */
	function appendMessageElement(messageElement) {
		chatLog.insertBefore(messageElement, chatBusy);
		moveLastMessageIntoView();
		messageElement.classList.remove('is-hidden');
	}

	function constructMessageElement(messageText, isIncoming) {
		var container = document.createElement('li'),
			innerItem = document.createElement('div');

		// Setup the message container element
		container.classList.add('chat-messages__message');
		container.classList.add('is-hidden');
		container.setAttribute(config.attrDirection, isIncoming.toString());

		// Setup the element holding the actual text
		innerItem.classList.add('chat-messages__bubble');
		innerItem.innerHTML = messageText;
		container.appendChild(innerItem);

		return container;
	}

	function disableSubmit() {
		chatSubmit.setAttribute('disabled', 'disabled');
		submitDisabled = true;
	}

	function enableSubmit() {
		chatSubmit.removeAttribute('disabled');
		submitDisabled = false;
	}

	function hideBusyIndicator() {
		return new Promise(function(resolve, reject) {
			var onTransitionEndHandler = function() {
				// Remove the event listener
				chatBusy.removeEventListener('transitionend', onTransitionEndHandler);
				// Apply the CSS class on the busy indicator to make sure it no
				// longer takes up space in the layout
				chatBusy.classList.add(config.cssDisplayNone);
				// Resolve the promise
				resolve();
			};

			// Attach an event listener so we will be notified when the
			// transition is done
			chatBusy.addEventListener('transitionend', onTransitionEndHandler);
			// When we apply the class immediately after attaching the event
			// listener we never get the event. A short delay is needed, we use
			// rAF to do this for us
			requestAnimationFrame(function() {
				chatBusy.classList.add(config.cssHidden);
			});
		});
	}

	function isNullOrEmpty(value) {
		if (value == null) {
			return true;
		}

		if (typeof value === 'string') {
			return value.trim() === '';
		}

		return false;
	}

	function showBusyIndicator() {
		return new Promise(function(resolve, reject) {
			var onTransitionEndHandler = function(event) {
				// Make sure the transition end event is for our busy indicator
				if (event.currentTarget !== chatBusy) {
					return;
				}
				// Remove the event listener
				chatBusy.removeEventListener('transistionend', onTransitionEndHandler);
				// Resolve the promise
				resolve();
			};

			chatBusy.classList.remove(config.cssDisplayNone);
			chatBusy.addEventListener('transistionend', onTransitionEndHandler);
			requestAnimationFrame(function() {
				moveLastMessageIntoView();
				chatBusy.classList.remove(config.cssHidden);
			});
		});
	}

	function moveLastMessageIntoView() {
		chatLog.scrollTop = chatLog.scrollHeight - chatLog.clientHeight;
	}
	/* == HELPER METHODS ==================================================== */



	/* ====================================================================== *\
		CHAT FLOW
	\* ====================================================================== */
	function preflightPregnancy() {
		var gender = responseUtil.getContextParameter('gender'),
			age = parseInt(responseUtil.getContextParameter('age'), 10);

		if (gender == null || gender !== 'female') {
			logMessage(cannedResponses.getResponse('done'), true);
			return;
		}

		if (isNaN(age) || age < 13 || age >= 55) {
			logMessage(cannedResponses.getResponse('done'), true);
			return;
		}

		communicator.addContext('determine-own-is-pregnant', 5).done(function(response) {
			if (responseUtil.hasContext('1st-person')) {
				logMessage('Bent u zwanger?', true);
			} else {
				var name = responseUtil.getContextParameter('name');
				logMessage('Is ' + name + ' zwanger? Dit kan van invloed zijn op het advies.', true);
			}
		}).fail(function(error) {
			console.log(error);
		});
	}

	function showImage(response) {
		var imageUrl = '<a class="image-link" href="images/help-image.png" target="_blank"><img src="images/help-image.png"/></a>';
		logMessage(imageUrl, true);
	}
	/* == CHAT FLOW ========================================================= */

	function checkForFollowUp(response) {
		if (!responseUtil.hasAction()) {
			return;
		}

		switch(responseUtil.getAction()) {
		case 'preflight-pregnancy':
			preflightPregnancy();
			break;

		case 'show-image':
			showImage(response);
			break;
		}
	}

	function logMessage(messageText, isIncoming) {
		// Make sure there is a message text to show
		if (isNullOrEmpty(messageText)) {
			return;
		}

		var message,
			sentences = [];
		if (isIncoming) {
			if (typeof messageText === 'string') {
				sentences = messageText.split(/(?:\.|\?)\s/g);
			} else {
				sentences = messageText;
			}
			message = sentences.splice(0, 1)[0];
		} else {
			message = messageText;
		}

		// Construct the HTML structure to show the message in the log
		var messageElement = constructMessageElement(message, isIncoming);

		// When the message is outgoing we don't have to show a busy indicator
		// first. We can just append the message to the log and we're done
		if (!isIncoming) {
			appendMessageElement(messageElement);
			return;
		}

		// The message is incoming, we will first show a busy indicator to give
		// the illusion someone else is typing a message
		showBusyIndicator();
		// Set a timeout, based on the length of the message we've received.
		// When the timeout is done we will hide the busy indicator and show the
		// message we've received from the server
		setTimeout(function() {
			hideBusyIndicator().then(function() {
				appendMessageElement(messageElement);
				if (isIncoming && sentences.length > 0) {
					logMessage(sentences, true);
				}
			});
		}, message.length * 45);
	}

	/* ====================================================================== *\
		EVENT HANDLERS
	\* ====================================================================== */
	function sendMessage(message) {
		communicator.sendQuery(message).done(function(response) {
			responseUtil.setResponse(response);
			var returnMessage = responseUtil.getSpeechResponse();
			if (isNullOrEmpty(returnMessage) && !responseUtil.hasAction()) {
				returnMessage = cannedResponses.getResponse('rephraseGeneral');
			}
			logMessage(returnMessage, true);
			checkForFollowUp(response);
			console.log(response);
		}).fail(function(error) {
			console.log(error);
		});
	}

	function onSendChatMessage(event) {
		// We don't want to actually submit the form, just call the api.ai
		// service with an AJAX call. Prevent the submit
		event.preventDefault();

		if (chatInputField.value.trim() === '') {
			return;
		}

		var text = chatInputField.value;
		chatInputField.value = '';
		disableSubmit();
		logMessage(text, false);

		sendMessage(text);
	}

	function onUserInputChangedHandler(event) {
		var hasInput = chatInputField.value.trim() !== '';

		if (hasInput && submitDisabled) {
			enableSubmit();
		} else if (!hasInput && !submitDisabled) {
			disableSubmit();
		}
	}
	/* == EVENT HANDLERS ==================================================== */



	function init() {
		// Make sure we have all the required elements for this module to be
		// able to do its work
		if (chatInputForm === null || chatLog === null || chatInputField === null || chatSubmit === null) {
			return;
		}

		// Setup the event listeners
		chatInputForm.addEventListener('submit', onSendChatMessage);
		chatInputField.addEventListener('input', onUserInputChangedHandler);

		// Setup the communicator
		communicator.setAgentId(config.accessToken);
		communicator.clearContextOnNextRequest();

		// Show the initial message
		sendMessage('start');
		// logMessage(cannedResponses.getResponse('start'), true);
	}

	init();
}));
