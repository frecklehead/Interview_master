import React from 'react';
import ReactDOMServer from 'react-dom/server';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var lodash_debounce = debounce;

const MapContext = React.createContext({});

const events = {
    onPointerDown: 'pointerdown',
    onPointerUp: 'pointerup',
    onPointerMove: 'pointermove',
    onPointerEnter: 'pointerenter',
    onPointerLeave: 'pointerleave',
    onPointerCancel: 'pointercancel',
    onDragStart: 'dragstart',
    onDrag: 'drag',
    onDragEnd: 'dragend',
    onTap: 'tap',
    onDoubleTap: 'dbltap',
    onLongPress: 'onlongpress',
};

function usePlatform(platformOptions, scriptsLoaded = true) {
    const [platform, setPlatform] = React.useState(undefined);
    React.useEffect(() => {
        if (!platform && scriptsLoaded) {
            setPlatform(new H.service.Platform(platformOptions));
        }
    }, [platform, platformOptions, scriptsLoaded]);
    return platform;
}

const cachedScripts = new Map();
/**
 *
 * @param src - script URL
 * @param name - name for cache pourposes
 */
function useScript(src, name) {
    // Keeping track of script loaded and error state
    const [state, setState] = React.useState({
        loaded: false,
        error: false,
    });
    React.useEffect(() => {
        // If cachedScripts array already includes src that means another instance ...
        // ... of this hook already loaded this script, so no need to load again.
        if (cachedScripts.get(name)) {
            setState({
                loaded: true,
                error: false,
            });
        }
        else {
            cachedScripts.set(name, src);
            // Create script
            let script = document.createElement('script');
            script.src = src;
            script.async = false;
            // Script event listener callbacks for load and error
            const onScriptLoad = () => {
                setState({
                    loaded: true,
                    error: false,
                });
            };
            const onScriptError = () => {
                // Remove from cachedScripts we can try loading again
                const exist = cachedScripts.get(name);
                if (exist) {
                    cachedScripts.delete(name);
                }
                script.remove();
                setState({
                    loaded: true,
                    error: true,
                });
            };
            script.addEventListener('load', onScriptLoad);
            script.addEventListener('error', onScriptError);
            // Add script to document body
            document.body.appendChild(script);
            // Remove event listeners on cleanup
            return () => {
                script.removeEventListener('load', onScriptLoad);
                script.removeEventListener('error', onScriptError);
            };
        }
    }, [name, src]); // Only re-run effect if script src and name changes
    return [state.loaded, state.error];
}

const loadedLinks = new Map();
function useLink(url, name) {
    const [state, setState] = React.useState({
        loaded: false,
        error: false,
    });
    React.useEffect(() => {
        if (loadedLinks.get(name)) {
            setState({
                loaded: true,
                error: false,
            });
        }
        else {
            loadedLinks.set(name, url);
            const link = document.createElement('link');
            const body = document.getElementsByTagName('body')[0];
            link.href = url;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            const onLinkLoad = () => {
                setState({
                    loaded: true,
                    error: false,
                });
            };
            const onLinkError = () => {
                const exist = loadedLinks.get(name);
                if (exist) {
                    loadedLinks.delete(name);
                }
                link.remove();
                setState({
                    loaded: true,
                    error: true,
                });
            };
            link.addEventListener('load', onLinkLoad);
            link.addEventListener('error', onLinkError);
            body.appendChild(link);
            return () => {
                link.removeEventListener('load', onLinkLoad);
                link.removeEventListener('error', onLinkError);
            };
        }
    }, [name, url]);
    return [state.loaded, state.error];
}

