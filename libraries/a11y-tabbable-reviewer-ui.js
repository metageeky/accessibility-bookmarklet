// KNOWN_REQUIREMENTS Code for A11Y Tools in libraries directory
if(typeof document.A11Y_REQUIREMENTS === 'undefined')
	document.A11Y_REQUIREMENTS = [];
document.A11Y_REQUIREMENTS.push('w3c-alternative-text-computation.js');
document.A11Y_REQUIREMENTS.push('tabbable.js');

var _shibA11YTabRev = 1;


function createTabbingReviewer()  { 
	var containerId = 'a11y-tabbing-viewer';
	var containerStyle = 'position: fixed; height: 100%; width: 100%; background: transparent; z-index: 1000001; top:0; bottom: 0; left: 0; right: 0;';
	
	var container = document.getElementById(containerId);
	if(container)
		closeTabReviewer();
	container = document.createElement('DIV');
	container.id = containerId;
	container.style.cssText = containerStyle;

	var fBid = 'a11y-focus-box';
	var focusBox = document.getElementById(fBid);
	if(focusBox)
		document.body.removeChild(focusBox);
	focusBox = document.createElement('DIV');
	focusBox.id = fBid;
	focusBox.style.cssText = 'position: fixed; box-sizing: border-box; border: solid 5px #C4FB04; outline: dashed 5px #284900; outline-offset: -5px; padding: 0px; z-index: 1000002';
	document.body.appendChild(focusBox);
	focusBox.setAttribute('data-tab-showfocus',false);

	var iframe = document.createElement('IFRAME');
	iframe.id = 'a11y-tab-viewer';
	iframe.style.cssText = 'display:none; position:fixed; border: solid 2px #284900; width: 300px; max-width:80%; box-shadow: 10px 10px 10px 0px rgba(40,73,0,0.4);';
	
	var doc;
	container.appendChild(iframe), iframe.onload = function() { 
		(doc = iframe.contentWindow.document).open(), doc.write(
			'<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,minimum-scale=1.0,initial-scale=1,user-scalable=yes"><style> * { margin:0; padding:0; border:0; box-sizing:border-box} body { overflow-y:hidden; background:#fff; font-size:12px; font-family:sans-serif} button::-moz-focus-inner { border:0} button { padding: 3px; font-size: 1em !important; color:#fff; background:#284900; border:2px solid #284900; cursor:pointer} button:focus,button:hover { background:#506b2f; border-color:#506b2f} button:focus { border-color:#fff; border-style:dotted} header { padding-left:10px; color:#fff; background-color:#284900; display:flex; flex-wrap:nowrap; align-content:baseline} h1 { font-size:1.2em; flex:1 1 auto; padding:8px 0} header button { padding:0 8px; font-size:1.1rem !important; } main { overflow-y: scroll; padding: 8px 10px;} #warning {display:none; font-size: 1.1em; text-align: center; font-weight: 700; color: #d00; margin-bottom: 5px} table { margin:0 auto} td { vertical-align:top; } tr td:first-of-type { padding-right:3px; font-weight:700} #instructions { text-align:left; padding-bottom: 5px;} kbd { border: 1px solid #888; display:inline-block; font-size:.9em; font-weight:700; line-height:1; padding: 2px 4px; white-space:nowrap; } h2 {margin-top:4px; font-size:1.2em; font-weight:700; } #showHide { padding:0; font-size:1em !important; line-height:1; width:17px; height:17px; font-weight:700;display:inline-flex; flex-direction:row; flex-wrap: nowrap; justify-content: center; align-content: center; align-items: center; } ul {display: none; list-style-position: inside; padding-left:22px; } ul li { margin-top:6px } </style><body><header><h1>A11Y Tabbing Reviewer</h1><button aria-label="close" id="tabclose">&#215;</button></header><main id="result"><div id="warning"></div><table role="presentation"><tr><td>AT:</td><td id="alt"><i>start of page</i></td></table><div id="instructions"><h2><button aria-expanded="false" aria-label="Show" id="showHide">&#43;</button> Instructions:  </h2><ul id="list" ><li>Use <kbd>Tab</kbd> and <kbd>Shift+Tab</kbd> to move focus</li><li>Press <kbd>R</kbd> to reset to start of page</li><li>Press <kbd>F</kbd> to toggle outline of current focus</li></ul></div></main></body></html>'
		), doc.close();
		
		var t;
		t = doc.getElementById('tabclose');
		t && t.addEventListener('click', function(e) { 
			closeTabReviewer();
		});
		t = doc.getElementById('showHide');
		t && t.addEventListener('click', function(e) { 
			if(this.attributes['aria-expanded'].value === 'false') {
				this.setAttribute('aria-expanded',true);
				this.setAttribute('aria-label', 'Hide');
				this.innerHTML = '&#8722;';
				doc.getElementById('list').style.display = 'block';	
			}
			else if(this.attributes['aria-expanded'].value === 'true') {
				this.setAttribute('aria-expanded',false);
				this.setAttribute('aria-label', 'Show');
				this.innerHTML = '&#43;';
				doc.getElementById('list').style.display = 'none';	
			}
			setMainHeight();
		});

				
		// set up vertical scroll on main
		window.onresize = setMainHeight;
		setMainHeight();		
		// tabs and index
		doc._firstTabHappened = false;
		doc._cur = 0; // for body
		doc._tabs = tabbable(document.body);
		doc._onKnownTab = true;
		doc._tot = doc._tabs.length;		
		for(var i=0; i< doc._tabs.length; i++) {
			doc._tabs[i].setAttribute('data-tab-i',i+1);
		}
		document.body.setAttribute('tabindex',0);
		document.body.focus();
		moveFocusBox(document.activeElement);
		iframe.style.display = 'block';
			
	}, document.body.appendChild(container);

	window.addEventListener('keyup', processKeys);
	window.addEventListener('focus', trackFocus, true);  
	window.scrollTo(0,0);
	return iframe;
}

