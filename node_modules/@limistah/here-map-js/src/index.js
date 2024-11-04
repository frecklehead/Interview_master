import getJS from "get-js";
import defaults from "./defaults";
import merge from "merge";
``;

const buildScriptURLs = (version = defaults.VERSION) => [
  `https://js.api.here.com/${version}/mapsjs-service.js`, // Service
  `https://js.api.here.com/${version}/mapsjs-ui.js`, // UI
  `https://js.api.here.com/${version}/mapsjs-mapevents.js`, // Events
  ...(version.includes("v3/3.1")
    ? []
    : [`https://js.api.here.com/${version}/mapsjs-places.js`]) // places
];

const merger = options => merge(defaults, options);

const scriptLoader = options => {
  const _options = merger(options || {});
  const { VERSION, version, interactive, includeUI, includePlaces } = _options;

  const _v = version || VERSION;
  const urls = buildScriptURLs(_v);

  // First let us remove the events if it is not needed. PERFORMANCE!!!
  !interactive ? urls.splice(2, 1) : null;
  // Removes the UI if not needed
  !includeUI ? urls.splice(1, 1) : null;
  // Remove places if not needed
  !includePlaces ? urls.splice(3, 1) : null;
  const coreURL = `https://js.api.here.com/${_v}/mapsjs-core.js`;

  return getJS(coreURL)
    .then(function() {
      if (includeUI) {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute(
          "href",
          `https://js.api.here.com/${_v}/mapsjs-ui.css`
        );
        document.getElementsByTagName("head")[0].append(link);
      }
      return getJS(urls);
    })
    .catch(error => {
      console.log(error);
    });
};

export default scriptLoader;
