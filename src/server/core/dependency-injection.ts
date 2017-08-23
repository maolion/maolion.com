import 'reflect-metadata';
import { Controller } from 'vio';

import { Type } from './type';

import * as metadata from './metadata';

export type InjectionDecorator = (TargetClass: Type<any>) => any;

export function App(): InjectionDecorator {
  return <T extends Type<any>>(TargetClass: T): T => {
    const TargetClassWrapper = makeDependencyInjection(TargetClass, instance => {
      metadata.set('app', instance);
    });

    return TargetClassWrapper;
  };
}

export function Injectable(): InjectionDecorator {
  return <T extends Type<any>>(TargetClass: T): T => {
    const TargetClassWrapper = makeDependencyInjection(TargetClass, instance => {
      metadata.set('providers', TargetClassWrapper, instance);
    });

    metadata.set('providers', TargetClassWrapper);

    return TargetClassWrapper;
  };
}

export function Module(): InjectionDecorator {
  return <T extends Type<any>>(TargetClass: T): T => {
    const TargetClassWrapper = makeDependencyInjection(TargetClass, instance => {
      metadata.set('modules', TargetClassWrapper, instance);
    });

    metadata.set('modules', TargetClassWrapper);

    return TargetClassWrapper;
  };
}

export function Route(): InjectionDecorator {
  return <T extends Type<any>>(TargetClass: T): T => {
    if (TargetClass.prototype.constructor !== Object && !(TargetClass.prototype instanceof Controller)) {
      throw new Error('This route class must extends "vio/Controller" class.');
    }

    if (!(TargetClass.prototype instanceof Controller)) {
      const OriginalTargetClass = TargetClass;
      const originalTargetClassPrototype = TargetClass.prototype;

      class Bridge extends Controller {
        constructor(...args: any[]) {
          super();
          OriginalTargetClass.apply(this, ...args);
        }
      }

      for (let key of Object.keys(originalTargetClassPrototype)) {
        (Bridge.prototype as any)[key] = originalTargetClassPrototype[key];
      }

      Object.defineProperty(Bridge, 'name', {
        value: TargetClass.name,
      });

      TargetClass = Bridge as T;
    }

    const TargetClassWrapper = makeDependencyInjection(TargetClass);

    metadata.set('routes', TargetClassWrapper);

    return TargetClassWrapper;
  };
}

export function inject<T extends Type<any>>(TargetClass: T, instance: any): void {
  if (!metadata.has('providers', TargetClass)) {
    throw new Error(`No provider for ${TargetClass.name}`);
  }

  metadata.set('providers', TargetClass, instance);
}

export function getApp<T>(): T | undefined {
  return metadata.get('app');
}

export function getInjection<T>(target: Type<T>): T {
  let matchTargetType: 'providers' | 'modules' | 'routes' | undefined;

  if (metadata.has('providers', target)) {
    matchTargetType = 'providers';
  } else if (metadata.has('modules', target)) {
    matchTargetType = 'modules';
  } else if (metadata.has('routes', target)) {
    matchTargetType = 'routes';
  }

  if (!matchTargetType) {
    throw new Error(`No provider for ${target.name}`);
  }

  return metadata.get(matchTargetType, target) || new target();
}

function makeDependencyInjection<T extends Type<any>>(TargetClass: T, init?: (instance: any) => void): T {
  let dependenceInjections: Type<any>[] = Reflect.getMetadata('design:paramtypes', TargetClass);

  const TargetClassWrapper = class extends TargetClass {
    constructor(...args: any[]) {
      super(...dependenceInjections.map(getInjection));

      if (init) {
        init(this);
      }
    }
  };

  Object.defineProperty(TargetClassWrapper, 'name', {
    value: TargetClass.name,
  });

  return TargetClassWrapper;
}
