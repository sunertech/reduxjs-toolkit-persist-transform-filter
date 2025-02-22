# reduxjs-toolkit-persist-transform-filter

[![npm](https://img.shields.io/npm/v/reduxjs-toolkit-persist-transform-filter.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/reduxjs-toolkit-persist-transform-filter)
[![Build Status](https://travis-ci.org/sunertech/reduxjs-toolkit-persist-transform-filter.svg?branch=master)](https://travis-ci.org/sunertech/reduxjs-toolkit-persist-transform-filter)

Filter transformator for reduxjs-toolkit-persist

## Installation
```
  npm install reduxjs-toolkit-persist-transform-filter
```

## Usage

```js
import { createFilter, createBlacklistFilter } from 'reduxjs-toolkit-persist-transform-filter';

// this works too:
import createFilter, { createBlacklistFilter } from 'reduxjs-toolkit-persist-transform-filter';

// you want to store only a subset of your state of reducer one
const saveSubsetFilter = createFilter(
  'myReducerOne',
  ['keyYouWantToSave1', 'keyYouWantToSave2']
);

// you want to remove some keys before you save
const saveSubsetBlacklistFilter = createBlacklistFilter(
  'myReducerTwo',
  ['keyYouDontWantToSave1', 'keyYouDontWantToSave2']
);

// you want to load only a subset of your state of reducer three
const loadSubsetFilter = createFilter(
  'myReducerThree',
  null,
  ['keyYouWantToLoad1', 'keyYouWantToLoad2']
);

// saving a subset and loading a different subset is possible
// but doesn't make much sense because you'd load an empty state
const saveAndloadSubsetFilter = createFilter(
  'myReducerFour',
  ['one', 'two']
  ['three', 'four']
);

const predicateFilter = persistFilter(
	'form',
	[
		{ path: 'one', filterFunction: (item: any): boolean => item.mustBeStored },
		{ path: 'two', filterFunction: (item: any): boolean => item.mustBeStored },
	],
	'whitelist'
)

const normalPathFilter = persistFilter(
	'form',
	['one', 'two'],
	'whitelist'
)

const persistConfig = ;

const persistedReducer = persistReducer(
  {
    key: "suffix",
    ... // another config options
    transforms: [
      saveSubsetFilter,
      saveSubsetBlacklistFilter,
      loadSubsetFilter,
      saveAndloadSubsetFilter,
    ],
  },
  rootReducer, // your reducer object root
);
```

## Test

```sh
git clone https://github.com/sunertech/reduxjs-toolkit-persist-transform-filter.git
cd reduxjs-toolkit-persist-transform-filter
npm install
npm test
```

## Build (generate .js and .d.ts)

```sh
npm build
```

## Release (test, build and publish)

```sh
npm release
```
