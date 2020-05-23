// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $dlg = $(".dlg-container");
var $cancelBtn = $(".cancel-btn");
var $siteList = $(".site-list");
var $deleteBtn = $(".delete-btn");
var $finishBtn = $(".finish-btn");
var siteStorage = JSON.parse(localStorage.getItem("siteStorage"));
var siteList = siteStorage || [{
  siteName: 'CSDN',
  siteLink: 'https://www.csdn.net/',
  siteLetter: 'D'
}, {
  siteName: 'GitHub',
  siteLink: 'https://github.com/',
  siteLetter: 'G'
}, {
  siteName: '掘金',
  siteLink: 'https://juejin.im/',
  siteLetter: 'J'
}];
var dlg = {
  show: function show() {
    var site = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      siteName: '',
      siteLink: ''
    };
    var siteName = site.siteName,
        siteLink = site.siteLink;
    $("#siteName").val(siteName);
    $("#siteLink").val(siteLink);
    $dlg.removeClass("hide-dlg");
  },
  hide: function hide() {
    var reload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (reload) {
      loadSiteList();
    }

    $dlg.addClass("hide-dlg");
  },
  selIndex: null
};
loadEvent();
loadSiteList(); //加载网站列表

function loadSiteList() {
  var htmlList = [];
  siteList.forEach(function (site, index) {
    var html = "\n        <a href=\"".concat(site.siteLink, "\" target=\"_blank\">\n            <li class=\"site-item\">\n                <div class=\"icon\">").concat(site.siteLetter, "</div>\n                <div class=\"title\">").concat(site.siteName, "</div>\n                <button data-index=\"").concat(index, "\" class=\"list-more\" title=\"\u4FEE\u6539\u5FEB\u6377\u65B9\u5F0F\"></button>\n            </li>\n        </a>");
    htmlList.push(html);
  });
  htmlList.push("<li class=\"site-item\" id=\"addSite\">\n            <div class=\"icon add-icon\"></div>\n            <div class=\"title\">\u6DFB\u52A0\u5FEB\u6377\u65B9\u5F0F</div>\n        </li>");
  $siteList.html(htmlList.join(""));
  $("#addSite").click(function (e) {
    dlg.selIndex = null;
    dlg.show();
  });
  $(".list-more").click(function (e) {
    var index = e.target.dataset.index;
    dlg.selIndex = index;
    dlg.show(siteList[index]);
    e.stopPropagation();
    e.preventDefault();
  });
} //加载事件


function loadEvent() {
  $cancelBtn.click(function (e) {
    dlg.hide();
  });
  $finishBtn.click(function (e) {
    var siteName = $("#siteName").val();
    var siteLink = $("#siteLink").val();

    if (siteName && siteLink) {
      var site = getSite(siteName, siteLink);

      if (dlg.selIndex < siteList) {
        siteList[dlg.selIndex] = site;
      } else {
        siteList.push(site);
      }

      dlg.hide(true);
    }
  });
  $deleteBtn.click(function () {
    if (dlg.selIndex) {
      siteList.splice(dlg.selIndex, 1);
    }

    dlg.hide(true);
  });

  window.onbeforeunload = function () {
    localStorage.setItem("siteStorage", JSON.stringify(siteList));
  };
}

function getSite(name, url) {
  var siteLetter = simplifyUrl(url)[0].toUpperCase();
  return {
    siteName: name,
    siteLink: url,
    siteLetter: siteLetter
  };
}

function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); // 删除 / 开头的内容
}
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.49096740.js.map