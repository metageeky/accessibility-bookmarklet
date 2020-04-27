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
		document.body.removeChild(container);
	container = document.createElement("DIV");
	container.id = containerId;
	container.style.cssText = containerStyle;

	var iframe = document.createElement("IFRAME");
	iframe.id = 'a11y-tab-viewer';
	iframe.style.cssText = 'border: solid 2px #284900; width: 450px; max-width:80%; min-height:180px;';
	
	var doc;
	container.appendChild(iframe), iframe.onload = function() { 
		(doc = iframe.contentWindow.document).open(), doc.write(
			'<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,minimum-scale=1.0,initial-scale=1,user-scalable=yes"><style>* { margin:0; padding:0; border:0; box-sizing:border-box} body { overflow-y:hidden; background:#fff; font-size:16px; font-family:sans-serif} button::-moz-focus-inner { border:0} #tbar { padding: 0 15px; text-align:center; margin:0 auto 10px; display:flex; flex-direction:row; flex-wrap:nowrap; justify-content:center; align-content:center; align-items:center} button { line-height:1; color:#fff; background:#284900; border:2px solid #284900; cursor:pointer} #tbar button { font-size:32px; padding:0 5px; margin:0 5px} #tbar button:disabled { background: #eee; color:#333; border-color: #eee; cursor: default;} button:focus,button:hover { background:#506b2f; border-color:#506b2f} button:focus { border-color:#fff; border-style:dotted} #tbar>div { padding:0 4px; flex: 1 0 auto;} .tabbar { border:solid 1px #284900} .tabpanel { padding:10px 15px}  .tabpanel table { margin:8px auto 1px} .tabpanel td { vertical-align:top; padding-bottom:3px} .tabpanel tr td:first-of-type { padding-right:3px; font-weight:700} header { padding-left:10px; color:#fff; background-color:#284900; display:flex; flex-wrap:nowrap; align-content:baseline} h1 { font-size:1.2rem; flex:1 1 auto; padding:8px 0} header button { padding:0 8px; font-size:1.1rem} main { overflow-y: scroll; padding-bottom:15px} </style></head><body><header><h1>A11Y Tabbing Reviewer</h1><button aria-label="close"id="tabclose">&#215;</button></header><main id="result"><div id="tabbar"><div class="tabpanel"><table role="presentation"><tr><td>Alt:</td><td id="alt"></td></tr><tr><td>Long:</td><td id="long"></td></tr></table></div><div id="tbar"><button disabled aria-label="first image" id="first"type="button">&#11120;</button> <button disabled aria-label="previous image" id="prev">&#11104;</button><div><span id="cur"></span> of <span id="tot"></span></div><button aria-label="next image" id="next">&#11106;</button> <button aria-label="last image" id="last">&#11122;</button></div></div></main></body></html>'
		), doc.close();
		
		var t;
		t = doc.getElementById('tabclose');
		t && t.addEventListener("click", function(e)  { 
			document.body.removeChild(container);
		});
		t = doc.getElementById('first');
		t && t.addEventListener("click", function(e)  { 
			doc._cur = 0;
			updateTabReviewer(doc);
			updateCurrentTab(doc);
		});
		t = doc.getElementById('prev');
		t && t.addEventListener("click", function(e)  { 
			doc._cur -= 1;
			updateTabReviewer(doc);
			updateCurrentTab(doc);
		});
		t = doc.getElementById('next');
		t && t.addEventListener("click", function(e)  { 
			doc._cur += 1;
			updateTabReviewer(doc);
			updateCurrentTab(doc);
		});
			t = doc.getElementById('last');
		t && t.addEventListener("click", function(e)  { 
			doc._cur = doc._tot - 1;
			updateTabReviewer(doc);
			updateCurrentTab(doc);
		});
		
		// set up vertical scroll on main
		window.onresize = setMainHeight;
		setMainHeight();
		
		// tabs and index
		doc._tabs = tabbable(document.body);	
		for(var i=0; i< doc._tabs.length; i++)
			doc._tabs[i].addEventListener('focus', trackBlur);
		
		doc._cur = 0;
		doc._tot = doc._tabs.length;
		doc.getElementById('cur').innerText = (doc._cur + 1);
		doc.getElementById('tot').innerText = (doc._tot);
		updateCurrentTab(doc);
			
	}, document.body.appendChild(container);
	
	return iframe;
}

function trackBlur(evt) {
	console.log('leave');
	console.log(evt.target);
}

function setMainHeight() {
	var iframe = document.getElementById('a11y-tab-viewer');
	if(!iframe) return;
	var doc = iframe.contentWindow.document;
	if(!doc) return;
	var if_h = iframe.getBoundingClientRect().height;
	var he_h = doc.querySelector('header').getBoundingClientRect().height;
	doc.querySelector('main').style.height = (if_h - he_h) + 'px';
}
	
function updateTabReviewer(doc) {
	doc.getElementById('cur').innerText = (doc._cur + 1);		
	var buttons = doc.querySelectorAll('#tbar button');
	for(var i=0; i<4; i++) 
		buttons[i].disabled = false;
	if(doc._cur == 0) {
		buttons[0].disabled = true;
		buttons[1].disabled = true;
	}
	if(doc._cur == doc._tot - 1) {
		buttons[3].disabled = true;
		buttons[2].disabled = true;
	}
}

function updateCurrentTab(doc) {
	var i = doc._cur;
	var e = doc._tabs[i];
	
	var accName = getAccName(e);
	doc.getElementById('alt').textContent = accName.name;
	doc.getElementById('long').textContent = accName.desc;
	
	console.log(e.getBoundingClientRect());
	e.focus();
	console.log(e.getBoundingClientRect());
	
}

	
