module.exports = (req, res, next) => {
    const method = req.method.toLowerCase();
    const address = (process.env.baseURL ? process.env.baseURL  + req.originalUrl :  module.parent.path + "/src" + req.originalUrl).toLowerCase();
    try {
        const singleRoute = (address[address.length -1] == '/') ? address +'route' : address +'/route'
        require(singleRoute)[method](req, res, next);
    }
    catch{
        try{
            const routeMethod = (address[address.length -1] == '/') ? address + 'route.' + method : address + '/route.' + method
            require(routeMethod)(req, res, next);
        }
        catch{
            res.status(404).send("Not Found")
        }
    }
    next();
}