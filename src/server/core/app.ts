import 'reflect-metadata';

import { Type } from './type';

import { getInject } from './injectable';
import * as metadata from './metadata';

export function App() {
  return <T extends Type<any>>(TargetClass: T): T => {
    let dependenceProviders: Type<any>[] = Reflect.getMetadata('design:paramtypes', TargetClass);

    const App = class extends TargetClass {
      constructor(...args: any[]) {
        super(...dependenceProviders.map(getInject));
        metadata.set('app', this);
      }
    };

    Object.defineProperty(App, 'name', {
      ...Object.getOwnPropertyDescriptor(App, 'name'),
      value: TargetClass.name,
    });

    return App;
  };
}

export function getApp<T>(): T | undefined {
  return metadata.get('app');
}
