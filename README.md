# Kuconfig

[![Master Build][travis-master]][travis-url]

Smart configuration control

[travis-master]: https://img.shields.io/travis/seancheung/kuconfig/master.svg?label=master
[travis-url]: https://travis-ci.org/seancheung/kuconfig

## Install

```bash
npm i kuconfig
```

## Basic Usage

This package by default read the _config_ folder in your working directory:

* config
  * app.json
  * database.json
  * language.json

```javascript
const config = require("kuconfig");
console.log(config.app.name);
console.log(config.database.mysql.host);
console.log(config.language.supported[0]);
```

If folder _config_ does not exist, file _config.json_ will be checked instead.

* config.json

```json
{
  "app": {
    "name": "MY APP"
  }
}
```

```javascript
const config = require("kuconfig");
console.log(config.app.name);
```

You can override the config file path with an environment variable:

```javascript
// read a folder
process.env.CONFIG_FILE='src/config'
// read a file
process.env.CONFIG_FILE='src/config.json'
// with absolute path
process.env.CONFIG_FILE='/path/to/src/config.json'
```

If you specified a single file, the config object will be the file itself rather than a nested object with the filename as its key(like folder reading does).

_src/config.json_

```json
{
  "app": {
    "name": "myapp"
  }
}
```

```javascript
process.env.CONFIG_FILE = src / config.json;
const config = require("kuconfig");
console.log(config.app.name);
```

It won't be loaded again once done. To reload configs, you need to call:

```javascript
// delete cached config
config.__.desolve();
// reload
config = require("kuconfig");
```

## Env Override Mode

_src/default.json_

```json
{
  "app": {
    "name": "myapp",
    "host": "localhost"
  }
}
```

_src/development.json_

```json
{
  "app": {
    "port": 8080,
    "host": "myhost"
  }
}
```

```javascript
process.env.NODE_ENV='development'
const config = require("kuconfig/env");
```

This merges config files to

```json
{
  "app": {
    "name": "myapp",
    "port": 8080,
    "host": "myhost"
  }
}
```

## Env File

By default, This package read a *.env* file in your working directory and get environment variables from this file.

```bash
NODE_ENV=production
CONFIG_FILE=src/config.json
```

You may override this behaviour by passing the following environment variable:

```javascript
process.env.ENV_FILE='src/.env'
const config = require('kuconfig');
```

You may optionally set `ENV_INJECT` to inject env file variables into `process.env`.


**Existing environment variables won't be overrided.**

```bash
process.env.ENV_INJECT='true'
NODE_ENV=development npm start
```

```plain
# NODE_ENV won't be set because it already exists
NODE_ENV=production
CONFIG_FILE=src/config.json
```

## Smart Config File

A bunch of **keywords** can be used in config files

```json
{
  "name": {
    "$env": "APP_NAME"
  },
  "database": {
    "port": {
      "$env": ["DB_PORT", 3306]
    },
    "host": {
      "$env": ["DB_HOST", "localhost"]
    },
    "username": {
      "$env": "DB_USER"
    },
    "password": {
      "$env": ["DB_PASS", { "$env": "DB_USER" }]
    }
  }
}
```

The `$env` object reads environment varaibles with an optional fallback value. With the following env set:

```plain
APP_NAME=myapp
DB_HOST=10.10.10.100
DB_USER=admin
```

The loaded config will be

```json
{
  "name": "myapp",
  "database": {
    "port": 3306,
    "host": "10.10.10.100",
    "username": "admin",
    "password": "admin"
  }
}
```

Here is a list of available **keywords**:

**$env**

Get value from environment variables(first try env file, then process.env) with an optional fallback value

* params: `string`|`[string, any]`
* returns `any`

**$var**

Get value from env file with an optional fallback value

* params: `string`|`[string, any]`
* returns `any`

**$path**

Resolve the path to absolute from current working directory

* params: `string`
* returns `string`

**$file**

Resolve the path and read the file with an optional encoding

* params: `string`|`[string, string]`
* returns `string`|`Buffer`

**$json**

Parse the given string into object

* params: `string`
* returns `any`

**$number**

Parse the given string into a number

* params: `string`|`number`
* returns `number`

**$concat**

Concat strings or arrays

* params: `string[]`|`[][]`
* returns `string`|`any[]`

**$max**

Return the max number in the array

* params: `number[]`
* returns `number`

**$min**

Return the min number in the array

* params: `number[]`
* returns `number`

**$sum**

Sum the numbers in the array

* params: `number[]`
* returns `number`

**$avg**

Return the average value of the array

* params: `number[]`
* returns `number`

**$first**

Return the first element in the array

* params: `any[]`
* returns `any`

**$last**

Return the last element in the array

* params: `any[]`
* returns `any`

**$at**

Return element in the array at the given index

* params: `[any[], number]`
* returns `any`

**$asce**

Sort the numbers in ascending order

* params: `number[]`
* returns `number[]`

**$asce**

