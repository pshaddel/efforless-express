# Effotless express
As far as I'm concenrned when we use `express` in our nodejs app we need to put our routes in a file which some people name it `app.js` or `server.js` and my problem was handling a lot of routes in this file. I decided to create an `express middleware` to organize routes based on folders structure of my application.
By default it uses `src` folder as root and you can create your routes just by creating folders and files.

## Installation: 
``` npm install effortless-express ```
## Quick Start

```javascript
const express = require('express');
const app = express();
const effortlessExpress = require('effortless-express');

app.use(effortlessExpress);

app.listen(2000);
```

Now `effortless-express` is looking into your `src` folder and in order to create a route you have two options:
###1. create a `route.js` file and export http methods:
For example if I create a folder named `users` and I create a file named `route.js`
my route will be this : `myBaseURL:myPort/users`
If I want to handle requests with `get` method all I need to do is implementing `get` method inside `route.js`

`route.js:`
```javascript
module.exports.get = (req, res, next)=>{
    res.send("get method implemented!");
}
```
###1. create `route.[http method].js`: In this way you can implement your http methods in a single file:
For example I can create a folder named `places` and I creaete a file named `route.get.js`
my route will be this :  `myBaseURL:myPort/places`
And in order to handle requests all I need is exporting a function from this file
`route.get.js`

```javascript
module.exports = (req, res, next)=>{
    res.send('getting places...');
}
```
