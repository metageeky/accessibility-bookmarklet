
// KNOWN_REQUIREMENTS Code for A11Y Tools in libraries directory
if(typeof document.A11Y_REQUIREMENTS === 'undefined')
	document.A11Y_REQUIREMENTS = [];
// Uncomment any files that are required
document.A11Y_REQUIREMENTS.push('axe.min.js');
document.A11Y_REQUIREMENTS.push('tabbable.js');
document.A11Y_REQUIREMENTS.push('w3c-alternative-text-computation.js');
//document.A11Y_REQUIREMENTS.push('general-report-tests.js');

// shibboleth for detecting loading
var _shibA11YGenRepTests = 1;

// Functions below are used to generate the general A11Y Report
///////////////////////////////////////////////////////////////
/* HEADINGS CODE */
function getHeadingsOutline() {
	var e = 0;
	var t = document.querySelectorAll('h1,h2,h3,h4,h5,h6,h7,[role="heading"]');
	var i = [];
	for(o = 0; o < t.length; o++) {
		var n = t[o],
			 l = isVisible(t[o]),
			 r = parseInt("heading" == n.getAttribute("role") && n.getAttribute("aria-level") || n.nodeName.substr(1));
		if(l) {
			 var d = r > e && r !== e + 1;
			 e = r
		}
		else
			d = !1;
		i.push({
			visible: l,
			visuallyhidden: l && isVisuallyHidden(n),
			wrong: d,
			level: r,
			el: n
		})
	}
	return i;
 }

function outputHeadings() {
	var outline = getHeadingsOutline();
	var ret = '';
	ret += 'HEADINGS\n';
	ret += 'Level\tText\tVisibility\tCorrect\n';
	for(i = 0; i < outline.length; i++) {
			var o = outline[i];
		if(!o.visible) continue;
			ret += 'H' + o.level + '\t' + o.el.textContent.replace(/\s+/g, " ");
		ret += '\t' + !o.visuallyhidden;
		ret += '\t' + !o.wrong;
		ret += '\n';
	}
	ret += '\n';
	return ret;
}


/* POSSIBLE HEADINGS */
function outputPossibleHeadings() {
	var e = document.querySelectorAll('p,div,span');
	var ret = '';
	var i;

	for(i=0; i<e.length; i++) {
		var t = e[i].innerText.trim();
		var s = window.getComputedStyle(e[i]);
		if(s['display'] === 'block' && t.length > 0 && t.length <= 100) {
			if(parseInt(s['font-size']) >= 20 || parseInt(s['font-weight']) > 400) {
				ret += e[i].nodeName + '\t';
				ret += t + '\t' + t.length + '\t';
				ret += s['font-size'] + '\t' + s['font-weight'] + '\n';
			}
		}

	}
	if(ret.length > 0) {
		ret = 'Node\tText\tLength\tSize\tWeight\n' + ret;
	}
	else {
		ret += 'No possible headings detected\n';
	}
	ret = 'POSSIBLE HEADINGS\n' + ret + '\n';
	return ret;
}

function isQuestionableHeading(t) {
	t = t.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
	var contains = ['click here', 'click'];
	var is = ['click here', 'here', 'more', 'details',
				 'more details', 'link', 'this page', 'continue',
				 'continue reading', 'read more', 'button'
				];
	var i;
	for(i=0; i<contains.length; i++)
		if(t.includes(contains[i]))
			return true;
	for(i=0; i<is.length; i++)
		if(t == is[i])
			return true;
	return false;
}

/* LANDMARKS */
function outputLandmarks() {
	var i;
	var f = document.querySelectorAll('[role=main], [role=search], \
												  [role=banner], [role=contentinfo], \
												  [role=navigation], [role=complementary], \
												  [role=application], main, banner, \
												  footer, header, aside, nav');

	var e = [];
	for(i=0; i<f.length; i++)
		if(isVisible(f[i]))
			e.push(f[i]);

	var ret = 'LANDMARKS\n';
	if(e.length == 0) {
		ret += 'No landmarks\n\n';
		return ret;
	}

	/* determine hierarchical levels:
		e[i].pIndex is	the "parent" of e[i]
		e[i].level is the nesting level
	*/
	e[0].pIndex = null;
	for(i=1; i<e.length; i++) {
		if(e[i-1].contains(e[i]))
			e[i].pIndex = i-1;
		else {
			j = 2;
			e[i].pIndex = null;
			while(i-j >= 0) {
				if(e[i-j].contains(e[i]))
					e[i].pIndex = i-j;
				j++;
			}
		}
	}
	for(i=0;i<e.length; i++) {
		e[i].level = 0;
		p = e[i].pIndex;
		while(p != null) {
			e[i].level += 1;
			p = e[p].pIndex;
		}
	}

	/* output */
	ret += 'Level\tNode\tRole\tName\tDescription\tVisibility\n';
	for(i=0; i<e.length; i++) {
		n = getAccName(e[i]);
		ret += (e[i].level + 1) + '\t' + e[i].nodeName;
		ret += '\t' + (e[i].hasAttribute('role') ? e[i].getAttribute('role') : '');
		ret += '\t' + n.name + '\t' + n.desc;
		ret += '\t' + !isVisuallyHidden(e[i]) + '\n';
	}

	ret += '\n';
	return ret;
}


