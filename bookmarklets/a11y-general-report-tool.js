javascript: (function() {
	/* REPORT CODE */

	function writeReport(axe_results) {
		var rep = '';
			
		/* standard info */
		rep += 'URL:\t' + document.location.href + '\n';
		rep += 'DATETIME:\t' + (new Date()).toISOString() + '\n\n'

		/* axe report */
		rep += outputAxeResults(axe_results);

		/* Output headings outline */
		rep += outputHeadings();

		/* Output possible headings */
		rep += outputPossibleHeadings();

		/* output landmarks */
		rep += outputLandmarks();

		/* Tabbable elements checks */
		rep += outputTabbables();

		/* Images */
		rep += outputImages();

		/* Audio/Video */
		rep += outputAudioVideo();

		/* Linked Files */
		rep += outputLinkedFiles();

		/* Font Icon Detection */
		rep += outputFontIconDetect();
		
		

		var iframe = createReportUI(rep);
		
		//document.getElementById('a11y-bookmarklet').style.height = doc['body'].scrollHeight + 'px';

		// var ta = doc.getElementById('output'); // textarea
		// ta.value = rep;
	}


	function a11yStartup() {
		loadingNotice('A11Y Reporter is running...<br>Refresh page to cancel');
		runA11YTool(generateReport);
	}
	
	function generateReport() {
		axe.run().then( results => {writeReport(results)});
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
