import { Transform } from "reduxjs-toolkit-persist/lib/types";
type TransformType = "whitelist" | "blacklist";
type CustomFilterPath = {
    path: string | string[];
    filterFunction: (item: any) => boolean;
};
type FilterPath = string | string[] | string[][] | CustomFilterPath[];
export declare function createFilter(reducerName: string, inboundPaths?: FilterPath, outboundPaths?: FilterPath, transformType?: TransformType): Transform<unknown, unknown>;
export declare function createWhitelistFilter(reducerName: string, inboundPaths?: FilterPath, outboundPaths?: FilterPath): Transform<unknown, unknown, any, any>;
export declare function createBlacklistFilter(reducerName: string, inboundPaths?: FilterPath, outboundPaths?: FilterPath): Transform<unknown, unknown, any, any>;
export declare function persistFilter<State extends Record<string, unknown>>(state: State, paths?: FilterPath, transformType?: TransformType): State;
export default createFilter;
