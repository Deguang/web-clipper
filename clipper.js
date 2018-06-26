/**
 * 网页剪藏，输出包含 computedStyle 的 HTML String
 * @param {NodeElement} node, default: document.body
 * @param {string} rmSelector, default: null
 */
function clipper (node = document.body, rmSelector = null) {
    var iframe = document.createElement("iframe");
    iframe.setAttribute('id', 'mirror-container');
    iframe.style.width = iframe.style.height = 0;
    document.documentElement.appendChild(iframe);
    var mirrorContainer = document.getElementById('mirror-container');
    setTagANDgetStyle(node);
    var mirrorNode = node.cloneNode(true);
    rmNoPrint(mirrorNode, rmSelector);
    // convertImgToBase64(mirrorNode);
    mirrorContainer.contentDocument.body.appendChild(mirrorNode);
    filterStyle(mirrorContainer.contentDocument.body);
    console.log(mirrorContainer.contentDocument.body.innerHTML);
    document.documentElement.removeChild(iframe);
};

/**
 * 
 * @param {Node} container 
 * @param {String} rm , multi filter use , to concat
 */
function rmNoPrint(container, rm) {
    if(null == rm) return;
    rm.split(',').forEach(function(item) {
        var rmList = container.querySelectorAll(item);
        rmList.forEach(node => {
            var pa = node.parentNode;
            if(pa) {
                pa.removeChild(node)
            }
        })
    })
}

function convertImgToBase64(container) {
    var imgList = container.querySelectorAll('img');
    imgList.forEach(node => {
        toDataURL(node.src, function(dataUri){
            console.log(dataUri);
            node.setAttribute('src', dataUri)
        })
    })
}

function toDataURL(src, callback) {
    var x = new XMLHttpRequest();
    x.open('GET', 'https://cors-anywhere.herokuapp.com/' + src);
    x.responseType = 'blob';
    x.onload = function() {
        var blob = x.response;
        var fr = new FileReader();
        fr.onloadend = function() {
            var dataUrl = fr.result;
            callback(dataUrl);
        };
        fr.readAsDataURL(blob);
    };
    x.send();
}

var CSSList = [],
    curStyle = void 0;

function setTagANDgetStyle(node) {
    var n = 0,
        loop = function loopNode(node) {
            var style = reduceComputedStyle(node);
            CSSList[n] = style, node.setAttribute("data-clipper-id", n++);
            for (var o = 0; o < node.children.length; o++) {
                loopNode(node.children.item(o))
            }
        };
    loop(node)
}

function reduceComputedStyle(node) {
    var n = {}, r = node && 1 === node.nodeType ? window.getComputedStyle(node, null) : null;
    if (!r) return n;
    for (var i = 0; i < r.length / 2; i++) {
        var o = r.item(i);
        null != o && (n[o] = r.getPropertyValue(o))
    }
    return n
}

function filterStyle(node){
    for (var n = 0, len = node.children.length; n < len; n ++) {

        var item = node.children.item(n),
            index = item.getAttribute('data-clipper-id');

        if (null != index) {
            item.removeAttribute('data-clipper-id');
            item.removeAttribute('style');
            var style = CSSList[index],
            curStyle = curStyle || reduceComputedStyle(item),
                cptStyle = filterInheritStyle(curStyle, style);
            if(Object.keys(cptStyle).length) {
                item.setAttribute('style',((style) =>{
                    var t = "";
                    for (var n in style) t += n + ":" + style[n] + ";";
                    return t.trim()
                })(cptStyle));
                var rCptStyle = filterInheritStyle(reduceComputedStyle(item), style);
                if(Object.keys(rCptStyle).length) {
                    for (var h in rCptStyle) cptStyle[h] = rCptStyle[h];
                    item.setAttribute('style',((style) =>{
                        var t = "";
                        for (var n in style) t += n + ":" + style[n] + ";";
                        return t.trim()
                    })(cptStyle));
                }
            }
            filterStyle(item);
        }
    }
}

function filterInheritStyle(e, t) {
    var n = {};
    for (var r in t) e[r] !== t[r] && (n[r] = t[r]);
    return n
}

module.exports = clipper