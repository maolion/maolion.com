
import { Type } from '../type';

export class OpaqueToken {
  constructor(protected _desc: string) {}

  toString(): string {
    return `Token ${this._desc};`;
  }
}

export type MetaDataType = 'app' | 'providers' | 'modules' | 'routes';

export type ProvidersMap<T> = Map<Type<T> | OpaqueToken, T>;
export type ModulesMap<T> = Map<Type<T>, T>;
export type RoutesMap<T> = Map<Type<T>, T>;

let metaDataMap = new Map<MetaDataType, any>();

export function get<T>(target: 'app'): T | undefined;
export function get<T>(target: 'providers'): ProvidersMap<T> | undefined;
export function get<T>(target: 'modules'): ModulesMap<T> | undefined;
export function get<T>(target: 'routes'): RoutesMap<T> | undefined;
export function get<T>(target: 'providers' | 'modules' | 'routes', subTarget: Type<T> | OpaqueToken): T | undefined;
export function get(target: MetaDataType, subTarget?: any): any {
  switch (target) {
    case 'providers':
    case 'modules':
    case 'routes':
      let map = metaDataMap.get(target);

      if (!map) {
        return undefined;
      }

      return subTarget ? map.get(subTarget) : map;

    default:
      return metaDataMap.get(target);
  }
}

export function set<T>(target: 'app', instance: T): void;
export function set<T>(target: 'providers' | 'modules' | 'routes', provider: Type<T> | OpaqueToken, instance?: T): void;
export function set(target: MetaDataType, subTarget?: any, value?: any): any {
  switch (target) {
    case 'providers':
    case 'modules':
    case 'routes':
      let map = metaDataMap.get(target);

      if (!map) {
        metaDataMap.set(target, map = new Map());
      }

      map.set(subTarget, value);
      break;
    default:
      value = subTarget;
      metaDataMap.set(target, value);
      break;
  }
}

export function has<T>(target: 'app'): boolean;
export function has<T>(target: 'providers' | 'modules' | 'routes', provider: Type<T> | OpaqueToken): boolean;
export function has(target: MetaDataType, subTarget?: any): any {
  switch (target) {
    case 'providers':
    case 'modules':
    case 'routes':
      let map = metaDataMap.get(target);
      if (!map) {
        return false;
      }

      return map.has(subTarget);
    default:
      return metaDataMap.has(target);
  }
}
