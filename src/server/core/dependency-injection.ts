import 'reflect-metadata';

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
      metadata.set('services', TargetClassWrapper, instance);
    });

    metadata.set('services', TargetClassWrapper);

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
    const TargetClassWrapper = makeDependencyInjection(TargetClass, instance => {
      metadata.set('routes', TargetClassWrapper, instance);
    });

    metadata.set('routes', TargetClassWrapper);

    return TargetClassWrapper;
  };
}

function makeDependencyInjection<T extends Type<any>>(TargetClass: T, init?: (instance: any) => void): T {
  let dependenceInjections: Type<any>[] = Reflect.getMetadata('design:paramtypes', TargetClass);

  const TargetClassWrapper = class extends TargetClass {
    constructor(...args: any[]) {
      super(...dependenceInjections.map(metadata.getInjection));

      if (init) {
        init(this);
      }
    }
  };

  return TargetClassWrapper;
}
