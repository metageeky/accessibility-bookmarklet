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


	function runReport() {
		var iframe = prepareIframe();
		iframe.style.display = 'none';
		Promise.all([
			loadResource.js('https://metageeky.github.io/accessibility-bookmarklet/general/ally-reporter-support-code.js')
			loadResource.js('https://metageeky.github.io/accessibility-bookmarklet/src/axe.min.js'),
			loadResource.js('https://metageeky.github.io/accessibility-bookmarklet/src/tabbable.js'),
			loadResource.js('https://metageeky.github.io/accessibility-bookmarklet/src/w3c-alternative-text-computation.js'),
		]).then(function() {
			axe.run().then( results => {writeReport(iframe,results)});
		}).catch(function(url) {
			alert('Resource failed to load:\n'+url);
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