/* eslint @typescript-eslint/camelcase: 0 */
const HEREMap = ({ animateCenter, animateZoom, apikey, mapContainerId = 'map-container', center, hidpi, interactive, secure, zoom, rasterType, vectorType, children, ...rest }) => {
    const [map, setMap] = React.useState(undefined);
    const [behavior, setBehavior] = React.useState(undefined);
    const [ui, setUi] = React.useState(undefined);
    const debouncedResizeMap = lodash_debounce(resizeMap, 200);
    const [,] = useLink('https://js.api.here.com/v3/3.1/mapsjs-ui.css', 'map-styles');
    const [coreLoaded] = useScript('https://js.api.here.com/v3/3.1/mapsjs-core.js', 'core');
    const [serviceLoaded] = useScript('https://js.api.here.com/v3/3.1/mapsjs-service.js', 'service');
    const [uiLoaded] = useScript('https://js.api.here.com/v3/3.1/mapsjs-ui.js', 'ui');
    const [mapeventsLoaded] = useScript('https://js.api.here.com/v3/3.1/mapsjs-mapevents.js', 'mapevents');
    const platform = usePlatform({
        apikey,
        useHTTPS: secure === true,
    }, coreLoaded && serviceLoaded && uiLoaded && mapeventsLoaded);
    React.useEffect(() => {
        if (platform) {
            const defaultLayers = platform.createDefaultLayers({
                ppi: hidpi ? 320 : 72,
            });
            const mapElement = document.querySelector(`#${mapContainerId}`);
            let customLayer;
            if (rasterType) {
                customLayer = defaultLayers.raster[rasterType].map;
            }
            else if (vectorType) {
                customLayer = defaultLayers.vector.normal[vectorType];
            }
            else {
                customLayer = defaultLayers.raster.normal.map;
            }
            if (mapElement && !map) {
                const newMap = new H.Map(mapElement, customLayer, {
                    center,
                    zoom,
                    pixelRatio: hidpi ? 2 : 1,
                });
                setMap(newMap);
                if (interactive) {
                    const newBehavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));
                    const newUi = H.ui.UI.createDefault(newMap, defaultLayers);
                    setBehavior(newBehavior);
                    setUi(newUi);
                }
            }
            if (typeof window !== 'undefined') {
                window.addEventListener('resize', debouncedResizeMap);
            }
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', debouncedResizeMap);
            }
        };
    }, [
        center,
        debouncedResizeMap,
        hidpi,
        interactive,
        map,
        mapContainerId,
        platform,
        rasterType,
        vectorType,
        zoom,
    ]);
    React.useEffect(() => {
        if (map) {
            Object.entries(events).forEach(([event, hereEvent]) => {
                const e = rest[event];
                if (typeof e === 'function') {
                    map.addEventListener(hereEvent, e);
                }
            });
        }
        return () => {
            if (map) {
                Object.entries(events).forEach(([event, hereEvent]) => {
                    const e = rest[event];
                    if (typeof e === 'function') {
                        map.removeEventListener(hereEvent, e);
                    }
                });
            }
        };
    }, [map, rest]);
    React.useEffect(() => {
        if (map && center) {
            map.setCenter(center, animateCenter === true);
        }
    }, [animateCenter, center, map]);
    React.useEffect(() => {
        if (map && zoom) {
            map.setZoom(zoom, animateZoom === true);
        }
    }, [animateZoom, map, zoom]);
    function resizeMap() {
        if (map) {
            map.getViewPort().resize();
        }
    }
    return (React.createElement(MapContext.Provider, { value: { map, behavior, ui } },
        React.createElement("div", { id: mapContainerId, "data-testid": "map-container", style: { height: '100%' } }, map ? children : null)));
};

const Circle = ({ lat, lng, strokeColor, lineWidth, fillColor, radius, }) => {
    const mapContext = React.useContext(MapContext);
    const [circle, setCircle] = React.useState();
    React.useEffect(() => {
        const { map } = mapContext;
        if (map && !circle) {
            const newCircle = new H.map.Circle({
                lat,
                lng,
            }, radius, {
                style: {
                    fillColor,
                    lineWidth,
                    strokeColor,
                },
            });
            map.addObject(newCircle);
            setCircle(newCircle);
        }
        return () => {
            if (map && circle) {
                map.removeObject(circle);
            }
        };
    }, [circle, fillColor, lat, lineWidth, lng, mapContext, radius, strokeColor]);
    React.useEffect(() => {
        if (circle && lat && lng) {
            circle.setCenter({
                lat,
                lng,
            });
        }
    }, [circle, lat, lng]);
    React.useEffect(() => {
        if (circle && radius) {
            circle.setRadius(radius);
        }
    }, [circle, radius]);
    return null;
};

/**
 * Map for HTML strings against H.map.DomIcon instances
 */
const DomIcons = new Map();
/**
 * Returns the DOM Icon for the input HTML string, ensuring that no more
 * than one DOM Icon is created for each HTML string
 * @param html {string} - A string containing the markup to be used as a Dom Icon.
 */
function getDomMarkerIcon(html) {
    if (!DomIcons.has(html)) {
        const icon = new H.map.DomIcon(html);
        DomIcons.set(html, icon);
    }
    return DomIcons.get(html);
}

