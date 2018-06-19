// 网页剪藏，输出包含 computedStyle 的 HTML String
const clipper = (node = document.body) => {
    traversalUsingTreeWalker(document.body);
    // var mirrorContainer = node.cloneNode(true);
    // document.body.appendChild(mirrorContainer)
    console.log(document.body.innerHTML);
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
    var s = window.getComputedStyle(node, null);
    // console.log(node.tagName, s)
    for (var key in s) {
        var property = key.replace(/\-([a-z])/g, function(v) { return v[1].toUpperCase(); });
        node.style[property] = s[key];
    }
}