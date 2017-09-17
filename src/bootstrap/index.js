var ResourceLoader = (function () {
  var TIMEOUT = 1200;
  var head = document.getElementsByTagName('head')[0];

  function load(items, onProgress, onComplete) {
    items = typeof items === 'string' ? [items] : items;

    var count = items.length;
    var loadingCount = 0;
    var pendingItems = items.slice();

    next();

    function next() {
      var item = pendingItems.shift();

      if (!item) {
        return;
      }

      loadingCount++;

      if (item instanceof Function) {
        item(onResourceLoadComplete.bind(null, item));
      } else if (isScriptsResource(item)) {
        loadScript(item === 'object' ? item.url : item, onResourceLoadComplete.bind(null, item));
      } else if (isStyleResource(item)) {
        loadStyle(item === 'object' ? item.url : item, onResourceLoadComplete.bind(null, item));

        if (item.block !== true) {
          next();
        }
      } else {
        onComplete(new Error('Unknown resource type', item))
      }
    }

    function onResourceLoadComplete(currentLoadItem, error) {
      var blockedNextResource = !(isStyleResource(item) && item.block !== true);

      if (error) {
        if (blockedNextResource) {
          onComplete(new Error('Failed to load ' + item));
        }

        return;
      }

      let itemsRemainCount = pendingItems.length;

      onProgress(itemsRemainCount > 0 ? count / itemsRemainCount : 0, currentLoadItem);

      if (--loadingCount === 0 && itemsRemainCount === 0) {
        onComplete();
        return;
      }

      if (!blockedNextResource) {
        return;
      }

      next();
    }
  };

  function loadScript(url, onComplete) {
    var loader = createLoader('SCRIPT', onComplete);

    loader.setAttribute('type', 'text/javascript');
    loader.setAttribute("src", url);

    mountLoader(loader);
  };

  function loadStyle(url, onComplete) {
    var loader = createLoader('LINK', onComplete);

    loader.setAttribute('rel', 'stylesheet');
    loader.setAttribute('href', url);

    mountLoader(loader);
  };

  function insertStyle(selector, rules, index)  {
    var sheet = load.injectStyle.sheet;
    if (!sheet) {
      var style = document.createElement("style");
      style.appendChild(document.createTextNode(""));
      head.appendChild(style);
      sheet = load.injectStyle.sheet = style.sheet;
    }

    try {
      if ("insertRule" in sheet) {
        sheet.insertRule(selector + "{" + rules + "}", index || 0);
      } else if ("addRule" in sheet) {
        sheet.addRule(selector, rules, index || 0);
      }
    } catch (e) {
      console.error(e.stack || e.message || e);
    }
  }

  function createLoader(type, onComplete) {
    var loader = document.createElement(type);
    var timeoutTimerHandle = null;

    if ('onload' in loader) {
      loader.onload = onLoad;
    } else {
      loader.onreadystatechange = function () {
        if (this.readyState == 'loaded' || this.readyState == 'complete') {
          onLoad();
        }
      };
    }

    loader.onerror = onError;

    timeoutTimerHandle = setTimeout(onError, TIMEOUT);

    return loader;

    function onLoad() {
      loader.onload = loader.onerror = undefined;

      clearTimeout(timeoutTimerHandle);

      callback();
    };

    function onError() {
      loader.onload = loader.onerror = undefined;

      callback(true);
    };
  }

  function mountLoader(loader) {
    head.appendChild(loader);
  }

  function isStyleResource(item) {
    return typeof item === 'object' ? item.type === 'style' : /\.css$/i.test(item);
  }

  function isScriptsResource(item) {
    return typeof item === 'object' ? item.type === 'scripts' : /\.js$/i.test(item);
  }

  return {
    load: load,
    loadScript: loadScript,
    loadStyle: loadStyle,
    insertStyle: insertStyle,
  };
})();
