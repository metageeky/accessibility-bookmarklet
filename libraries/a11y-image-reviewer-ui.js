// KNOWN_REQUIREMENTS Code for A11Y Tools in libraries directory
if(typeof document.A11Y_REQUIREMENTS === 'undefined')
	document.A11Y_REQUIREMENTS = [];
document.A11Y_REQUIREMENTS.push('w3c-alternative-text-computation.js');

var _shibA11YImgRev = 1;


function createImageReviewer()  { 
	var containerId = 'a11y-image-viewer';
	var containerStyle = 'display:flex; flex-direction:row; flex-wrap:nowrap; justify-content:center; align-content:center; align-items: center; position: fixed; height: auto; width: 100%; background: rgba(0,0,0,0.5); z-index: 1000001; top:0; bottom: 0; left: 0; right: 0;';
	
	var container = document.getElementById(containerId);
	if(container)
		document.body.removeChild(container);
	container = document.createElement("DIV");
	container.id = containerId;
	container.style.cssText = containerStyle;

	var iframe = document.createElement("IFRAME");
	iframe.id = 'a11y-img-viewer';
	iframe.style.cssText = 'border: solid 2px #284900; width: 450px; max-width:80%; min-height:180px; height:90%; max-height: 90%';
	
	var doc;
	container.appendChild(iframe), iframe.onload = function() { 
		(doc = iframe.contentWindow.document).open(), doc.write(
			'<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,minimum-scale=1.0,initial-scale=1,user-scalable=yes"><style>* { margin:0; padding:0; border:0; box-sizing:border-box} body { overflow-y:hidden; background:#fff; font-size:16px; font-family:sans-serif} button::-moz-focus-inner { border:0} #ibar { padding: 0 15px; text-align:center; margin:0 auto 10px; display:flex; flex-direction:row; flex-wrap:nowrap; justify-content:center; align-content:center; align-items:center} button { line-height:1; color:#fff; background:#284900; border:2px solid #284900; cursor:pointer} #ibar button { font-size:32px; padding:0 5px; margin:0 5px} #ibar button:disabled { background: #eee; color:#333; border-color: #eee; cursor: default;} button:focus,button:hover { background:#506b2f; border-color:#506b2f} button:focus { border-color:#fff; border-style:dotted} #ibar>div { padding:0 4px; flex: 1 0 auto;} .imgbar { border:solid 1px #284900} .imgpanel { padding:10px 15px} .theimg { overflow-x:auto; text-align: center; background: #d0d0d0; padding: 10px; margin:0 auto} .imgpanel table { margin:8px auto 1px} .imgpanel td { vertical-align:top; padding-bottom:3px} .imgpanel tr td:first-of-type { padding-right:3px; font-weight:700} header { padding-left:10px; color:#fff; background-color:#284900; display:flex; flex-wrap:nowrap; align-content:baseline} h1 { font-size:1.2rem; flex:1 1 auto; padding:8px 0} header button { padding:0 8px; font-size:1.1rem} main { overflow-y: scroll; padding-bottom:15px} #noImages { display:none; text-align: center; padding: 10px; font-weight: 700; </style></head><body><header><h1>A11Y Image Reviewer</h1><button aria-label="close"id="imgclose">&#215;</button></header><main id="result"><div id="imgbar"><div class="imgpanel"><div class="theimg"></div><div id="noImages">NO IMAGES ON PAGE</div><table role="presentation"><tr><td>Alt:</td><td id="alt"></td></tr><tr><td>Long:</td><td id="long"></td></tr></table></div><div id="ibar"><button disabled aria-label="first image"id="first"type="button">&#11120;</button> <button disabled aria-label="previous image"id="prev">&#11104;</button><div><span id="cur"></span> of <span id="tot"></span></div><button aria-label="next image"id="next">&#11106;</button> <button aria-label="last image"id="last">&#11122;</button></div></div></main></body></html>'
		), doc.close();
		
		var t;
		t = doc.getElementById('imgclose');
		t && t.addEventListener("click", function(e)  {
			window.scrollTo(doc._scrollX, doc._scrollY);
			document.body.removeChild(container);
		});
		t = doc.getElementById('first');
		t && t.addEventListener("click", function(e)  { 
			doc._cur = 0;
			updateImageReviewer(doc);
			updateCurrentImage(doc);
		});
		t = doc.getElementById('prev');
		t && t.addEventListener("click", function(e)  { 
			doc._cur -= 1;
			updateImageReviewer(doc);
			updateCurrentImage(doc);
		});
		t = doc.getElementById('next');
		t && t.addEventListener("click", function(e)  { 
			doc._cur += 1;
			updateImageReviewer(doc);
			updateCurrentImage(doc);
		});
			t = doc.getElementById('last');
		t && t.addEventListener("click", function(e)  { 
			doc._cur = doc._tot - 1;
			updateImageReviewer(doc);
			updateCurrentImage(doc);
		});
		
		// set up vertical scroll on main
		window.onresize = setImgMainHeight;
		setImgMainHeight();
			
		// images and index		
		doc._scrollX = window.scrollX;
		doc._scrollY = window.scrollY;
		doc._images = getImages();		
		doc._cur = 0;
		doc._tot = doc._images.length;
		if(doc._tot > 0) {		
			doc.getElementById('cur').innerText = (doc._cur + 1);
			doc.getElementById('tot').innerText = (doc._tot);
			updateCurrentImage(doc);
		}
		else {
			doc.getElementById('cur').innerText = 0;
			doc.getElementById('tot').innerText = 0;
			doc.getElementById('first').disabled = true;
			doc.getElementById('prev').disabled = true;
			doc.getElementById('next').disabled = true;
			doc.getElementById('last').disabled = true;
			doc.getElementById('noImages').style.display = 'block';
			doc.querySelector('.theimg').style.display = 'none';
			doc.querySelector('table').style.display = 'none'
		}
			
	}, document.body.appendChild(container);
	
	return iframe;
}
	