function closeTabReviewer() {
	document.body.removeChild(document.getElementById('a11y-tabbing-viewer'));
	document.body.removeChild(document.getElementById('a11y-focus-box'));
	window.removeEventListener('keyup',processKeys);
	window.removeEventListener('focus',trackFocus, true);
}

function processKeys(evt) {
	if(evt.key.toLowerCase() === 'r') {
		document.body.setAttribute('tabindex',0);
		document.getElementById('a11y-tab-viewer').contentWindow.document._cur = 0;
		document.body.focus();	
	}
	else if(evt.key.toLowerCase() === 'f') {
		var fb = document.getElementById('a11y-focus-box');
		if(!fb)
			return;
		
		var currFocus;
		if(!fb.hasAttribute('data-tab-showfocus'))
			currFocus = false;
		else
			currFocus = (fb.attributes['data-tab-showfocus'].value) === 'true';
		
		currFocus = !currFocus;
		fb.setAttribute('data-tab-showfocus', currFocus);
		
		if(currFocus) {
			fb.style.display = 'block';
		}
		else {
			fb.style.display = 'none';	
		}
	}
}

function trackFocus(evt) {
	if(!evt.target)
		return;
	if(!evt.target.hasAttribute)
		return;
	
	if(evt.target.nodeName === 'BODY' || evt.target.nodeName === 'HTML') {
		updateTabTracking(evt.target);
		return;
	}
	
	if(!document.getElementById('a11y-tab-viewer').contentWindow.document._firstTabHappened) {
		// first real tabbable
		document.body.removeAttribute('tabindex');
		evt.target.setAttribute('data-first-tabbable',true);
		evt.target.addEventListener('blur', leftFirstTabbable);
		document.getElementById('a11y-tab-viewer').contentWindow.document._firstTabHappened = true;
	}
	if(!evt.target.hasAttribute('data-has-tracking')) {
		evt.target.addEventListener('focus', updateTabTracking);
		evt.target.setAttribute('data-has-tracking',true);
	}
}

function leftFirstTabbable(evt) {
	var related = evt.relatedTarget;
	if(!related)
		return;
	if(related.nodeName === 'HTML' || related.nodeName === 'BODY') {
		updateTabTracking(related);
	}
}

function moveFocusBox(e) {
	var fb = document.getElementById('a11y-focus-box');
	if(!fb)
		return;
	fb.style.display = 'none';	
	if(!e)
		return;

	var bWidth = 5;
	var pWidth = 7;

	if(e.nodeName === 'BODY' || e.nodeName === 'HTML') {
		fb.style.display = 'none';				
		return;
	}
	else {
		var r = e.getBoundingClientRect();
		fb.style.top = (r.top - bWidth - pWidth) + 'px';
		fb.style.left = (r.left - bWidth - pWidth) + 'px';
		fb.style.width = (r.width + 2*bWidth + 2*pWidth) + 'px';
		fb.style.height = (r.height + 2*bWidth + 2*pWidth) + 'px';
		if(fb.hasAttribute('data-tab-showfocus') && fb.attributes['data-tab-showfocus'].value === 'true')
			fb.style.display = 'block';
	}
}

