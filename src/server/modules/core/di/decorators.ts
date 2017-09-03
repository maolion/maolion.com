import 'reflect-metadata';
import { Controller } from 'vio';

import { Type } from '../type';

import * as metadata from './metadata';

import { InjectionToken } from './injection-token';

import { getInjection } from './dependency';

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

export function Routes(): InjectionDecorator {
  return <T extends Type<any>>(TargetClass: T): T => {
    if (!(TargetClass.prototype instanceof Controller)) {
      throw new Error('This route class must extends "vio/Controller" class.');
    }

    const TargetClassWrapper = makeDependencyInjection(TargetClass);

    metadata.set('routes', TargetClassWrapper);

    return TargetClassWrapper;
  };
}

export function Inject(token: InjectionToken): ParameterDecorator {
  return (target: object, propertyKey: string | symbol, parameterIndex: number): void => {
    let dependenceInjectionTypes: (Type<any> | InjectionToken)[] = Reflect.getMetadata('design:paramtypes', target);
    dependenceInjectionTypes[parameterIndex] = token;
  };
}

export function getApp<T>(): T | undefined {
  return metadata.get('app');
}

function makeDependencyInjection<T extends Type<any>>(TargetClass: T, init?: (instance: any) => void): T {
  let dependenceInjectionTypes: Type<any>[] = Reflect.getMetadata('design:paramtypes', TargetClass) || [];

  const TargetClassWrapper = class extends TargetClass {
    constructor(...args: any[]) {
      super(...dependenceInjectionTypes.map(getInjection));

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
