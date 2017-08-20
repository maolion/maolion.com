
import { Type } from './type';

export type MetaDataType = 'app' | 'services' | 'modules' | 'routes';

export type ServicesMap<T> = Map<Type<T>, T>;
export type ModulesMap<T> = Map<Type<T>, T>;
export type RoutesMap<T> = Map<Type<T>, T>;

let metaDataMap = new Map<MetaDataType, any>();

export function get<T>(target: 'app'): T | undefined;
export function get<T>(target: 'services'): ServicesMap<T> | undefined;
export function get<T>(target: 'modules'): ModulesMap<T> | undefined;
export function get<T>(target: 'routes'): RoutesMap<T> | undefined;
export function get<T>(target: 'services' | 'modules' | 'routes', subTarget: Type<T>): T | undefined;
export function get(target: MetaDataType, subTarget?: any): any {
  switch (target) {
    case 'services':
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
export function set<T>(target: 'services' | 'modules' | 'routes', provider: Type<T>, instance?: T): void;
export function set(target: MetaDataType, subTarget?: any, value?: any): any {
  switch (target) {
    case 'app':
      value = subTarget;
      metaDataMap.set(target, value);
      break;
    case 'services':
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

export function has<T>(target: 'services' | 'modules' | 'routes', provider: Type<T>): boolean;
export function has(target: MetaDataType, subTarget: any): any {
  switch (target) {
    case 'services':
      let map = metaDataMap.get(target);
      if (!map) {
        return false;
      }

      return map.has(subTarget);
  }

  return false;
}

export function getApp<T>(): T | undefined {
  return get('app');
}

export function getInjection<T>(target: Type<T>): T {
  let matchTargetType: 'services' | 'modules' | 'routes' | undefined;

  if (has('services', target)) {
    matchTargetType = 'services';
  } else if (has('modules', target)) {
    matchTargetType = 'modules';
  } else if (has('routes', target)) {
    matchTargetType = 'routes';
  }

  if (!matchTargetType) {
    throw new Error(`No provider injection for ${target.name}`);
  }

  return get(matchTargetType, target) || new target();
}
