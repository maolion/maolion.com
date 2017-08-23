
import { Type } from './type';

export type MetaDataType = 'app' | 'providers' | 'modules' | 'routes';

export type ServicesMap<T> = Map<Type<T>, T>;
export type ModulesMap<T> = Map<Type<T>, T>;
export type RoutesMap<T> = Map<Type<T>, T>;

let metaDataMap = new Map<MetaDataType, any>();

export function get<T>(target: 'app'): T | undefined;
export function get<T>(target: 'providers'): ServicesMap<T> | undefined;
export function get<T>(target: 'modules'): ModulesMap<T> | undefined;
export function get<T>(target: 'routes'): RoutesMap<T> | undefined;
export function get<T>(target: 'providers' | 'modules' | 'routes', subTarget: Type<T>): T | undefined;
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
export function set<T>(target: 'providers' | 'modules' | 'routes', provider: Type<T>, instance?: T): void;
export function set(target: MetaDataType, subTarget?: any, value?: any): any {
  switch (target) {
    case 'app':
      value = subTarget;
      metaDataMap.set(target, value);
      break;
    case 'providers':
    case 'modules':
    case 'routes':
      let map = metaDataMap.get(target);

      if (!map) {
        metaDataMap.set(target, map = new Map());
      }

      map.set(subTarget, value);
      break;
  }
}

export function has<T>(target: 'providers' | 'modules' | 'routes', provider: Type<T>): boolean;
export function has(target: MetaDataType, subTarget: any): any {
  switch (target) {
    case 'providers':
      let map = metaDataMap.get(target);
      if (!map) {
        return false;
      }

      return map.has(subTarget);
  }

  return false;
}
