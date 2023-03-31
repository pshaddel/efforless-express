const { loadRoutes } = require("../../lib");
const path = require("path");
const app = require("express")();

app.get("/", (req, res) => {
  res.send("ping!");
});

loadRoutes(app, path.join(__dirname, 'src'));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
