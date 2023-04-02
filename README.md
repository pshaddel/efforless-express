# Effotless Express

Use you your folder structure to create your routes!

By using some simple patterns you are able to build your api without a messy big Express App file.

This file structure leads to these API's:

<img width="796" alt="Screenshot 2023-04-02 at 3 50 48 PM" src="https://user-images.githubusercontent.com/43247296/229357200-33fb1de2-16aa-473d-b625-4c2bb63be471.png">


## Installation:

```bash
npm install effortless-express
```

## Quick Start

```javascript
const express = require("express");
const app = express();
const { load } = require("effortless-express");

load(app, path.join(__dirname, "./source_files"));

app.listen(2000);
```

Now `effortless-express` is looking into your `src`(right now you cannot change this folder name) folder and in order to create a route you have a few options:
####1. create a `route.js` file and export http methods:
For example if I create a folder named `users` and I create a file named `route.js`
my route will be this : `myBaseURL:myPort/users`
If I want to handle requests with `get` method all I need to do is implementing `get` method inside `route.js`

`route.js:`

```javascript
module.exports.get = (req, res, next) => {
  res.send("get method implemented!");
};
```


## Features

- File base routes which supports nested foldering.
- Routes separated by methods(`route.get.js, route.post.js, route.put.js, ...`)
- Make your `app.js` or `server.js` clean by using folder based routes.

## Philosophy

effortles-express philosophy is to provide a simple and clean structure for express projects by using folder base routes. In this way you can remove your routes from `app.js` and by creating folders and files you can create your desired routes. Also instead it helps you keep your files small by suggesting using second way(`route.get.js, route.post.js`)

## People

The original author of effortless-express is [Poorshad](https://github.com/pshaddel)

## Code Examples

[Examples](https://github.com/pshaddel/effortless-examples/tree/master/effortless-express)

## Contributing

[Contributing](https://github.com/pshaddel/efforless-express)
