module.exports.get = function (req, res) {
    res.json({ message: "Posts Router", author: req.params.author });
}

module.exports.put = function (req, res) {
    res.json({ message: "Posts Router - PUT Method", author: req.params.author });
}