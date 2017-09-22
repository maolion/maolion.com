var AppBootstrap = (function() {
  var TIMEOUT = 12000;
  var head = document.getElementsByTagName('head')[0];

  return {
    start: start,
  };

  function start(items, process) {
    var listeners = { };

    process(
      // ready
      function (handler) { listeners.ready = handler },
      // progress
      function (handler) { listeners.process = handler },
      // error
      function (handler) { listeners.error = handler },
      // done
      function (handler) { listeners.done = handler }
    );

    onReady();

    load(items, onProgress, function (error) {
      if (error) {
        onError(error);
      } else {
        onDone();
      }
    });

    function onReady() {
      if (listeners.ready) {
        listeners.ready(items);
      }
    }

    function onProgress(percent, nextResourceUrl) {
      if (listeners.process) {
        listeners.process(percent, nextResourceUrl);
      }
    }

    function onError(reason) {
      if (listeners.error) {
        listeners.error(reason);
      }
    }

    function onDone() {
      if (listeners.done) {
        listeners.done();
      }
    }
  }

  function load(items, onProgress, onComplete) {
    items = typeof items === 'string' ? [items] : items;

    var count = items.length;
    var loadingCount = 0;
    var pendingItems = items.slice();

    next();

    function next() {
      var item = pendingItems.shift();

      var loadedCount = count - pendingItems.length - (loadingCount + 1);

      onProgress(loadedCount > 0 ? loadedCount / count : 0, item);

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
      var blockedNextResource = !(isStyleResource(currentLoadItem) && currentLoadItem.block !== true);

      if (error) {
        if (blockedNextResource) {
          onComplete(new Error('Failed to load ' + currentLoadItem));
        }

        return;
      }

      loadingCount = Math.max(loadingCount - 1, 0);

      var loadedCount = count - pendingItems.length - loadingCount;

      if (loadingCount === 0 && loadedCount === count) {
        onProgress(1);
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

      onComplete();
    };

    function onError() {
      loader.onload = loader.onerror = undefined;

      onComplete(true);
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
})();
