javascript: (function() {
	/* SUPPORT FUNCTIONS*/
	var loadResource = (function() {
		// Function which returns a function: 
		function _load(tag) {
			return function(url) {
				// This promise will be used by Promise.all to determine success or failure
				return new Promise(function(resolve, reject) {
					var element = document.createElement(tag);
					var parent = 'body';
					var attr = 'src';

					// Important success and error for the promise
					element.onload = function() {
						resolve(url);
					};
					element.onerror = function() {
						reject(url);
					};

					// Need to set different attributes depending on tag type
					switch(tag) {
						case 'script':
							element.async = true;
							break;
						case 'link':
							element.type = 'text/css';
							element.rel = 'stylesheet';
							attr = 'href';
							parent = 'head';
					}

					// Inject into document to kick off loading
					element[attr] = url;
					document[parent].appendChild(element);
				});
			};
		}
		return {
			css: _load('link'),
			js: _load('script'),
			img: _load('img')
		}
	})();

	/* REPORT CODE */

	function loadingNotice() {
		var notice_style = 'display: flex;flex-direction: row;flex-wrap: nowrap;justify-content: center;align-content: center;align-items: center;position: fixed;height: 100%;width: 100%;background: rgba(0,0,0,0.5);z-index: 9999;top: 0; bottom: 0;left: 0;right: 0;';
		var notice_msg_style = 'background: #fff;text-align: center;padding: 2em;font-size: 2rem;';

		var notice = document.createElement('DIV');
		notice.id = 'a11y-loader';
		notice.style.cssText = notice_style;
		var notice_msg = document.createElement('DIV');
		notice_msg.style.cssText = notice_msg_style;
		notice_msg.innerHTML = 'A11Y Reporter is running...<br>Refresh page to cancel'
		notice.appendChild(notice_msg);
		document.body.appendChild(notice);		
	}
	
	function removeLoadingNotice() {
		document.body.removeChild(document.getElementById('a11y-loader'));
	}
	
	function prepareIframe() {
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

	function runReport() {
		loadingNotice();
		var iframe = prepareIframe();
		iframe.style.display = 'none';
		Promise.all([
			loadResource.js('https://metageeky.github.io/accessibility-bookmarklet/general/ally-reporter-support-code.js'),
			loadResource.js('https://metageeky.github.io/accessibility-bookmarklet/src/axe.min.js'),
			loadResource.js('https://metageeky.github.io/accessibility-bookmarklet/src/tabbable.js'),
			loadResource.js('https://metageeky.github.io/accessibility-bookmarklet/src/w3c-alternative-text-computation.js'),
		]).then(function() {
			axe.run().then( results => {writeReport(iframe,results)});
			removeLoadingNotice();			
		}).catch(function(url) {
			alert('Resource failed to load:\n'+url);
			removeLoadingNotice()
		});
	}

	function writeReport(iframe,axe_results) {
		iframe.style.display = 'block';
		var doc = iframe.contentDocument;
		document.getElementById('a11y-bookmarklet').style.height = doc['body'].scrollHeight + 'px';
		var ta = doc.getElementById('output'); // textarea
		ta.value = '';

		/* standard info */
		ta.value += 'URL:\t' + document.location.href + '\n';
		ta.value += 'DATETIME:\t' + (new Date()).toISOString() + '\n\n'

		/* axe report */
		ta.value += outputAxeResults(axe_results);

		/* Output headings outline */
		ta.value += outputHeadings();

		/* Output possible headings */
		ta.value += outputPossibleHeadings();

		/* output landmarks */
		ta.value += outputLandmarks();

		/* Tabbable elements checks */
		ta.value += outputTabbables();

		/* Images */
		ta.value += outputImages();

		/* Audio/Video */
		ta.value += outputAudioVideo();

		/* Linked Files */
		ta.value += outputLinkedFiles();

		/* Font Icon Detection */
		ta.value += outputFontIconDetect();
	}

	/* RUNNING CODE */
	runReport();
}());