/**
 * Map for image URL strings against H.map.Icon instances
 */
const Icons = new Map();
/**
 * Returns the Icon for the input bitmap URL string, ensuring that no more
 * than one Icon is created for each bitmap
 * @param bitmap {string} - The location of the bitmap to be used as an icon
 */
function getMarkerIcon(bitmap) {
    if (!Icons.has(bitmap)) {
        const icon = new H.map.Icon(bitmap);
        Icons.set(bitmap, icon);
    }
    return Icons.get(bitmap);
}

/**
 * A helper function that disables map behavior on drag event in order to allow
 * the marker to be moved.
 * @param map
 * @param behavior
 */
function setMarkerDragEvent(map, behavior) {
    map.addEventListener('dragstart', (e) => {
        if (e.target instanceof H.map.Marker ||
            e.target instanceof H.map.DomMarker) {
            behavior.disable();
        }
    }, false);
    map.addEventListener('dragend', (e) => {
        if (e.target instanceof H.map.Marker ||
            e.target instanceof H.map.DomMarker) {
            behavior.enable();
        }
    }, false);
    map.addEventListener('drag', (e) => {
        const target = e.target;
        const pointer = e.currentPointer;
        if (target instanceof H.map.Marker ||
            e.target instanceof H.map.DomMarker) {
            target.setPosition(map.screenToGeo(pointer.viewportX, pointer.viewportY));
        }
    }, false);
}

const Marker = ({ children, bitmap, lat, lng, draggable, ...rest }) => {
    const mapContext = React.useContext(MapContext);
    const [marker, setMarker] = React.useState(undefined);
    React.useEffect(() => {
        const { map, behavior } = mapContext;
        if (map && !marker) {
            let newMarker;
            if (React.Children.count(children) > 0) {
                const html = ReactDOMServer.renderToStaticMarkup(React.createElement("div", { className: "dom-marker" }, children));
                const icon = getDomMarkerIcon(html);
                newMarker = new H.map.DomMarker({ lat, lng }, { icon });
            }
            else if (bitmap) {
                const icon = getMarkerIcon(bitmap);
                newMarker = new H.map.Marker({ lat, lng }, { icon });
            }
            else {
                newMarker = new H.map.Marker({ lat, lng });
            }
            if (draggable && behavior) {
                newMarker.draggable = draggable;
                setMarkerDragEvent(map, behavior);
            }
            map.addObject(newMarker);
            setMarker(newMarker);
        }
        return () => {
            if (map && marker) {
                map.removeObject(marker);
            }
        };
    }, [bitmap, children, draggable, lat, lng, mapContext, marker]);
    React.useEffect(() => {
        if (marker) {
            Object.entries(events).forEach(([event, hereEvent]) => {
                const e = rest[event];
                if (typeof e === 'function') {
                    marker.addEventListener(hereEvent, e);
                }
            });
        }
        return () => {
            if (marker) {
                Object.entries(events).forEach(([event, hereEvent]) => {
                    const e = rest[event];
                    if (typeof e === 'function') {
                        marker.removeEventListener(hereEvent, e);
                    }
                });
            }
        };
    }, [marker, rest]);
    React.useEffect(() => {
        if (marker && lat && lng) {
            marker.setGeometry({
                lat,
                lng,
            });
        }
    }, [lat, lng, marker]);
    return null;
};

const RouteLine = ({ shape, strokeColor, lineWidth, }) => {
    const mapContext = React.useContext(MapContext);
    const [routeLine, setRouteLine] = React.useState(undefined);
    React.useEffect(() => {
        const { map } = mapContext;
        if (map) {
            const linestring = new H.geo.LineString();
            shape.forEach(point => {
                const [lat, lng] = point.split(',');
                linestring.pushLatLngAlt(Number(lat), Number(lng), 1);
            });
            const newRouteLine = new H.map.Polyline(linestring, {
                style: { strokeColor, lineWidth },
            });
            if (routeLine) {
                map.removeObject(routeLine);
            }
            map.addObject(newRouteLine);
            setRouteLine(routeLine);
        }
        return () => {
            if (map && routeLine) {
                map.removeObject(routeLine);
            }
        };
    }, [lineWidth, mapContext, routeLine, shape, strokeColor]);
    return null;
};

export default HEREMap;
export { Circle, HEREMap, Marker, RouteLine, usePlatform };
//# sourceMappingURL=index.es.js.map
