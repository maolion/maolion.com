import { App, Injectable } from './core';

@Injectable()
class A {
  constructor() {
    console.log('hello, A');
  }
}

@Injectable()
class B {
  constructor(
    test: A,
  ) {
    console.log('hello, B')
  }
}

@Injectable()
class C {
  constructor() {
    console.log('hello, C');
  }

  test() {
    console.log('test, C');
  }
}

@App()
class MyApp {
  constructor(
    public a: A,
    public b: B,
    public c: C,
  ) {
    console.log('hello, world');
    c.test();
  }
}

new (MyApp as any)();
