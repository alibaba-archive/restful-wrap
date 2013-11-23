# Simple example

## Install deps

```bash
$ npm install
```

## Start

```bash
$ node examples/worker.js
```

## Test

```bash
$ curl 'localhost:1984/v1/users/1?token=dev'
```

It should return:

```json
{"name":"foo","params":{"token":"dev","uid":"1"}}
```