/* AXE RESULTS */
function outputAxeResults(rep) {
	var ret, tmp, i, a, n;
	var ret = '';
	ret += 'AXE REPORT\n';
	/* test instance */
	a = rep.testEnvironment;
	ret += 'Browser Instance\tWidth\tHeight\n';
	ret += a['userAgent'] + '\t' + a['windowWidth'] + '\t' + a['windowHeight'] + '\n';
	/* incompletes */
	a = rep.incomplete;
	if(a.length > 0) {
		tmp = 'Description\tURL\tInstances\n';
		n = 0;
		for(i=0; i<a.length; i++) {
			tmp += a[i].help + '\t' + a[i].helpUrl + '\t' + a[i].nodes.length + '\n';
			n += a[i].nodes.length;
		}
		ret += 'Incompletes\t' + n + '\n';
		ret += tmp;
	}

	/* violations */
	a = rep.violations;
	if(a.length > 0) {
		tmp = 'Description\tURL\tInstances\n';
		n = 0;
		for(i=0; i<a.length; i++) {
			tmp += a[i].help + '\t' + a[i].helpUrl + '\t' + a[i].nodes.length + '\n';
			n += a[i].nodes.length;
		}
		ret += 'Violations\t' + n + '\n';
		ret += tmp;
	}

	ret += '\n';
	return ret;
}

/* TABBABLES */
function outputTabbables() {
	var e, i, m;
	var ret = '';
	ret += 'TABBING REPORT\n';
	var t = tabbable(document.body);
	if(t.length == 0)
		ret += 'No tabbable elements on page';
	else
		ret += '#\tType\tAcc Name\t Acc Description\tTabindex\tQuestionable\tRedundant Title\tEmpty Link\tHuman: Visible on Focus?\tHuman: Ordering Sense?\n';
	for(i=0; i<t.length; i++) {
		e = t[i];
		n = window.getAccName(e);
		ret += (i+1) + '\t' + e.nodeName + '\t';
		ret += n.name + '\t' + n.desc + '\t';
		ret += (e.hasAttribute('tabindex') ? e.tabIndex : 'NA') + '\t';
		ret += isQuestionableHeading(n.name) + '\t';
		if(e.hasAttribute('title') && e.title == n.name)
			ret += 'TRUE';
		ret += '\t';
		if(e.nodeName === 'BUTTON' || e.nodeName === 'A')
			if (getTextPlusAlt(e).trim() === '')
				ret += 'TRUE';

		ret += '\n';
	}

	ret += '\n';
	return ret;
}



/* IMAGES */

function checkAltQuality(e) {
	var n = e.getAttribute('alt');
	return n && n.length > 0 && ( - 1 !== n.search(/^(image|graphic|photo|photograph|drawing|painting|artwork|logo|bullet|button|arrow|more|spacer|blank|chart|table|diagram|graph|\*)$/i) || - 1 !== n.search(/(^(graphic of|bullet|image of).*)|(.*(image|graphic)$)|(^ +$)|.*(\.png|\.gif|\.jpeg|\.jpg|\.bmp)$/i));
}

function outputImages() {
	var e = document.querySelectorAll('img,svg,[role="img"]');
	var ret = '';
	var i, t, f, j, n;

	for(i=0; i<e.length; i++) {
		if(!isVisible(e[i])) continue;
		n = e[i].nodeName.toUpperCase();
		ret += n;
		if(e[i].hasAttribute('role'))
			ret += ' role="' + e[i].attributes['role'].value + '"';
		ret += '\t';
		if(e[i].hasAttribute('src'))
			ret += e[i].src;
		ret += '\t';
		if(e[i].hasAttribute('alt')) {
			t = e[i].attributes['alt'].value;
			if(t.length == 0)
				ret += '""';
			else
				ret += t;
		}
		ret += '\t';
		if(e[i].hasAttribute('aria-label')) {
			t = e[i].attributes['aria-label'].value;
			if(t.length == 0)
				ret += '""';
			else
				ret += t;
		}
		else if(e[i].hasAttribute('aria-labelledby')) {
			var t = e[i].attributes['aria-labelledby'].value;
			var f = document.getElementById(t);
			if(f === null)
				ret += '!missing!';
			else
				ret += f.innerText;
		}
		ret += '\t';
		if(e[i].hasAttribute('aria-describedby')) {
			t = e[i].attributes['aria-describedby'].value;
			f = document.getElementById(t);
			if(f === null)
				ret += '!missing!';
			else
				ret += f.innerText;
		}
		ret += '\t';
		if(e[i].hasAttribute('title')) {
			t = e[i].attributes['title'].value;
			if(t.length == 0)
				ret += '""';
			else
				ret += t;
		}
		ret += '\t';
		if(n === 'SVG') {
			f = e[i].querySelectorAll('title');
			t = '';
			for(j=0; j<f.length; j++)
				t += ' | ' + f[i].textContent;
			ret += t;
		}
		ret += '\t';
		if(n === 'IMG' && checkAltQuality(e[i]))
			ret += 'TRUE';
		ret += '\t';

		n = getAccName(e[i]);
		ret += n.name + '\t' + n.desc + '\t';

		ret += '\t'; // for the human opinion
		ret += '\n';
	}
	if(ret.length > 0) {
		ret = 'Node\tSRC\tAlt\taria-label(by)\taria-describedby\tTitle\tSVG Title\tIffy ALT\tAccesssible Name\tAccessible Description\tHuman: Alt Quality\n' + ret;
	}
	else {
		ret += 'No images found\n';
	}
	ret = 'IMAGES\n' + ret + '\n';
	return ret;
}


