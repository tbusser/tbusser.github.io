!function(e,t){"use strict";e.chat=t($,e.responseUtil,e.communicator)}(this,function(e,t,n){"use strict";function i(e){return null==e?!0:"string"==typeof e?""===e.trim():!1}function o(e){if(t.hasAction())switch(t.getAction()){case"preflight-pregnancy":var i=t.getContextParameter("profile","gender"),o=parseInt(t.getContextParameter("profile","age"),10);if(null==i||"female"!==i)return void s("Oké, dan zijn we klaar.",!0);if(isNaN(o)||13>o||o>=55)return void s("Bedankt voor je tijd, ik heb geen verdere vragen.",!0);n.addContext("determine-own-is-pregnant",5).done(function(e){if(t.hasContext("1st-person"))s("Bent u zwanger?",!0);else{var n=t.getContextParameter("profile","name");s("Is "+n+" zwanger? Dit kan van invloed zijn op het advies.",!0)}console.log(e)}).fail(function(e){console.log(e)})}}function s(e,t){if(!i(e)){var n=document.createElement("li"),o=document.createElement("div");if(n.classList.add("chat-messages__message"),o.classList.add("chat-messages__bubble"),o.textContent=e,n.appendChild(o),n.setAttribute(m.attrDirection,t.toString()),!t)return u.appendChild(n),void(u.scrollTop=u.scrollHeight-u.clientHeight);f.classList.remove(m.cssHidden),setTimeout(function(){f.classList.add(m.cssHidden),u.appendChild(n),u.scrollTop=u.scrollHeight-u.clientHeight},35*e.length)}}function a(e){if(e.preventDefault(),""!==d.value.trim()){var a=d.value;d.value="",g.setAttribute("disabled","disabled"),s(a,!1),n.sendQuery(a).done(function(e){t.setResponse(e);var n=t.getSpeechResponse();i(n)&&!t.hasAction()&&(n="Ik heb u niet goed begrepen, kan je het anders formuleren?"),s(n,!0),o(e),console.log(e)}).fail(function(e){console.log(e)})}}function r(e){""===d.value?g.setAttribute("disabled","disabled"):g.removeAttribute("disabled")}function l(){null!==c&&null!==u&&null!==d&&null!==g&&(c.addEventListener("submit",a),d.addEventListener("input",r),s("Hallo, ik ben Alex. Voor wie wil je iets vragen, jezelf of iemand anders?",!0),n.setAgentId(m.accessToken),n.clearContextOnNextRequest())}var c=document.querySelector("form"),d=c.querySelector("input"),u=document.querySelector(".chat-messages__log"),f=document.querySelector(".chat-messages__typing-indicator"),g=document.querySelector(".chat__input__send-button"),m={accessToken:"f91f07f0eeec4f3499cd811bbc2f99ef",attrDirection:"data-incoming",cssHidden:"u-display--none"};l()});