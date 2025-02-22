"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFilter = createFilter;
exports.createWhitelistFilter = createWhitelistFilter;
exports.createBlacklistFilter = createBlacklistFilter;
exports.persistFilter = persistFilter;
const reduxjs_toolkit_persist_1 = require("reduxjs-toolkit-persist");
const get_1 = __importDefault(require("lodash/get"));
const set_1 = __importDefault(require("lodash/set"));
const unset_1 = __importDefault(require("lodash/unset"));
const pickBy_1 = __importDefault(require("lodash/pickBy"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const forIn_1 = __importDefault(require("lodash/forIn"));
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
function createFilter(reducerName, inboundPaths = undefined, outboundPaths = undefined, transformType = "whitelist") {
    return (0, reduxjs_toolkit_persist_1.createTransform)(
    // inbound
    (inboundState) => {
        return inboundPaths
            ? persistFilter(inboundState, inboundPaths, transformType)
            : inboundState;
    }, 
    // outbound
    (outboundState) => {
        return outboundPaths
            ? persistFilter(outboundState, outboundPaths, transformType)
            : outboundState;
    }, { whitelist: [reducerName] });
}
function createWhitelistFilter(reducerName, inboundPaths, outboundPaths) {
    return createFilter(reducerName, inboundPaths, outboundPaths, "whitelist");
}
function createBlacklistFilter(reducerName, inboundPaths, outboundPaths) {
    return createFilter(reducerName, inboundPaths, outboundPaths, "blacklist");
}
function filterObject({ path, filterFunction = () => true }, state) {
    const value = (0, get_1.default)(state, path, state);
    if (value instanceof Array) {
        return value.filter(filterFunction);
    }
    return (0, pickBy_1.default)(value, filterFunction);
}
function persistFilter(state, paths = [], transformType = "whitelist") {
    let subset = {};
    // support only one key
    if (typeof paths === "string") {
        paths = [paths];
    }
    if (transformType === "whitelist") {
        paths.forEach((path) => {
            if (typeof path === "object" && !(path instanceof Array)) {
                const value = filterObject(path, state);
                if (!(0, isEmpty_1.default)(value)) {
                    (0, set_1.default)(subset, path.path, value);
                }
            }
            else {
                const value = (0, get_1.default)(state, path);
                if (typeof value !== "undefined") {
                    (0, set_1.default)(subset, path, value);
                }
            }
        });
    }
    else if (transformType === "blacklist") {
        subset = (0, cloneDeep_1.default)(state);
        paths.forEach((path) => {
            if (typeof path === "object" && !(path instanceof Array)) {
                const value = filterObject(path, state);
                if (!(0, isEmpty_1.default)(value)) {
                    if (value instanceof Array) {
                        (0, set_1.default)(subset, path.path, (0, get_1.default)(subset, path.path, subset).filter((x) => false));
                    }
                    else {
                        (0, forIn_1.default)(value, (value, key) => {
                            (0, unset_1.default)(subset, `${path.path}[${key}]`);
                        });
                    }
                }
                else {
                    subset = value;
                }
            }
            else {
                const value = (0, get_1.default)(state, path);
                if (typeof value !== "undefined") {
                    (0, unset_1.default)(subset, path);
                }
            }
        });
    }
    else {
        subset = state;
    }
    return subset;
}
exports.default = createFilter;
//# sourceMappingURL=index.js.map