/* AUDIO/VIDEO */
function outputAudioVideo() {
	var a, i, j, ret;
	var e = [];
	var c = document.querySelectorAll('embed');
	for(i=0; i<c.length; i++) {
		a = c[i].getAttribute('href');
		if(a && - 1 !== a.search(/(\.mov|\.asx|\.wvx|\.wax|\.wmv|\.wma|\.ram|\.rpm|\.ra|\.rm)$/i))
			e.push(c[i]);
	}
	c = document.querySelectorAll('video, audio, embed[type=\'video/quicktime\'], object[classid=\'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B\'], embed[type=\'application/x-mplayer2\'], object[classid=\'clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95\'], object[classid=\'clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6\'], embed[type=\'audio/x-pn-realaudio-plugin\'], object[classid=\'clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA\']');
	for(i=0; i<c.length; i++)
		e.push(c[i]);
	c = document.querySelectorAll('iframe[src*="youtube"], iframe[src*="youtu.be"], iframe[src*="ensemble"], iframe[src*="vimeo"], iframe[src*="dailymotion"]');
	for(i=0; i<c.length; i++)
		e.push(c[i]);

	ret = 'EMBEDDED AUDIO/VIDEO\n';
	if(e.length == 0) {
		ret += 'No audio/video detected.\n\n'
		return ret;
	}
	ret += 'Node\tSrc\tSources\tCaptioned\tTranscript\n'
	for(i=0; i<e.length; i++) {
		ret += e[i].nodeName + '\t';
		if(e[i].hasAttribute('src'))
			ret += e[i].src;
		ret += '\t';
		if(e[i].nodeName === 'VIDEO' || e[i].nodeName === 'AUDIO') {
			var c = e[i].querySelectorAll('source');
			for(j=0; j<c.length; j++)
				ret += '| ' + (c[j].hasAttribute('src') ? c[j].src : '');
		}
		ret += '\t\n';
	}
	ret += '\n';
	return ret;
}


/* LINKED FILES */
function outputLinkedFiles() {
	var e = document.querySelectorAll('[href$="xls"], [href$="xlsx"], [href$="doc"], [href$="docx"], [href$="ppt"], [href$="pptx"], [href$="pdf"], [href$="rtf"], [href$="wpd"], [href$="ods"], [href$="odt"], [href$="odp"], [href$="sxw"], [href$="sxc"], [href$="sxd"], [href$="sxi"], [href$="pages"], [href$="key"]');

	var i,f,g;
	var ret = '';

	ret = 'LINKED FILES\n';
	if(e.length === 0)
		ret += 'No linked files detected.\n';
	else
		ret += 'File Type\tLink Text\tFile Name\t\Labelled as tAccessibility Comments\n';
	for(i=0; i<e.length; i++) {
		f = e[i].href.substring( e[i].href.lastIndexOf('/') + 1 );
		g = f.substring( f.lastIndexOf('.') + 1);
		ret += g.toUpperCase() + '\t';
		ret += e[i].innerText.trim() + '\t';
		ret += f + '\t';
		ret += '\n';
	}
	ret += '\n';
	return ret;
}


/* FONT ICON DETECT */
function outputFontIconDetect() {
	var ret = '';
	var f = { '[class*="fa-"]':'Font Awesome',
				 '[class*="icon-"]':'IcoMoon/Fontello',
				 '[class*="zmdi"]':'Material Design Iconic',
				 '[class*="gg-"]':'css.gg',
				 '[class*="glyphicon-"]':'Glyphicons',
				 '[class*="material-icons"]':'Material Icons'};
	for(var i in f) {
		if(document.querySelectorAll(i).length > 0)
			ret += f[i] + '\n';
	}
	if(ret.length == 0)
		ret = 'No icont fonts potentially detected.\n'

	return 'ICON FONTS\n' + ret + '\n';
}