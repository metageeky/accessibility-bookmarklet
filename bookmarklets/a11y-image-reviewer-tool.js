javascript: (function() {
	/* REPORT CODE */

	function a11yStartup() {
		loadingNotice('A11Y Image Reviewer is loading...<br>Refresh page to cancel');
		runA11YTool(runImageReviewer);
	}
	
	function runImageReviewer() {
		createImageReviewer();
		removeLoadingNotice();			
	}

	
	// RUNNING CODE
	if(typeof document.A11Y_REQUIREMENTS === 'undefined')
		document.A11Y_REQUIREMENTS = [];
	document.A11Y_REQUIREMENTS.push('image-reviewer-ui.js');
	
	var e = document.createElement('script');
	e.onload = a11yStartup;
   e.src = 'https://metageeky.github.io/accessibility-bookmarklet/libraries/a11y-core-functions.js';
   document.body.appendChild(e);
}());
