import { Type } from '../type';

import * as metadata from './metadata';

import { InjectionToken } from './injection-token';

type InjectionType = 'providers' | 'modules' | 'routes';

export function getInjection<T>(injectionType: Type<T> | InjectionToken): T {
  let matchTargetType: InjectionType | undefined;

  if (metadata.has('providers', injectionType)) {
    matchTargetType = 'providers';
  } else if (metadata.has('modules', injectionType)) {
    matchTargetType = 'modules';
  } else if (metadata.has('routes', injectionType)) {
    matchTargetType = 'routes';
  }

  if (!matchTargetType) {
    if (injectionType instanceof InjectionToken) {
      throw new Error(`No provider for ${injectionType.toString()}`);
    } else {
      throw new Error(`No provider for ${injectionType.name}`);
    }
  }

  let instance = metadata.get(matchTargetType, injectionType);

  if (instance === undefined) {
    if (injectionType instanceof InjectionToken) {
      throw new Error(`No provider for ${injectionType.toString()}`);
    } else {
      instance = new injectionType();
    }
  }

  return instance;
}

export function inject<T extends Type<any>>(injectionType: T | InjectionToken, instance: any): void {
  if (!(injectionType instanceof InjectionToken) && !metadata.has('providers', injectionType)) {
    throw new Error(`No provider for ${injectionType.name}`);
  }

  metadata.set('providers', injectionType, instance);
}
