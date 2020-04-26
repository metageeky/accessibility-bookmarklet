// SUPPORT FUNCTIONS

function loadingNotice(msg) {
	var notice_style = 'display: flex;flex-direction: row;flex-wrap: nowrap;justify-content: center;align-content: center;align-items: center;position: fixed;height: 100%;width: 100%;background: rgba(0,0,0,0.5);z-index: 9999;top: 0; bottom: 0;left: 0;right: 0;';
	var notice_msg_style = 'background: #fff;text-align: center;padding: 2em;font-size: 2rem;';

	var notice = document.createElement('DIV');
	notice.id = 'a11y-loader';
	notice.style.cssText = notice_style;
	var notice_msg = document.createElement('DIV');
	notice_msg.style.cssText = notice_msg_style;
	notice_msg.innerHTML = msg;
	notice.appendChild(notice_msg);
	document.body.appendChild(notice);		
}

function removeLoadingNotice() {
	if(document.getElementById('a11y-loader'))
		document.body.removeChild(document.getElementById('a11y-loader'));
}

function getTextPlusAlt(e) {
	var ret = '';
	if(e.nodeType === 3) // text nodeName
		return e.textContent;
	if(e.nodeType === 1 && !isVisible(e)) // hidden
		return '';
	if(e.nodeType === 1 && e.nodeName === 'IMG')
		return (e.hasAttribute('alt') ? e.alt : '');
	if(e.nodeType === 1) {
		var c = e.childNodes;
		if(c.length == 0) {
			return e.innerText;
		}
		for(var i=0; i<c.length; i++) {

			ret += getTextPlusAlt(c[i]);
		}
		return ret;
	}
	return 'ERROR';
}

function isVisible(e) {
	for(var t = window.getComputedStyle(e), i = !1; e;) {
		if("none" === t.display) return !1;
		if(!i) {
			if("hidden" === t.visibility)
				return !1;
			"visible" === t.visibility && (i = !0)
		}
		if("true" === e.getAttribute("aria-hidden"))
			return !1;
		e = e.parentElement;
		try {
			t = window.getComputedStyle(e)
		} catch (e) {
			return !0
		}
	}
	return !0
 }

 function isVisuallyHidden(e) {
	var t = e.getBoundingClientRect(e);
	if("absolute" === window.getComputedStyle(e).position) {
		if(t.width <= 1 && t.height <= 1)
			return !0;
		if(t.right <= 0)
			return !0
	}
 }


/* Requirements Handling */

function Requirement(name, src, loaded) {
	this.name = name;
	this.src = src;
	this.loaded = loaded;
}

var REQUIREMENTS = [];
REQUIREMENTS['axe.min.js'] = 
	new Requirement('axe.min.js',
	                'https://metageeky.github.io/accessibility-bookmarklet/externals/axe.min.js',
						 function() { return (typeof axe === 'object' && typeof axe.run === 'function')}
						);
REQUIREMENTS['tabbable.js'] = 
	new Requirement('tabbable.js',
	                'https://metageeky.github.io/accessibility-bookmarklet/externals/tabbable.js',
						 function() { return (typeof tabbable === 'object' && typeof tabbable.isTabbable === 'function')}
						);						
REQUIREMENTS['w3c-alternative-text-computation.js'] = 
	new Requirement('w3c-alternative-text-computation.js',
	                'https://metageeky.github.io/accessibility-bookmarklet/externals/w3c-alternative-text-computation.js',
						 function() { return (typeof getAccName === 'function')}
						);		
REQUIREMENTS['general-report-tests.js'] = 
	new Requirement('general-report-tests.js',
	                'https://metageeky.github.io/accessibility-bookmarklet/libraries/a11y-general-report-tests.js',
						 function() { return !(typeof _shibA11YGenRepTests === 'undefined') }
						);
REQUIREMENTS['report-ui.js'] = 
	new Requirement('report-ui.js',
	                'https://metageeky.github.io/accessibility-bookmarklet/libraries/a11y-report-ui.js',
						 function() { return !(typeof _shibA11YRepUI === 'undefined') }
						);			
REQUIREMENTS['image-reviewer-ui.js'] = 
	new Requirement('image-reviewer-ui.js',
	                'https://metageeky.github.io/accessibility-bookmarklet/libraries/a11y-image-reviewer-ui.js',
						 function() { return !(typeof _shibA11YRepUI === 'undefined') }
						);							

// create promises for the current requirements. 
function processRequirements() {
	var i,r,p;
	var reqs = document.A11Y_REQUIREMENTS.slice();
	document.A11Y_REQUIREMENTS = [];
	console.log(reqs);
	var promises = [];

	for(i=0; i<reqs.length; i++) { 
		console.log('processReq: ' + i);
		if( !(reqs[i] in REQUIREMENTS) )
			continue;
		r = REQUIREMENTS[reqs[i]];
		console.log(r.name + ': ' + r.loaded());
		if(r.loaded())
			continue;
		p = loadRequirement(r.name);
		console.log('p: ' + p);
		if(p != null)
			promises.push(p);
	}
	return promises;
}

// load individual requirement
function loadRequirement(req) {
	console.log('Load: ' + req);
	// only return a promise if known requirement and not loaded
	if( !(req in REQUIREMENTS) )
		return null;
	if(REQUIREMENTS[req].loaded())	
		return null;
	
	return new Promise(function(resolve, reject) {
		var e = document.createElement('script');

		// Important success and error for the promise
		e.onload = function() {
			console.log('loadRequirement: ' + req);
			resolve(req);
		};
		e.onerror = function() {
			console.log('loadRequirement: ' + req);
			reject(req);
		};

		// Inject into document to kick off loading
		e.async = true;
		e['src'] = REQUIREMENTS[req].src;
		document['body'].appendChild(e);
	});
}

function runA11YTool(callback) {
	reallyRunA11YTool(runA11YTool,callback);
}

function reallyRunA11YTool(me,callback) {
	var promises = processRequirements();
	console.log('promises: ' + promises);
	if(promises.length > 0) {
		Promise.all(promises).then(function() {
			if(document.A11Y_REQUIREMENTS.length == 0) {
				console.log('zero requirements: ' + document.A11Y_REQUIREMENTS.length);
				callback();
			}
			else {
				console.log('runTool else: ')
				console.log(document.A11Y_REQUIREMENTS);
				console.log(me);
				console.log(callback);
				me(callback);
			}
		}).catch(function(req) {
			console.log(req);
			alert('Resource failed to load:\n'+req);
			removeLoadingNotice();
		});
	}
	else {
		console.log('else');
		callback();
	}
}	