function setImgMainHeight() {
	var iframe = document.getElementById('a11y-img-viewer');
	if(!iframe) return;
	var doc = iframe.contentWindow.document;
	if(!doc) return;
	var if_h = iframe.getBoundingClientRect().height;
	var he_h = doc.querySelector('header').getBoundingClientRect().height;
	doc.querySelector('main').style.height = (if_h - he_h) + 'px';
}

function updateImageReviewer(doc) {
	doc.getElementById('cur').innerText = (doc._cur + 1);		
	var buttons = doc.querySelectorAll('#ibar button');
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

function getImages() {
	var e = document.querySelectorAll('img,svg,[role="img"]');
	var ret = [];
	for(i=0; i<e.length; i++) {
		if(!isVisible(e[i])) continue;
		ret.push(e[i]);
	}
	return ret;					
}

function updateCurrentImage(doc) {
	var i = doc._cur;
	var e = doc._images[i];
	e.scrollIntoView();
	var ratio,w,h,brect,bbox;
	var frame = document.getElementById('a11y-img-viewer');
	var mw = doc.querySelector('.theimg').getBoundingClientRect().width;
	if(doc.querySelector('.theimg').style.width == '')
		doc.querySelector('.theimg').style.width = (mw) + 'px';
	mw -= 20; // padding
	
	var accName = getAccName(e);
	doc.getElementById('alt').textContent = accName.name;
	doc.getElementById('long').textContent = accName.desc;
	
	if(e.nodeName === 'IMG') {
		brect = e.getBoundingClientRect();
		doc.querySelector('.theimg').innerHTML = '<img src="' + e.src + '">';
		var f = doc.querySelector('.theimg img');
		if(brect.width <= mw) {
			f.style.width = brect.width + 'px';
			f.style.height = brect.height + 'px';
		}
		else {
			f.style.width = '100%';
			f.style.height = 'auto';
		}			
	}	
	else if(e.nodeName === 'svg') {
		brect = e.getBoundingClientRect();
		bbox = e.getBBox();
		w = brect.width ? brect.width : bbox.width;
		h = brect.height ? brect.height: bbox.height;
		ratio = mw/w;

		doc.querySelector('.theimg').innerHTML = e.outerHTML;
		var f = doc.querySelector('.theimg svg');
		if(w > mw) {
			f.style.transform = 'scale(' + (Math.round(mw/w*100)/100) + ')';
			f.style.margin = '-' + Math.round((1-ratio)*h/2) + 'px -' + Math.round((1-ratio)*w/2) + 'px';
		}	
	}
	else if(e.getAttribute('role') === 'img') {
		doc.querySelector('.theimg').innerHTML = '';
		var f = e.cloneNode();
		copyStyleRecursion(e,f);
		doc.querySelector('.theimg').appendChild(f);		
	}
	else {
		doc.querySelector('.theimg').innerHTML = 'Odd case. Contact <a href="mailto:katherine.deibel@gmail.com">developer</a>';
	}

}

function copyStyleRecursion(e,f) {
	if(e.nodeType !== Node.ELEMENT_NODE || f.nodeType !== Node.ELEMENT_NODE)
		return;

	var e_style = window.getComputedStyle(e);
	if (e_style.cssText !== '') {
		f.style.cssText = e_style.cssText;
	} 
	else {
		const cssText = Object.values(e_style).reduce(
        (css, propertyName) =>
            `${css}${propertyName}:${e_style.getPropertyValue(propertyName)};`
		);
		f.style.cssText = cssText;
	}
    
	var c_e = e.childNodes;
	var c_f = f.childNodes;
	var i;
	for(i=0; i < c_e.length; i++)
		copyStyleRecursion(c_e[i], c_f[i]);
}