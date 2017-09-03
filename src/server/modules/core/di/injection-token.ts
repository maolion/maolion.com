import { OpaqueToken } from './metadata';

export class InjectionToken extends OpaqueToken {
  constructor(desc: string) {
    super(desc);
  }

  toString(): string {
     return `InjectionToken ${this._desc};`;
  }
}
