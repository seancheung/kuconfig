# Kuconfig

[![Master Build][travis-master]][travis-url]

Smart configuration control

[travis-master]: https://img.shields.io/travis/seancheung/kuconfig/master.svg?label=master
[travis-url]: https://travis-ci.org/seancheung/kuconfig

[中文](https://github.com/seancheung/kuconfig/blob/master/README.zh.md)

## Install

```bash
npm i kuconfig
```

## Basic Usage

This package by default reads the _config_ folder in your working directory and merge all json files in it into one object, with each file name(without extension) being key and corresponding content being value:

-   config
    -   app.json
    -   database.json
    -   language.json

Loaded as

```json
{
    "app": {
        /** content of app.json **/
    },
    "database": {
        /** content of database.json **/
    },
    "language": {
        /** content of language.json **/
    }
}
```

```javascript
const config = require('kuconfig');
console.log(config.app.name);
console.log(config.database.mysql.host);
console.log(config.language.supported[0]);
```

If folder _config_ does not exist, file _config.json_ will be checked instead.

-   config.json

```json
{
    "app": {
        "name": "MY APP"
    }
}
```

```javascript
const config = require('kuconfig');
console.log(config.app.name);
```

You can override the config file path with an environment variable `CONFIG_FILE`(must be set before this module being loaded):

```javascript
// read a folder
process.env.CONFIG_FILE = 'src/config';
// read a file
process.env.CONFIG_FILE = 'src/config.json';
// with absolute path
process.env.CONFIG_FILE = '/path/to/src/config.json';
const config = require('kuconfig');
console.log(config.name);
```

It won't be loaded again once done. To reload configs, you need to call:

```javascript
// delete cached config
config.__.desolve();
// reload
config = require('kuconfig');
```

## Envs Mode

```javascript
require('kuconfig/override');
```

> For esmodule style use `import config from 'kuconfig/override.js'` instead

In this mode, the `config/default.json` is loaded, followed by `config/xxx.json`(where `xxx` is equal to `process.env.NODE_ENV`). Then a deep merge of those two objects happends.

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
process.env.NODE_ENV = 'development';
const config = require('kuconfig/override');
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

## Env File(optional)

By default, This package reads a _.env_ file in your working directory and gets extra environment variables from this file.

```bash
NODE_ENV=production
CONFIG_FILE=src/config.json
```

You may override this behaviour by passing the following environment variable:

```javascript
process.env.ENV_FILE = 'src/.env';
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

A bunch of **keywords** can be used in config files. The syntax is similar to mongodb query. Nested syntax is supported(they will be resolved inner to outer)

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

**\$env**

Get value from environment variables(first try env file, then process.env) with an optional fallback value

-   params: `string`|`[string, any]`
-   returns `any`

**\$var**

Get value from env file with an optional fallback value

-   params: `string`|`[string, any]`
-   returns `any`

**\$path**

Resolve the path to absolute from current working directory

-   params: `string`
-   returns `string`

**\$file**

Resolve the path and read the file with an optional encoding

-   params: `string`|`[string, string]`
-   returns `string`|`Buffer`

**\$json**

Parse the given string into object

-   params: `string`
-   returns `any`

**\$number**

Parse the given string into a number

-   params: `string`|`number`
-   returns `number`

**\$concat**

Concat strings or arrays

-   params: `string[]`|`[][]`
-   returns `string`|`any[]`

**\$max**

Return the max number in the array

-   params: `number[]`
-   returns `number`

**\$min**

Return the min number in the array

-   params: `number[]`
-   returns `number`

**\$sum**

Sum the numbers in the array

-   params: `number[]`
-   returns `number`

**\$avg**

Return the average value of the array

-   params: `number[]`
-   returns `number`

**\$first**

Return the first element in the array

-   params: `any[]`
-   returns `any`

**\$last**

Return the last element in the array

-   params: `any[]`
-   returns `any`

**\$at**

Return element in the array at the given index

-   params: `[any[], number]`
-   returns `any`

**\$asce**

Sort the numbers in ascending order

-   params: `number[]`
-   returns `number[]`

**\$asce**

Sort the numbers in descending order

-   params: `number[]`
-   returns `number[]`

**\$rand**

Return an element at random index

-   params: `any[]`
-   returns `any`

**\$rands**

Return the given amount of elements at random indices

-   params: `[any[], number]`
-   returns `any[]`

**\$reverse**

Reverse an array

-   params: `any[]`
-   returns `any[]`

**\$slice**

Slice an array from the given index to an optional end index

-   params: `[any[], number]`|`[any[], number, number]`
-   returns `any[]`

**\$count**

Return the length of an array

-   params: `any[]`
-   returns `number`

**\$join**

Join an array to string with an optional separator

-   params: `[any[]]`|`[any[], string]`
-   returns `string`

**\$merge**

Return the merge of two objects

-   params: `[any, any]`
-   returns `any`

**\$keys**

Return the keys of an object

-   params: `any`
-   returns `string[]`

**\$vals**

Return the values of an object

-   params: `any`
-   returns `any[]`

**\$zip**

Merge a series of key-value pairs into an object

-   params: `[any, any][]`
-   returns `any`

**\$zap**

Split an object into key-value pairs

-   params: `any`
-   returns `[any, any][]`

**$cond/$if**

Return the second or third element based on the boolean value of the first element

-   params: `[boolean, any, any]`
-   returns `any`

**\$and/&&**

Return true only if both two elements' boolean values are true

-   params: `[boolean, boolean]`
-   returns `boolean`

**\$or/||**

Return true if any of the two elements' boolean value is true

-   params: `[boolean, boolean]`
-   returns `boolean`

**\$not**

Return true only if the given value is false

-   params: `boolean`
-   returns `boolean`

**\$true**

Return true if the given value is true or 'true'(case insensitive) or 1 or '1'

-   params: `boolean|string`
-   returns `boolean`

**\$null**

Return true if the given value is null or undefined

-   params: `any`
-   returns `boolean`

**\$undefined**

Return true only if the given value is undefined

-   params: `any`
-   returns `boolean`

**\$type**

Return true only if the given value is of the given type

-   params: `[any, string]`
-   returns `boolean`

**\$test|!!**

Return boolean test result(!!) of the given value

-   params: `[any, string]`
-   returns `boolean`

**\$upper**

Transform input string to upper case

-   params: `string`
-   returns `string`

**\$lower**

Transform input string to lower case

-   params: `string`
-   returns `string`

**\$split**

Split input string into an array with optional delimiter and/or limit

-   params: `string|[string, string]|[string, string, number]`
-   returns `string[]`

**\$expand**

Expand variables as in shellscript

-   params: `string`
-   returns `string`

**\$regex**

Transform string to regex with optional flags

-   params: `string|[string, string]`
-   returns `RegExp`

### Other Keywords

**Operators**

$abs, $add(+), $sub(-), $mul(\*), $div(/), $mod(%), $ceil, $floor, $round, $trunc, \$sign

**Comparers**

$gt(>), $gte(>=), $lt(<), $lte(<=), $eq(===), $eql(==), $ne(!==), $neql(!=), $in, $ni

### Skip Parsing

To skip parsing a file or a part of a file, use **\$skip** option:

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

A utils object is attached to each config instance. You can acces it by the getter `__`:

```javascript
// make a deep cloned copy
const copy = config.__.clone(obj);

// merge target object's copy into source object's copy deeply
const merged = config.__.merge(source, target);

// load environment variables, optionally inject them into process.env
const envs = config.__.env('./.env', true);

// parse config by json string
let conf = config.__.resolve(
    JSON.parse(fs.readFileSync('./config.json', 'utf8')),
    envs
);

// load config by path(absolute or relative to working directory)
conf = config.__.load('./config.json');

// delete config referenced cache(the next time you reference this module, config file will be reloaded)
config.__.desolve();

// parse config with custom expressions
config.__.parse(
    {
        $encode(params) {
            if (params == null) {
                return params;
            }
            if (typeof params === 'string') {
                return encodeURI(params);
            }
            throw new Error('$encode expects a string');
        }
    },
    {
        url: {
            $encode: 'this is a test'
        }
    },
    envs
);

// Expand variables as in shellscript
config.__.substitute('Today is ${date} and I am ${name}.', {
    date: new Date(),
    name: 'Adam'
});
// To support dynamic code execution(using v8 vm module)
config.__.substitute(
    'I am ${age} years old and I will be ${age + 1} next year. You can call me ${profile.name}.',
    {
        age: 17,
        profile: {
            name: 'Tom'
        }
    },
    true
);
```

You can also use utils without the config instance:

```javascript
const utils = require('kuconfig/utils');
// NOTE: utils.desolve will be undefined
```

## Plugins

If this module is used in a front-end project, the loading will happen in bundling step. A parsed config object will be injected to the output bundle. Accessing the config object at runtime is nothing difference to accessing a plain object.

### Webpack

To integrate into webpack, there is a built-in plugin:

```javascript
const KuconfigPlugin = require('kuconfig/plugins/webpack');
```

_webpack.config.js_

```javascript
plugins: [new KuconfigPlugin()];
```

Usage in your modules:

```javascript
import * as config from 'kuconfig';
```

Use envs mode

```javascript
plugins: [new KuconfigPlugin({ mode: 'envs' })];
```

### Vite

> Same as Webpack integration, the loaded object will be a plain object at run time.

```javascript
import kuconfig from 'kuconfig/plugins/vite';
```

_vite.config.js_

```javascript
{
    optimizeDeps: {
        exclude: ['kuconfig']
    },
    plugins: [kuconfig()]
}
```

Usage in your modules:

```javascript
import config from 'kuconfig';
```

Use envs mode

```javascript
{
    optimizeDeps: {
        exclude: ['kuconfig']
    },
    plugins: [kuconfig({ mode: 'envs' })]
}
```

### Metro(React Native)

> Same as Webpack integration, the loaded object will be a plain object at run time.

A metro babel transformer is provided:

_metro.config.js_

```javascript
module.exports = {
    transformer: {
        babelTransformerPath: require.resolve('kuconfig/plugins/metro')
    }
};
```

**With other transformers**

_transformers.js_

```javascript
const svgTransformer = require('react-native-svg-transformer');
const configTransformer = require('kuconfig/plugins/metro');

module.exports.getCacheKey = configTransformer.getCacheKey;
module.exports.transform = function ({ src, filename, options }) {
    if (filename.endsWith('.svg')) {
        return svgTransformer.transform({ src, filename, options });
    } else {
        return configTransformer.transform({ src, filename, options });
    }
};
```

_metro.config.js_

```javascript
const { assetExts, sourceExts } = require('metro-config/src/defaults/defaults');

module.exports = {
    transformer: {
        getTransformOptions: () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false
            }
        }),
        babelTransformerPath: require.resolve('./transformer.js')
    },
    resolver: {
        assetExts: assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg']
    }
};
```

Usage:

```javascript
import * as config from 'kuconfig';
import * as config from 'kuconfig/override';
```

> config file cannot be hot-reloaded, you must re-run `npm start` to make the changes to take effect

## Using Typescript

By default the imported config object implements `Record<string, any>`.
You can add a typing file to your project to overwite `kuconfig` module:

_kuconfig.d.ts_

```typescript
declare module 'kuconfig' {
    /**
     * This interface will be merged with default Config interface
     */
    interface Config {
        /**
         * Here is the definition of your config
         */
        readonly name: string;
        /**
         * nested config
         */
        readonly db: Readonly<Config.DB>;
    }
    namespace Config {
        interface DB {
            readonly host: string;
            readonly port: number;
        }
    }
}
// don't miss this line
export {};
```

The corresponding config file structure:

```json
{
    "name": "myapp",
    "db": {
        "host": "localhost",
        "port": 3306
    }
}
```

## Test

```bash
npm test
```

## License

See [License](https://github.com/seancheung/kuconfig/blob/master/LICENSE)
