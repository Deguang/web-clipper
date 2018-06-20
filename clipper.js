// 网页剪藏，输出包含 computedStyle 的 HTML String
const clipper = (node = document.body) => {
    var mirrorContainer = node.cloneNode(true);
    var e = document.createElement("iframe");
    e.style.width = e.style.height = 0;
    document.documentElement.appendChild(e);

    traversalUsingTreeWalker(mirrorContainer);
    console.log(mirrorContainer.outerHTML);


}

function traversalUsingTreeWalker(node){
    var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT,null,false);
    console.log('node: ', node);
    if(node && node.nodeType === 1){
        console.log('tagName(1): ', node.tagName);
        setInlineStyle(node);
    }
    var node = treeWalker.nextNode();
    while(node != null){
        console.log("tagName(!1): ",node.tagName);
        setInlineStyle(node);
        node = treeWalker.nextNode();
    }
}

function setInlineStyle(node) {
    var n = {}, r = node && 1 === node.nodeType ? window.getComputedStyle(node, null) : null;
    // debugger
    // if (r) {
    //     for (var i = 0; i < r.length / 2; i++) {
    //         var o = r.item(i);
    //         null != o && (n[o] = r.getPropertyValue(o))
    //     }
    // }
    // console.log(node.tagName, s)
    // for (var key in s) {
    //     var property = key.replace(/\-([a-z])/g, function(v) { return v[1].toUpperCase(); });
    //     node.style[property] = s[key];
    // }
    var t = "";
    for (var key in r) {
        console.log(key, r[key])
        t += key + ":" + r[key] + ";";
    }
    node.setAttribute("style", t.trim());
}

clipper(document.getElementById('resume-detail-wrapper'))