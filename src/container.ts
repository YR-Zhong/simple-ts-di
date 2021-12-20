import "reflect-metadata";

import { INJECT, INJECT_WITH_NAME } from "./annotation";

type Constructor<T = any> = new (...args: any[]) => T;

const container = new Map();
class IocContainer<T> {
  bind(key: Constructor<T>, value: any) {
    const constructorInstance = new value.constructor();
    const namedAnnotation = Reflect.getMetadata(
      INJECT_WITH_NAME,
      constructorInstance
    );
    if (!namedAnnotation) {
      container.set(key, value);
      return;
    }

    const namedDependency = container.get(key);
    container.set(key, [
      ...(namedDependency || []),
      { namedAnnotation, value },
    ]);
  }

  get(dependencyClass: Constructor<T>): any {
    const injectableClass = container.get(dependencyClass);
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
        ? (instance[key] = container
            .get(value)
            .find(({ name: dependencyName }) => dependencyName === name).value)
        : container.get(value);
    });
    return instance;
  }

  clearDependency(): void {
    container.clear();
  }
}

export const iocContainer = new IocContainer();
