import path from 'path';
import requireSearch from './lib/require_search';
import requireSilent from './lib/require_silent';


class Resource {

    constructor(name, routes, controller) {
        this.name = name;
        this.routes = routes;
        this.controller = controller;
    }

    static createFromFS(name, searchPaths) {
        var routeModulePath, moduleBasePath;
        if (typeof name === 'string') {
            routeModulePath = requireSearch(path.join(name, 'routes'), searchPaths);
            moduleBasePath = path.dirname(routeModulePath);
            return new this(
                name,
                require(routeModulePath),
                requireSilent(path.join(moduleBasePath, 'controller'))
            );
        }
        if (!name) {
            name = {};
        }
        if (!name.name) {
            throw new Error('Unable to parse a module without a name.');
        }
        if (!name.routes) {
            throw new Error('Unable to parse a module without a routes object.');
        }
        return name;
    }

};

export default Resource;