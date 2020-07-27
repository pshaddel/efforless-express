const defaultPath = "src";
const defaultRouteFileName = "route";

module.exports = (req, res, next) => {
    const method = req.method.toLowerCase();
    const address = (module.parent.path + `/${defaultPath}` + req.originalUrl).toLowerCase().split("?")[0];
    const haveSlash = address[address.length -1] == '/';
    try {
        const singleRoute = haveSlash ? address + defaultRouteFileName : address + '/' + defaultRouteFileName
        require(singleRoute)[method](req, res, next);
    }
    catch {
        try {
            const routeMethod = haveSlash ? address + `${defaultRouteFileName}.` + method : address + `/${defaultRouteFileName}.` + method
            require(routeMethod)(req, res, next);
        }
        catch {
            try {
                const { newAddress, id } = getIdFileAddress(address)
                require(newAddress)[method](req, res, next, id);
            }
            catch (error) {
                console.error(error)
                res.status(404).send("Not Found");
            }
        }
    }
    next();
}

const getIdFileAddress = (address) => {
    let newAddress = address.split("/")
    newAddress.pop();
    newAddress = newAddress.join("/")
    newAddress = newAddress[newAddress.length - 1] == "/" ? newAddress + "[id]" : newAddress + "/[id]"
    let id = address.split("/")[address.split("/").length - 1];
    return { id, newAddress };
}