javascript: (function() {
	/* REPORT CODE */

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

	function a11yStartup() {
		loadingNotice('A11Y Reporter is running...<br>Refresh page to cancel');
		runA11YTool(generateReport);
	}
	function generateReport() {
		console.log('generateReport()');
		var iframe = createReportUI();
		iframe.style.display = 'none';
		axe.run().then( results => {writeReport(iframe,results)});
		removeLoadingNotice();			
	}

	
	// RUNNING CODE
	if(typeof document.A11Y_REQUIREMENTS === 'undefined')
		document.A11Y_REQUIREMENTS = [];
	document.A11Y_REQUIREMENTS.push('general-report-tests.js');
	document.A11Y_REQUIREMENTS.push('report-ui.js');
	document.A11Y_REQUIREMENTS.push('image-reviewer-ui.js');
	
	var e = document.createElement('script');
	e.onload = a11yStartup;
   e.src = 'https://metageeky.github.io/accessibility-bookmarklet/libraries/a11y-core-functions.js';
   document.body.appendChild(e);
}());
