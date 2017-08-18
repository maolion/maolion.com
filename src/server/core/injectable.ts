import 'reflect-metadata';

import { Type } from './type';

import * as metadata from './metadata';

export function Injectable() {
  return <T extends Type<any>>(TargetClass: T): T => {
    let dependenceProviders: Type<any>[] = Reflect.getMetadata('design:paramtypes', TargetClass);

    const Provider = class extends TargetClass {
      constructor(...args: any[]) {
        super(...dependenceProviders.map(getInject));
        metadata.set('providers', Provider, this);
      }
    };

    Object.defineProperty(Provider, 'name', {
      ...Object.getOwnPropertyDescriptor(Provider, 'name'),
      value: TargetClass.name,
    });

    metadata.set('providers', Provider);

    return Provider;
  };
}

export function getInject<T>(provider: Type<T>): T | undefined {
  if (!metadata.has('providers', provider)) {
    throw new Error(`No provider for ${provider.name}`);
  }

  return metadata.get('providers', provider) || new provider();
}
