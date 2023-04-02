# Effotless Express

Use you your folder structure to create your routes!(Both <b>Typescript</b> and <b>Javascript</b> files)

By using some simple patterns you are able to build your api without a messy big Express App file.

This file structure leads to these API's:

<img width="796" alt="Screenshot 2023-04-02 at 3 50 48 PM" src="https://user-images.githubusercontent.com/43247296/229357200-33fb1de2-16aa-473d-b625-4c2bb63be471.png">

## Installation:

```bash
npm install effortless-express
```

## Quick Start

```javascript
const app = require("express")();
const { load } = require("effortless-express");

load(app, path.join(__dirname, "./source_files"));

app.listen(2000);
```

### Add a Route(Express Router)

Create a file that has `route` before file extension(Examples: `route.js`, `route.ts`, `myRoute.route.ts` and this is the pattern that we check `.*\.${pattern}\.(js|ts)$`) in its file name.

Now you have three options:

- You can export a `Express Router`
  ```typescript
  const express = require("express");
  const router = express.Router();
  router.get("/", (req, res) =>
    res.json({ message: "Customers Router - GET Method" })
  );
  module.exports = router;
  ```
- Directly export a function that handles the requets:
  ```typescript
  module.exports = (req, res) => {
    res.json({ message: "Health Check Route" });
  };
  ```
- Or export specific methods you have implemented:
  ```typescript
  const get = (req, res) => res.json({ message: "Shop Route GET" });
  const post = (req, res) => res.json({ message: "Shop Route POST" });
  module.exports = { get, post };
  ```

### Add a Method Router

Use the http methods before file extensions(Examples: `users.get.ts`, `post.js`, `customers.put.ts` and this is the pattern we use: `/.*\.(get|post|put|delete|patch)\.(js|ts)$/`).

Simply export the function from the file:

```typescript
module.exports = function (req, res) {
  res.json({ message: "Payments Router" });
};
```

## Philosophy

effortles-express philosophy is to provide a simple and clean structure for express projects by using folder base routes. In this way you can remove your routes from `app.js|ts` and by creating folders and files you can create your desired routes. Also it helps you keep your files small by suggesting using second way(`yourFileName.get.ts`)

## People

The original author of effortless-express is [Poorshad](https://github.com/pshaddel)

## Code Examples

[Examples](https://github.com/pshaddel/effortless-examples/tree/master/effortless-express)

## Contributing

If you needed a change feel free to open an issue or even make a pull request!

[Contributing](https://github.com/pshaddel/efforless-express)
