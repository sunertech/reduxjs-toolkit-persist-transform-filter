import { createTransform } from "reduxjs-toolkit-persist";
import get from "lodash/get";
import set from "lodash/set";
import unset from "lodash/unset";
import pickBy from "lodash/pickBy";
import isEmpty from "lodash/isEmpty";
import forIn from "lodash/forIn";
import cloneDeep from "lodash/cloneDeep";
import { Transform } from "reduxjs-toolkit-persist/lib/types";

type TransformType = "whitelist" | "blacklist";

type CustomFilterPath = {
  path: string | string[];
  filterFunction: (item: any) => boolean;
};
type FilterPath = string | string[] | string[][] | CustomFilterPath[];

export function createFilter(
  reducerName: string,
  inboundPaths: FilterPath = undefined,
  outboundPaths: FilterPath = undefined,
  transformType: TransformType = "whitelist"
): Transform<unknown, unknown> {
  return createTransform(
    // inbound
    (inboundState: Record<string, unknown>) => {
      return inboundPaths
        ? persistFilter(inboundState, inboundPaths, transformType)
        : inboundState;
    },

    // outbound
    (outboundState: Record<string, unknown>) => {
      return outboundPaths
        ? persistFilter(outboundState, outboundPaths, transformType)
        : outboundState;
    },

    { whitelist: [reducerName] }
  );
}

export function createWhitelistFilter(
  reducerName: string,
  inboundPaths?: FilterPath,
  outboundPaths?: FilterPath
) {
  return createFilter(reducerName, inboundPaths, outboundPaths, "whitelist");
}

export function createBlacklistFilter(
  reducerName: string,
  inboundPaths?: FilterPath,
  outboundPaths?: FilterPath
) {
  return createFilter(reducerName, inboundPaths, outboundPaths, "blacklist");
}

function filterObject(
  { path, filterFunction = () => true }: CustomFilterPath,
  state: Record<string, unknown>
) {
  const value = get(state, path, state);

  if (value instanceof Array) {
    return value.filter(filterFunction);
  }

  return pickBy(value, filterFunction);
}

export function persistFilter<State extends Record<string, unknown>>(
  state: State,
  paths: FilterPath = [],
  transformType: TransformType = "whitelist"
): State {
  let subset = {} as State;

  // support only one key
  if (typeof paths === "string") {
    paths = [paths];
  }

  if (transformType === "whitelist") {
    paths.forEach((path) => {
      if (typeof path === "object" && !(path instanceof Array)) {
        const value = filterObject(path, state);

        if (!isEmpty(value)) {
          set(subset, path.path, value);
        }
      } else {
        const value = get(state, path);

        if (typeof value !== "undefined") {
          set(subset, path, value);
        }
      }
    });
  } else if (transformType === "blacklist") {
    subset = cloneDeep(state);
    paths.forEach((path) => {
      if (typeof path === "object" && !(path instanceof Array)) {
        const value = filterObject(path, state);

        if (!isEmpty(value)) {
          if (value instanceof Array) {
            set(
              subset,
              path.path,
              get(subset, path.path, subset).filter((x) => false)
            );
          } else {
            forIn(value, (value, key) => {
              unset(subset, `${path.path}[${key}]`);
            });
          }
        } else {
          subset = value;
        }
      } else {
        const value = get(state, path);

        if (typeof value !== "undefined") {
          unset(subset, path);
        }
      }
    });
  } else {
    subset = state;
  }

  return subset;
}

export default createFilter;
