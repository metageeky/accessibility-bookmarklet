// KNOWN_REQUIREMENTS Code for A11Y Tools in libraries directory
if(typeof document.A11Y_REQUIREMENTS === 'undefined')
	document.A11Y_REQUIREMENTS = [];

var _shibA11YRepUI = 1;

function createReportUI(report) {
	var containerId = "a11y-bookmarklet";
	var containerStyle = "position: fixed; top: 20px; right: 20px; max-height: 100%; min-width: 320px; max-width: 450px; z-index: 1000001;";

	var container = document.getElementById(containerId);
	if(container)
		document.body.removeChild(container);
	container = document.createElement("DIV");
	container.id = containerId;
	container.style.cssText = containerStyle;

	var iframe = document.createElement("IFRAME");
	iframe.id = "a11y-iframe";
	var iframeStyle = 'box-shadow: 10px 10px 10px 0px rgba(40,73,0,0.4); width: 100%; height:100%; border: solid 2px #284900;';
	iframe.style.cssText = iframeStyle;

	var doc;

	container.appendChild(iframe), iframe.onload = function() {
		function e(e, t) {
			var i = doc.getElementById(e),
				o = doc.querySelector(".result");
			if(i) {
				var n = function(e) {
					i.checked ? o.classList.add(t) : o.classList
						.remove(t), e && updateHeight()
				};
				i.addEventListener("change", n, !1), i
					.addEventListener('click', n, !1), n()
			}
		}
		iframe.onload = function() {}, (doc = iframe.contentWindow
			.document).open(), doc.write(
			'<html> <head> <meta name="viewport" content="width=device-width,minimum-scale=1.0,initial-scale=1,user-scalable=yes"> <style> * { margin: 0; padding: 0; border: 0; box-sizing: border-box; } body { font: 14px/1.6 sans; color: #284900; background: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 320px; max-width: 450px; } header { padding-left: 10px; color: white; background-color: #284900; display: flex; flex-wrap: nowrap; align-content: baseline; margin-bottom: 10px; } h1 { font-size: 1.2rem; flex: 1 1 auto; padding: 2px 0;} legend { margin-right: 1em; font-weight: bold; } button { color: #fff; background: transparent; min-width: 25px; border: dotted 2px transparent; font-size: inherit;  cursor: pointer; } button:hover,button:focus { background: #506b2f; } button::-moz-focus-inner { border: 0; } header button:focus { border-color: #fff; outline: 0; } button + button { margin-left: 3px; } main { padding: 0 10px 10px; } textarea { border: solid 1px #284900; width: 100%; height: 200px; padding: 5px; resize: none; } #instructions { margin-top: 10px; text-align:left; padding-bottom: 5px;} kbd { border: 1px solid #888; display:inline-block; font-size:.9em; font-weight:700; line-height:1; padding: 2px 4px; white-space:nowrap; } h2 {margin-top:4px; font-size:1.2em; font-weight:700; } #instructions button { font-family: inherit; padding: 3px 5px; line-height:1; background-color: #284900; } #instructions button:focus { outline: 3px dotted #284900;} #showHide { padding:0; font-size:0.875em !important; width:24px; height:24px; font-weight:700;display:inline-flex; flex-direction:row; flex-wrap: nowrap; justify-content: center; align-content: center; align-items: center; background-color: #284900; }  ul {display: block; list-style-position: outside; padding-left:22px; } ul li { white-space: normal; margin-top:3px } ul li + li { margin-top: 10px} </style> </head> <body> <header> <h1>A11Y Report</h1> <button id="bmin"aria-label="minimize" data-action="minimize">&#128469;</button><button id="bmax" aria-label="maximize" data-action="maximize" style="display:none">&#128470;</button><button aria-label="close" data-action="close">&#215;</button> </header> <main id="result" class="result">  <textarea readonly id="output" aria-label="accessibility report" wrap="off" spellcheck="false"></textarea> <div id="instructions"><h2><button aria-expanded="true" aria-label="Hide" id="showHide">&#43;</button> Instructions: </h2><ul id="list"><li>Copy the report into Excel: <button id="selectAll">Select Report</button></li><li>Use the <button id="launchTabView">Tab Viewer</button> to manually fill in the <i>Human: Visible on Focus?</i> and <i>Visible: Ordering Sense?</i> columns</li><li>Use the <button id="launchImgView">Image Reviewer</button> to fill out the <i>Human: Alt Quality?</i> column</li></ul></div></main> </body> </html> '
			), doc.close();
		var t = doc.querySelector('[data-action="close"]');
		t && t.addEventListener('click', function(e) {
			document.body.removeChild(container);
		});
		t = doc.getElementById('bmin');
		t && t.addEventListener('click', function(e) {
			doc.querySelector('main').style.display = 'none';
			doc.getElementById('bmin').style.display = 'none';
			doc.getElementById('bmax').style.display = 'block';
			let h = iframe.contentWindow.document.body.offsetHeight + 'px';
			iframe.style.height = h;
			container.style.height = h;
		});				
		t = doc.getElementById('bmax');
		t && t.addEventListener('click', function(e) {
			doc.querySelector('main').style.display = 'block';
			doc.getElementById('bmax').style.display = 'none';
			doc.getElementById('bmin').style.display = 'block';
			let h = iframe.contentWindow.document.body.offsetHeight + 'px';
			iframe.style.height = h;
			container.style.height = h;
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
			let h = iframe.contentWindow.document.body.offsetHeight + 'px';
			iframe.style.height = h;
			container.style.height = h;
		});
		t = doc.getElementById('selectAll');
		t && t.addEventListener('click', function(e) {
			t.select();
		});
		t = doc.getElementById('launchImgView');
		t && t.addEventListener('click', function(e) {
			createImageReviewer();
		});
		t = doc.getElementById('launchTabView');
		t && t.addEventListener('click', function(e) {
			container.style.display = 'none';
			var mut = new MutationObserver( function(mutations) {
				mutations.forEach(function(m) {
					if(m.removedNodes) {
						for(var n of m.removedNodes) {
							if(n.id === 'a11y-tabbing-viewer') {
								container.style.display = 'block';
								document._mut.disconnect();
							}
						}
					}
				});
			});
			document._mut = mut;
			createTabbingReviewer();
			mut.observe(document.body, { childList: true });			
		});

		
		t = doc.getElementById('output');
		t.value = report;
		
		let h = iframe.contentWindow.document.body.offsetHeight + 'px';
		iframe.style.height = h;
		container.style.height = h;
					
	}, document.body.appendChild(container);

	return iframe;
}