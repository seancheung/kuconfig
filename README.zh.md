# Kuconfig

[![Master Build][travis-master]][travis-url]

智能表达式配置

[travis-master]: https://img.shields.io/travis/seancheung/kuconfig/master.svg?label=master
[travis-url]: https://travis-ci.org/seancheung/kuconfig

[English](https://github.com/seancheung/kuconfig/blob/master/README.md)

## 安装

```bash
npm i kuconfig
```

## 基本用法

默认情况下此库会读取当前工作目录下的 _config_ 文件夹, 并将该目录下每个 json 文件的文件名(不含后缀)作为 key, 内容作为值, 合并为一个 object:

-   config
    -   app.json
    -   database.json
    -   language.json

加载后如下

```json
{
    "app": {
        /** app.json 内容 **/
    },
    "database": {
        /** database.json 内容 **/
    },
    "language": {
        /** language.json 内容 **/
    }
}
```

```javascript
const config = require('kuconfig');
console.log(config.app.name);
console.log(config.database.mysql.host);
console.log(config.language.supported[0]);
```

如果 _config_ 文件夹不存在, 则会使用 _config.json_ 文件

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

可以使用环境变量`CONFIG_FILE`来指定默认读取文件或文件夹的路径(需在本库加载前)

```javascript
// 指定文件夹
process.env.CONFIG_FILE = 'src/config';
// 指定文件
process.env.CONFIG_FILE = 'src/config.json';
// 指定绝对路径
process.env.CONFIG_FILE = '/path/to/src/config.json';

const config = require('kuconfig');
console.log(config.app.name);
```

加载操作只会执行一次. 如需要重新加载, 可以调用:

```javascript
// 删除缓存
config.__.desolve();
// 重新加载
config = require('kuconfig');
```

## 覆盖模式

```javascript
require('kuconfig/override')
```

在此调用模式下, `config/default.json`会先被读取, 然后是`config/xxx.json`(`xxx`等于`process.env.NODE_ENV`). 之后这两个文件的内容会发生深合并

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

加载结果如下

```json
{
    "app": {
        "name": "myapp",
        "port": 8080,
        "host": "myhost"
    }
}
```

## 环境变量文件(可选)

默认情况下此库会读取当前工作目录下的 _.env_ 文件来获取额外的环境变量

```bash
NODE_ENV=production
CONFIG_FILE=src/config.json
```

你同样可以指定该文件的路径

```javascript
process.env.ENV_FILE = 'src/.env';
const config = require('kuconfig');
```

你还可以额外设置环境变量`ENV_INJECT`来将该文件中定义的环境变量注入`process.env`中.

**process.env 中已经存在的环境变量不会被覆盖**

```bash
process.env.ENV_INJECT='true'
NODE_ENV=development npm start
```

```plain
# NODE_ENV 不会被再次设置
NODE_ENV=production
CONFIG_FILE=src/config.json
```

## 智能配置

配置文件中可以使用一些特殊的**关键字**. 其表达式形式与 mongodb 查询语句类似. 表达式可以嵌套使用(解析顺序从里到外)

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

上面的 `$env` 对象会读取环境变量中指定名称的值, 并可设置一个可选的默认值. 若当前环境变量如下:

```plain
APP_NAME=myapp
DB_HOST=10.10.10.100
DB_USER=admin
```

则加载后的配置

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

以下是所有**关键字**:

**\$env**

从环境变量中读取指定名称变量的值(优先读取 env 文件, 然后是`process.env`)并可额外设置一个默认值(环境变量未找到时会使用此默认值)

-   参数: `string`|`[string, any]`
-   返回 `any`

**\$var**

类似`$env`但只会从 env 文件中取值

-   参数: `string`|`[string, any]`
-   返回 `any`

**\$path**

将指定的路径转换为绝对路径

-   参数: `string`
-   返回 `string`

**\$file**

读取指定的文件内容. 额外支持设置文件编码

-   参数: `string`|`[string, string]`
-   返回 `string`|`Buffer`

**\$json**

将指定的字符串反序列化为 json 对象

-   参数: `string`
-   返回 `any`

**\$number**

将指定的字符串转为数值

-   参数: `string`|`number`
-   返回 `number`

**\$concat**

将指定的多个字符串或多个数组连接起来

-   参数: `string[]`|`[][]`
-   返回 `string`|`any[]`

**\$max**

返回数组中最大的值

-   参数: `number[]`
-   返回 `number`

**\$min**

返回数组中最小的值

-   参数: `number[]`
-   返回 `number`

**\$sum**

将指定的数值序列求和

-   参数: `number[]`
-   返回 `number`

**\$avg**

返回指定数值序列的平均值

-   参数: `number[]`
-   返回 `number`

**\$first**

返回指定数组中的第一个元素

-   参数: `any[]`
-   返回 `any`

**\$last**

返回指定数组中最后一个元素

-   参数: `any[]`
-   返回 `any`

**\$at**

返回指定数组中指定索引位置的元素

-   参数: `[any[], number]`
-   返回 `any`

**\$asce**

返回升序排序后的数值序列

-   参数: `number[]`
-   返回 `number[]`

**\$asce**

返回降序排序后的数值序列

-   参数: `number[]`
-   返回 `number[]`

**\$rand**

返回数值序列中随机索引位置的元素

-   参数: `any[]`
-   返回 `any`

**\$rands**

返回多个数值序列中随机索引位置的元素

-   参数: `[any[], number]`
-   返回 `any[]`

**\$reverse**

返回反转排序后的数组

-   参数: `any[]`
-   返回 `any[]`

**\$slice**

返回数组指定开始位置到指定结束位置(可选)的序列

-   参数: `[any[], number]`|`[any[], number, number]`
-   返回 `any[]`

**\$count**

返回数组的长度

-   参数: `any[]`
-   返回 `number`

**\$join**

将指定数组拼接为字符串(可选拼接符号, 默认为`,`)

-   参数: `[any[]]`|`[any[], string]`
-   返回 `string`

**\$merge**

将两个对象深合并

-   参数: `[any, any]`
-   返回 `any`

**\$keys**

返回对象的属性名称集合

-   参数: `any`
-   返回 `string[]`

**\$vals**

返回对象的属性值集合

-   参数: `any`
-   返回 `any[]`

**\$zip**

将多个键值对合并为对象

-   参数: `[any, any][]`
-   返回 `any`

**\$zap**

将对象转为键值对

-   参数: `any`
-   返回 `[any, any][]`

**$cond/$if**

根据第一个参数的真假值返回第二个或第三个元素

-   参数: `[boolean, any, any]`
-   返回 `any`

**\$and/&&**

如果两个元素的结果都为`true`则返回`true`否则返回`false`

-   参数: `[boolean, boolean]`
-   返回 `boolean`

**\$or/||**

如果任一元素的结果都为`true`则返回`true`否则返回`false`

-   参数: `[boolean, boolean]`
-   返回 `boolean`

**\$not**

如果参数的值为`false`则返回`true`否则返回`false`

-   参数: `boolean`
-   返回 `boolean`

**\$true**

如果参数的值为 boolean 的`true`或字符串的`'true'`(大小写不敏感)或数值的`1`或字符串的`'1'`则返回`true`, 否则返回`false`

-   参数: `boolean|string`
-   返回 `boolean`

**\$null**

如果参数的值为`null`或`undefined`则返回`true`否则返回`false`

-   参数: `any`
-   返回 `boolean`

**\$undefined**

如果参数的值为`undefined`则返回`true`否则返回`false`

-   参数: `any`
-   返回 `boolean`

**\$type**

如果参数的类型为指定类型则返回`true`否则返回`false`

-   参数: `[any, string]`
-   返回 `boolean`

**\$test|!!**

返回参数的`!!`结果

-   参数: `[any, string]`
-   返回 `boolean`

**\$upper**

将字符串转为大写

-   参数: `string`
-   返回 `string`

**\$lower**

将字符串转为小写

-   参数: `string`
-   返回 `string`

**\$split**

按指定的分隔符将字符串分割为数组, 并可额外设置分割上限

-   参数: `string|[string, string]|[string, string, number]`
-   返回 `string[]`

**\$expand**

将字符串中所有的`${xxx}`表达式解析为环境变量(类似于 shell 脚本的中的 expand 操作)

-   参数: `string`
-   返回 `string`

**\$regex**

将字符串转为正则表达式, 并可额外设置 flag

-   参数: `string|[string, string]`
-   返回 `RegExp`

### 其他关键字

**操作符**

$abs, $add(+), $sub(-), $mul(\*), $div(/), $mod(%), $ceil, $floor, $round, $trunc, \$sign

**比较符**

$gt(>), $gte(>=), $lt(<), $lte(<=), $eq(===), $eql(==), $ne(!==), $neql(!=), $in, $ni

### 跳过解析

要跳过一个文件或其中某一部分的解析, 可以使用 **\$skip** 选项:

```json
{
    "$skip": true,
    "key": {
        "$env": "APP_KEY"
    }
}
```

读取后

```json
{
    "key": {
        "$env": "APP_KEY"
    }
}
```

## 帮助类

每个`config`实例上都有挂载一个工具类, 可以通过`__`属性来访问:

```javascript
// 深克隆
const copy = config.__.clone(obj);

// 深合并
const merged = config.__.merge(source, target);

// 读取环境变量文件并将它们注入process.env中
const envs = config.__.env('./.env', true);

// 解析config文件
let conf = config.__.resolve(
    JSON.parse(fs.readFileSync('./config.json', 'utf8')),
    envs
);

// 加载配置文件(相对或绝对路径)
conf = config.__.load('./config.json');

// 删除模块缓存(下次引用此模块时会重新加载配置)
config.__.desolve();

// 使用自定义表达式解析配置文件
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

// 将表达式中的变量占位符替换
config.__.substitute('Today is ${date} and I am ${name}.', {
    date: new Date(),
    name: 'Adam'
});
// 支持行内表达式(使用v8模块)
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

可以直接引用工具类而无需加载配置

```javascript
const utils = require('kuconfig/utils');
// NOTE: 此时utils.desolve会不存在
```

## Webpack 支持

> 如果是在前端则不会有文件系统或环境变量等，因此配置文件会在打包时候被解析完成并注入最终的 bundle 中. 运行时访问 config 对象等同于访问一个普通 object

包含 webpack 支持插件:

```javascript
const KuconfigPlugin = require('kuconfig/plugins/webpack');
```

_webpack.config.js_

```javascript
plugins: [new KuconfigPlugin()];
```

引用配置:

_index.js_

```javascript
import * as config from 'kuconfig';
```

使用覆盖模式

```javascript
import * as config from 'kuconfig/override';
```

## Metro(React Native)

> 同 webpack 一样，加载后的配置会是一个普通 object

使用提供的 metro babel transformer:

_metro.config.js_

```javascript
module.exports = {
    transformer: {
        babelTransformerPath: require.resolve('kuconfig/plugins/metro')
    }
};
```

**与其他 transformer 一起使用**

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

引用配置:

```javascript
import * as config from 'kuconfig';
import * as config from 'kuconfig/override';
```

> 配置文件修改不支持热更新, 需要重新执行`npm start`来使修改生效

## 使用 Typescript

默认情况下 import 的 config 对象实现了`Record<string, any>`。
你可以在你的项目中添加一个 typing 文件来覆盖`kuconfig`的 module 声明：

_kuconfig.d.ts_

```typescript
declare module 'kuconfig' {
    /**
     * 这个接口会与默认Config接口合并
     */
    interface Config {
        /**
         * 这里是你的配置文件中的属性
         */
        readonly name: string;
        /**
         * 可以拆分嵌套属性配置
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
// 记得添加这一行
export {};
```

对应的配置文件结构如下

```json
{
    "name": "myapp",
    "db": {
        "host": "localhost",
        "port": 3306
    }
}
```

## 测试

```bash
npm test
```

## License

见 [License](https://github.com/seancheung/kuconfig/blob/master/LICENSE)
