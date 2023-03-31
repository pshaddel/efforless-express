# Effotless Express

When we use `express` in our nodejs app we need to put our routes in a file which some people name it `app.js` or `server.js` and this simple package solves the problem of handling a lot of routes in `app.js` file. I decided to create an `express middleware` to organize routes based on folders structure of your application.
By default it uses `src` folder as root and you can create your routes just by creating folders and files.

## Installation:

`npm install effortless-express`

## Quick Start

```javascript
const express = require("express");
const app = express();
const { loadRoutes } = require("effortless-express");

loadRoutes(app, path.join(__dirname, "src")); // if the files are in src folder

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

####2. create `route.[http method].js`: In this way you can implement your http methods in separate files:
For example I can create a folder named `places` and I create a file named `route.get.js`
my route will be this : `myBaseURL:myPort/places`
And in order to handle requests all I need is exporting a function from this file
`route.get.js`

```javascript
module.exports = (req, res, next) => {
  res.send("getting places...");
};
```

####3. combination of 1 and 2 :
You can use both of this methods but this packages priority is the first one. You can implement few methods in your `route.js` file and you can create other files for methods which are not in your `route.js` file.

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
