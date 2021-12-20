import "reflect-metadata";

export const INJECT = "inject";
export const INJECT_WITH_NAME = "inject_with_name";

export function Inject() {
  return (target: any, dependencyName: string) => {
    const { constructor } = target;
    const dependencyClass = Reflect.getMetadata(
      "design:type",
      target,
      dependencyName
    );
    Reflect.defineMetadata(
      INJECT,
      { [dependencyName]: { value: dependencyClass } },
      constructor
    );
  };
}

export function InjectNamedClass(name: string) {
  return (target: any) => {
    Reflect.defineMetadata(INJECT_WITH_NAME, name, target.prototype);
    return target;
  };
}

export function InjectNamedProperty(name: string) {
  return (target: any, dependencyName: string) => {
    const { constructor } = target;
    const propertyType = Reflect.getMetadata(
      "design:type",
      target,
      dependencyName
    );
    const shouldReInject = Boolean(Reflect.hasOwnMetadata(INJECT, constructor));
    const dependency = Object.assign(
      {
        [dependencyName]: {
          name,
          value: propertyType,
        },
      },
      shouldReInject ? Reflect.getMetadata(INJECT, constructor) : {}
    );
    Reflect.defineMetadata(INJECT, dependency, constructor);
    return;
  };
}
