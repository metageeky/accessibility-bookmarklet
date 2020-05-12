if(typeof document.A11Y_REQUIREMENTS === 'undefined')
	document.A11Y_REQUIREMENTS = [];
// Uncomment any files that are required
document.A11Y_REQUIREMENTS.push('w3c-alternative-text-computation.js');
document.A11Y_REQUIREMENTS.push('general-report-tests.js');
document.A11Y_REQUIREMENTS.push('report-ui.js');

// shibboleth for detecting loading
var _shibA11YLibGuideRepTests = 1;

// Lib Guide Report 
function writeLibGuideReport(axe_results) {
	var rep = '';
		
	/* standard info */
	rep += 'TITLE:\t' + document.title + '\n'; 
	rep += 'URL:\t' + document.location.href + '\n';
	rep += 'DATETIME:\t' + (new Date()).toISOString() + '\n';
	rep += 'HUMAN TESTER:\n'
	rep += '\n';

	
	/* Libguide Information */
	rep += outputLibGuideInformation();

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
	rep += outputLibGuideImages();

	/* Audio/Video */
	rep += outputAudioVideo();

	/* Linked Files */
	rep += outputLinkedFiles();

	/* LibGuide Assets */
	rep += outputLinkedLibGuideAssets();

	/* Font Icon Detection */
	rep += outputFontIconDetect();
	
	/* possible copy-paste */
	rep += outputPossibleCopyPaste();
	
	var iframe = createReportUI(rep);
}


function getNavigationType() {
	if(document.getElementById('s-lg-side-nav-content') !== null)
		return 'SIDE';
	if(document.getElementById('s-lg-guide-tabs') !== null)
		return 'TOP';
	return 'UNKNOWN';
}

function outputLibGuideInformation() {
	var ret, i, e;
	
	ret = 'LIBGUIDE INFORMATION\n';
	
	ret += 'Navigation:\t';
	ret += getNavigationType();
	ret += '\n';
	
	ret += 'Friendly URL:\t';
	ret += (document.location.href.indexOf('c.php?') < 0);
	ret += '\n';
	
	ret += 'Owner(s):\t';
	e = document.querySelectorAll('.s-lib-profile-name');
	for(i=0; i<e.length; i++) {
		if(i > 0)
			ret += ', ';
		ret += e[i].innerText;
	}
	ret += '\n';
	
	ret += '\n';
	return ret;
}


function outputLinkedLibGuideAssets() {
	var a, t, m;
	var e = document.querySelectorAll('a i.s-lg-file-icon');	
	var reg1 = /fa-file-(\w+)-o/;
	var reg2 = /content_id=([0-9]+)/;

	var ret = 'LINKED LIBGUIDE ASSETS\n';
	if(e.length === 0)
		return '';
	else
		ret += 'File Type\tLink Text\tURL\tLG Asset ID\tHuman: File Type Labelled?\tHuman: Accessibility Comments\n';
	for(i=0; i<e.length; i++) {
		a = e[i].parentElement;
		t = '???';
		m = reg1.exec(e[i].className);
		if(m !== null)
			t = m[1];
		ret += t.toUpperCase() + '\t';
		ret += getAccName(a).name + '\t';
		ret += a.href + '\t';
		m = reg2.exec(a.href);
		if(m !== null)
			ret += m[1];
		ret += '\t';
		ret += '\n';
	}
	ret += '\n';
	return ret;
}

function getImgBySrc(src) {
	var e = document.querySelectorAll('img');
	for(var i=0; i<e.length; i++) 
		if(e[i].src == src)
			return e[i];
	return null;
}

function outputLibGuideImages() {
	var e,i,j;
	var imgRep = outputImages();
	if(imgRep.length == 0)
		return '';
	
	var lines = imgRep.split('\n');
	var temp = lines[0] + '\n';
	// first line of column headers
	var x = 0;
	var cols = lines[1].split('\t');
	while(x < cols.length && cols[x].indexOf('Human') == -1) {
		x += 1;
	}
	for(j=0; j<x; j++)
		temp += cols[j] + '\t';
	temp += 'Is Book Cover';
	for(j=x; j<cols.length; j++)
		temp += '\t' + cols[j];
	temp += '\n';

	for(var i=2; i<lines.length; i++) {
		var cols = lines[i].split('\t');
		if(cols.length == 1) {
			temp += lines[i] + '\n';
			continue;
		}
		for(var j=0; j<x; j++) 
			temp += cols[j] + '\t';
		if(cols[0] == 'IMG') {
			e = getImgBySrc(cols[1]);
			if(e.hasAttribute('class') && e.getAttribute('class').indexOf('s-lg-book-cover') != -1)
				temp += 'TRUE';
		}
		temp += '\t';
		
		for(j=x; j<cols.length; j++)
			temp += '\t' + cols[j];
		temp += '\n';

	}
	return temp;
}

function outputPossibleCopyPaste() {
	var ret = '';
	var i, e, n;
	
	e = document.querySelectorAll('div[style]');
	n = 0;
	for(i=0; i<e.length; i++) {
		if(e[i].style.cssText.indexOf('font-family') >= 0)
			n += 1;
		else if(e[i].style.cssText.indexOf('font-size') >= 0)
			n += 1;
	}
	if(n > 0)
		ret += 'div[style]\t' + n + '\n';
	
	e = document.querySelectorAll('p[style]');
	n = 0;
	for(i=0; i<e.length; i++) {
		if(e[i].style.cssText.indexOf('font-family') >= 0)
			n += 1;
		else if(e[i].style.cssText.indexOf('font-size') >= 0)
			n += 1;
	}
	if(n > 0)
		ret += 'p[style]\t' + n + '\n';	
		
	e = document.querySelectorAll('span[style]');
	n = 0;
	for(i=0; i<e.length; i++) {
		if(e[i].style.cssText.indexOf('font-family') >= 0)
			n += 1;
		else if(e[i].style.cssText.indexOf('font-size') >= 0)
			n += 1;
	}
	if(n > 0)
		ret += 'span[style]\t' + n + '\n';		

	e = document.querySelectorAll('big');
	if(e.length > 0)
		ret += 'big\t' + e.length;

	e = document.querySelectorAll('small');
	if(e.length > 0)
		ret += 'small\t' + e.length;	
	
	if(ret.length > 0)
		ret = 'POSSIBLE COPY-PASTE TEXT STYLES\n' + ret + '\n';
	
	return ret;
}