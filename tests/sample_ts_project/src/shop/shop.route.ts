const get = (req, res) => res.json({ message: "Shop Route GET" });
const post = (req, res) => res.json({ message: "Shop Route POST" });
module.exports = { get, post };
