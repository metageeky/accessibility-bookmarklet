// KNOWN_REQUIREMENTS Code for A11Y Tools in libraries directory
if(typeof document.A11Y_REQUIREMENTS === 'undefined')
	document.A11Y_REQUIREMENTS = [];

var _shibA11YRepUI = 1;

function createReportUI() {
	var containerId = "a11y-bookmarklet";
	var containerStyle = "position: fixed; top: 10px; right: 10px; max-height: 100%; box-shadow: 0 0 80px rgba(0,0,0,0.3); min-width: 320px; max-width: 450px; z-index: 1000001;";

	var container = document.getElementById(containerId);
	if(container)
		document.body.removeChild(container);
	container = document.createElement("DIV");
	container.id = containerId;
	container.style.cssText = containerStyle;

	var iframe = document.createElement("IFRAME");
	iframe.id = "a11y-iframe";
	iframe.style.width = "100%", iframe.style.height = "100%", iframe
		.style.borderWidth = "0";

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
					.addEventListener("click", n, !1), n()
			}
		}
		iframe.onload = function() {}, (doc = iframe.contentWindow
			.document).open(), doc.write(
			'<html> <head> <meta name="viewport" content="width=device-width,minimum-scale=1.0,initial-scale=1,user-scalable=yes"> <style> * { margin: 0; padding: 0; border: 0; box-sizing: border-box; } body { font: 14px/1.6 sans; color: #284900; background: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 320px; max-width: 450px; } header { padding-left: 10px; color: white; background-color: #284900; display: flex; flex-wrap: nowrap; align-content: baseline; margin-bottom: 10px; } h1 { font-size: 1.2rem; flex: 1 1 auto; padding: 2px 0;} legend { margin-right: 1em; font-weight: bold; } button { color: #fff; background: transparent; min-width: 25px; border: dotted 2px transparent; font-size: inherit;  cursor: pointer; } button:hover,button:focus { background: #506b2f; } button::-moz-focus-inner { border: 0; } header button:focus { border-color: #fff; outline: 0; } button + button { margin-left: 3px; } main { padding: 0 10px 10px; } textarea { border: solid 1px #284900; width: 100%; height: 200px; padding: 5px; resize: none; } </style> </head> <body> <header> <h1>A11Y Report</h1> <button id="bmin"aria-label="minimize" data-action="minimize">&#128469;</button><button id="bmax" aria-label="maximize" data-action="maximize" style="display:none">&#128470;</button><button aria-label="close" data-action="close">&#215;</button> </header> <main id="result" class="result">  <textarea id="output" wrap="off" spellcheck="false"></textarea> </main> </body> </html> '
			), doc.close();
		var t = doc.querySelector('[data-action="close"]');
		t && t.addEventListener("click", function(e) {
			document.body.removeChild(container);
		});
		t = doc.getElementById('bmin');
		t && t.addEventListener("click", function(e) {
			doc.querySelector('main').style.display = 'none';
			doc.getElementById('bmin').style.display = 'none';
			doc.getElementById('bmax').style.display = 'block';
			let h = iframe.contentWindow.document.body.offsetHeight + 'px';
			iframe.style.height = h;
			container.style.height = h;
		});				
		t = doc.getElementById('bmax');
		t && t.addEventListener("click", function(e) {
			doc.querySelector('main').style.display = 'block';
			doc.getElementById('bmax').style.display = 'none';
			doc.getElementById('bmin').style.display = 'block';
			let h = iframe.contentWindow.document.body.offsetHeight + 'px';
			iframe.style.height = h;
			container.style.height = h;
		});				
					
	}, document.body.appendChild(container);

	return iframe;
}