(function() {
  if (window.shrimp) return;

  function createWrapperEl() {
    var el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.zIndex = '100000';
    el.style.bottom = '0';
    el.style.right = '0';
    el.style.left = '0';
    el.style.borderTop = '1px solid #999';
    return el;
  }

  function createResizeEl() {
    var el = document.createElement('div');
    el.style.backgroundColor = '#eee';
    el.style.borderBottom = '1px solid #999';
    el.style.borderTop = '1px solid #fff';
    el.style.padding = '1px 6px';
    el.style.cursor = 'row-resize';
    return el;
  }

  function createConsoleEl() {
    var el = document.createElement('div');
    el.style.overflowY = 'scroll';
    el.style.wordWrap = 'break-word';
    el.style.height = '180px';
    el.style.backgroundColor = '#fff';
    return el;
  }

  function createLogEl(type) {
    var el = document.createElement('div');
    el.style.padding = '3px 5px';
    el.style.borderBottom = '1px solid #ddd';
    el.style.fontSize = '13px';
    el.style.fontFamily = 'Monaco,Consolas,monospace';
    if(type === "error") el.style.color = '#f00';
    else if(type === "info") el.style.color = '#00f';
    else el.style.color = '#000';
    return el;
  }

  function initOrDestroyFromHash() {
    if (window.location.hash.match(/^#debug/)) window.shrimp.init();
    else window.shrimp.destroy();
  }

  function print(text, type, shouldRecord) {
    if(shouldRecord) logs.push({type: type, text: text});

    if (typeof consoleEl === "undefined") return;
    var logEl = createLogEl(type);
    logEl.innerHTML = text;
    consoleEl.appendChild(logEl);
    consoleEl.scrollTop = 999999999;
  }

  window.shrimp = {};
  var logs = [];
  var wrapperEl, resizeEl, consoleEl;
  var docmode = document.documentMode;

  window.shrimp.init = function() {
    if (typeof consoleEl !== "undefined") return;
    wrapperEl = createWrapperEl();
    resizeEl = createResizeEl();
    consoleEl = createConsoleEl();
    wrapperEl.appendChild(resizeEl);
    wrapperEl.appendChild(consoleEl);
    document.getElementsByTagName('body')[0].appendChild(wrapperEl);
    for(var i = 0; i < logs.length; i++) {
      var log = logs[i];
      print(log.text, log.type, false);
    }
  };

  window.shrimp.destroy = function() {
    if (typeof wrapperEl === "undefined") return;
    document.getElementsByTagName('body')[0].removeChild(wrapperEl);
    wrapperEl = undefined;
    resizeEl = undefined;
    consoleEl = undefined;
  };

  window.shrimp.log = function(text) {
    print(text, "log", true);
  };

  window.shrimp.info = function(text) {
    print(text, "info", true);
  };

  window.shrimp.error = function(text) {
    print(text, "error", true);
  };

  window.onerror = function(message, url, line) {
    shrimp.error(message+" Url:"+url+" Line:"+line);
  };

  if ('onhashchange' in window && (typeof docmode === "undefined" || docmode > 7 )) {
    window.addEventListener("hashchange", initOrDestroyFromHash);
  }
  initOrDestroyFromHash();
})();