function moveDataBox(e) {
	var iframe = document.getElementById('a11y-tab-viewer');
	if(!iframe) return;
	
	var delta = 15; // padding + border + 5 regarding the forced focus
	
	if(!e || !e.getBoundingClientRect) {
		iframe.style.top = delta + 'px';
		iframe.style.left = delta + 'px';
	} 
	else if(e.nodeName === 'BODY' || e.nodeName === 'HTML') {
		iframe.style.top = delta + 'px';
		iframe.style.left = delta + 'px';
	}
	else {
		
		var vw = Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
		var vh = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
		var iRect = iframe.getBoundingClientRect();		
		var eRect = e.getBoundingClientRect();		
		
		// adjust scroll if possible
	   // (e is already focus to, so it's whole content should be in screen);
		var dx = 0, dy = 0;
		if(eRect.top < delta)
			dy = -(delta - eRect.top);
		if(vh - eRect.bottom < delta)
			dy = delta - (vh - eRect.bottom);
		if(eRect.left < delta)
			dx = -(delta - eRect.left);
		if(vw - eRect.right < delta)
			dx = delta - (vw - eRect.right);		
		window.scrollBy(dx,dy);

		// update bounding boxes
		iRect = iframe.getBoundingClientRect();		
		eRect = e.getBoundingClientRect();	

		// adjust x-axis places
		var newLeft, newTop;
		// generally try to keep the databox below e
		newLeft = eRect.left + eRect.width + delta;
		// adjust if data box is off screen to the right
		if(newLeft + iRect.width + delta >= vw)
			newLeft = eRect.left - delta - iRect.width;
		// handle case if the left is off screen now by centering
		if(newLeft <= delta)
			newLeft = eRect.Left + (eRect.width/2.0) - (iRect.width/2.0);
			

		// generally try to keep the databox below e
		newTop = eRect.top + eRect.height + delta;
		// adjust if data box is off screen to the bottom
		if(newTop + iRect.height + delta >= vh)
			newTop = eRect.top - delta - iRect.height;
		
		iframe.style.left = newLeft + 'px';
		iframe.style.top = newTop + 'px';		
	}	
}

function updateTabTracking(evt) {
	var e;
	if(!evt.nodeName) // event object
		e = evt.target;
	else
		e = evt;
	var iframe = document.getElementById('a11y-tab-viewer');
	if(!iframe) return;
	var doc = iframe.contentWindow.document;
	if(!doc) return;
	if(typeof e === 'undefined')
		e = document.activeElement;

	if(e.nodeName === 'BODY' || e.nodeName === 'HTML') {
		doc.getElementById('warning').style.display = 'none';
		doc.getElementById('alt').innerHTML = '<i>start of page</i>';
		doc._cur = 0;
		doc._onKnownTab = true;
		setMainHeight();
		moveDataBox(e);
		moveFocusBox(e);		
		return;
	}
	document.body.removeAttribute('tabindex');
	
	// use timeout to deal with race conditions with CSS updating
	setTimeout(function() {
		if(e.hasAttribute && e.hasAttribute('data-tab-i')) {
			var i = parseInt(e.attributes['data-tab-i'].value);
			doc.getElementById('alt').innerHTML = '(' + i + ') ' + getAccName(e).name;		
			var delta = Math.abs(doc._cur - i);
				
			if(doc._onKnownTab) { // knownTab to knownTab
				if(delta <= 1) {
					doc.getElementById('warning').style.display = 'none';
				}
				else { 
					doc.getElementById('warning').innerText = 'Unexpected index jump: ' + doc._cur + ' to ' + i;
					doc.getElementById('warning').style.display = 'block';				
				}
				doc._cur = i;	
			}
			else { // unknownTab to lnownTab
				doc.getElementById('warning').innerText = 'Returned to known index';
				doc.getElementById('warning').style.display = 'block';
			}
			doc._onKnownTab = true;
		}
		else { 
			doc.getElementById('warning').innerText = 'Undetected Focus';
			doc.getElementById('warning').style.display = 'block';		
			doc.getElementById('alt').innerHTML = '(???) ' + getAccName(e).name;		
			doc._onKnownTab = false;		
		}
		
		setMainHeight();
		moveDataBox(e);
		moveFocusBox(e);
	}, 150);
}

function setMainHeight() {
	var iframe = document.getElementById('a11y-tab-viewer');
	if(!iframe) return;
	var doc = iframe.contentWindow.document;
	if(!doc) return;
	var if_h = iframe.getBoundingClientRect().height;
	var he_h = doc.querySelector('header').getBoundingClientRect().height;
	var ma_h = doc.querySelector('main').getBoundingClientRect().height;
	iframe.style.height = doc.body.getBoundingClientRect().height + 'px';
}
	