Sort the numbers in descending order

* params: `number[]`
* returns `number[]`

**$rand**

Return an element at random index

* params: `any[]`
* returns `any`

**$rands**

Return the given amount of elements at random indices

* params: `[any[], number]`
* returns `any[]`

**$reverse**

Reverse an array

* params: `any[]`
* returns `any[]`

**$slice**

Slice an array from the given index to an optional end index

* params: `[any[], number]`|`[any[], number, number]`
* returns `any[]`

**$count**

Return the length of an array

* params: `any[]`
* returns `number`

**$join**

Join an array to string with an optional separator

* params: `[any[]]`|`[any[], string]`
* returns `string`

**$merge**

Return the merge of two objects

* params: `[any, any]`
* returns `any`

**$keys**

Return the keys of an object

* params: `any`
* returns `string[]`

**$vals**

Return the values of an object

* params: `any`
* returns `any[]`

**$zip**

Merge a series of key-value pairs into an object

* params: `[any, any][]`
* returns `any`

**$zap**

Split an object into key-value pairs

* params: `any`
* returns `[any, any][]`

**$cond/$if**

Return the second or third element based on the boolean value of the first element

* params: `[boolean, any, any]`
* returns `any`

**$and/&&**

Return true only if both two elements' boolean values are true

* params: `[boolean, boolean]`
* returns `boolean`

**$or/||**

Return true if any of the two elements' boolean value is true

* params: `[boolean, boolean]`
* returns `boolean`

**$not**

Return true only if the given value is false

* params: `boolean`
* returns `boolean`

**$true**

Return true if the given value is true or 'true'(case insensitive) or 1 or '1'

* params: `boolean|string`
* returns `boolean`

**$null**

Return true if the given value is null or undefined

* params: `any`
* returns `boolean`

**$undefined**

Return true only if the given value is undefined

* params: `any`
* returns `boolean`

**$type**

Return true only if the given value is of the given type

* params: `[any, string]`
* returns `boolean`

**$test|!!**

Return boolean test result(!!) of the given value

* params: `[any, string]`
* returns `boolean`

**$upper**

Transform input string to upper case

* params: `string`
* returns `string`

### Other Keywords

**$lower**

Transform input string to lower case

* params: `string`
* returns `string`

**$split**

Split input string into an array with optional delimiter and/or limit

* params: `string|[string, string]|[string, string, number]`
* returns `string[]`

**$expand**

Expand variables as in shellscript

* params: `string`
* returns `string`

### Other Keywords

**Operators**

$abs, $add(+), $sub(-), $mul(\*), $div(/), $mod(%), $ceil, $floor, $round, $trunc, $sign

**Comparers**

$gt(>), $gte(>=), $lt(<), $lte(<=), $eq(===), $eql(==), $ne(!==), $neql(!=), $in, $ni

### Skip Parsing

To skip parsing a file or a part of a file, use **$skip** options:

```json
{
  "$skip": true,
  "key": {
    "$env": "APP_KEY"
  }
}
```

The loaded file will be

```json
{
  "key": {
    "$env": "APP_KEY"
  }
}
```

## Utils

A utils is attached to each config instance. You can acces it by the getter `__`:

```javascript
// make a deep cloned copy
const copy = config.__.clone(obj);

// merge target object's copy into source object's copy deeply
const merged = config.__.merge(source, target);

// load environment variables, optionally inject them into process.env
const envs = config.__.env("./.env", true);

// parse config by json string
let conf = config.__.resolve(
  JSON.parse(fs.readFileSync("./config.json", "utf8"))
);

// load config by path(absolute or relative to working directory)
conf = config.__.load("./config.json");

// delete config referenced cache(the next time you reference this module, config file will be reloaded)
config.__.desolve();
```

You can also use utils without the config instance:

```javascript
const utils = require("kuconfig/utils");
// NOTE: utils.desolve will be undefined
```

## Webpack

To integrate into webpack, there is a built-in plugin:

```javascript
const KuconfigPlugin = require("kuconfig/utils/webpack");
```

_webpack.config.js_

```javascript
plugins: [
  new KuconfigPlugin({
    filename: path.resolve(__dirname, "path/to/config.json")
  })
];
```

And import that config in your modules:

_index.js_

```javascript
import * as config from "./path/to/config.json";
```

You may add a resolve alias to shorten the import:

_webpack.config.js_

```javascript
resolve: {
    alias: {
        config: path.resolve(__dirname, 'path/to/config.json')
    }
},
```

_index.js_

```javascript
import * as config from "config";
```

**NOTE**

By default the json config is loaded as string. It's also compatible with file-loader. If conflicts occur, you may need to bypass the specific loader(s) with `include/exclude` filters. e.g.

```javascript
{
    test: /\.json$/,
    exclude: /\/config\.json$/,
    use: 'some-loader'
}
```

## Test

```bash
npm test
```

## License

See [License](https://github.com/seancheung/kuconfig/blob/master/LICENSE)
