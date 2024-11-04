# Here Map JS

JavaScript scripts loader for [Here Map](https://www.here.com/).

## Installation

```js
npm i @limistah/here-map-js
```

## Usage

```js
import hereMapJS from "@limistah/here-map-js";

// Promise-like
hereMapJS({ interactive: true }).then((result) => {
  console.log(result); // true if it went through
});

// Async/Await
const loaded = await scriptLoader();
console.log(loaded); // true if it went through
```

## Docs

### `hereMapJS(options)` : boolean

#### options properties

##### `options.interactive`

To load the map events scripts. Default `false`

##### `options.includeUI`

To load the UI scripts. Default `false`

##### `options.version || options.VERSION`

Version to be loaded. Default v3/3.0

##### `options.includePlaces || options.includePlaces`

To load `mapsjs-places.js` module. Default `false`
