import "reflect-metadata";

import { INJECT, INJECT_WITH_NAME } from "./index";

type Constructor<T = any> = new (...args: any[]) => T;

export class IocContainer<T> {
  public map = new Map<Constructor<T>, any>();

  bind(key: Constructor<T>, value: any) {
    const constructorInstance = new value.constructor();
    const name = Reflect.getMetadata(INJECT_WITH_NAME, constructorInstance);
    if (!name) {
      this.map.set(key, value);
      return;
    }

    const namedDependency = this.map.get(key);
    this.map.set(key, [...(namedDependency || []), { name, value }]);
  }

  get(dependencyClass: Constructor<T>): any {
    const injectableClass = this.map.get(dependencyClass);
    const dependency: Record<string, any> = Reflect.getMetadata(
      INJECT,
      injectableClass
    );
    if (!dependency) {
      return injectableClass;
    }
    const instance = Reflect.construct(injectableClass, []);
    Object.entries(dependency).forEach(([key, { name, value }]) => {
      instance[key] = name
        ? (instance[key] = this.map
            .get(value)
            .find(({ name: dependencyName }) => dependencyName === name).value)
        : this.map.get(value);
    });
    return instance;
  }
}
