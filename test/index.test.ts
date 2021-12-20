import { Inject, InjectNamedProperty, InjectNamedClass } from "../src";
import { IocContainer } from "../src/container";

describe("DI test", () => {
  const iocContainer = new IocContainer();

  afterEach(() => {
    iocContainer.map.clear();
  });

  it("should bind instance", () => {
    class Component {}
    const component = new Component();
    iocContainer.bind(Component, component);

    expect(iocContainer.get(Component)).toBe(component);
  });

  it("should inject with constructor", () => {
    class Component {}
    const component = new Component();
    class Consumer {
      component: Component;
      getComponent(): Component {
        return this.component;
      }
    }
    class ComponentConsumer extends Consumer {
      @Inject() component: Component;
      constructor(component) {
        super();
        this.component = component;
      }
      getComponent(): Component {
        return this.component;
      }
    }
    iocContainer.bind(Component, component);
    iocContainer.bind(Consumer, ComponentConsumer);

    expect(
      (iocContainer.get(Consumer) as ComponentConsumer).getComponent()
    ).toBe(component);
  });

  it("should inject with default constructor", function () {
    class Component {}
    class Consumer extends Component {}
    iocContainer.bind(Consumer, Consumer);

    expect(iocContainer.get(Consumer)).not.toBeNull();
  });

  it("should inject to annotated constructor", function () {
    class Component {}
    class Consumer {
      component: Component;
      getComponent(): Component {
        return this.component;
      }
    }
    class ComponentConsumer extends Consumer {
      @Inject() component: Component;
      constructor();
      constructor(component?: Component) {
        super();
        this.component = component;
      }
      getComponent(): Component {
        return this.component;
      }
    }
    const component = new Component();

    iocContainer.bind(Component, component);
    iocContainer.bind(Consumer, ComponentConsumer);

    expect(component).toBe(iocContainer.get(Consumer).getComponent());
  });

  it("should inject to component with name", function () {
    class Consumer {}
    class ColorComponent {}
    @InjectNamedClass("blue")
    class BlueComponent extends ColorComponent {
      getColor(): string {
        return "blue";
      }
    }
    @InjectNamedClass("red")
    class RedComponent extends ColorComponent {
      getColor(): string {
        return "red";
      }
    }
    class ComponentConsumerWithNamedParam extends Consumer {
      @InjectNamedProperty("blue") blueComponent: ColorComponent;
      @InjectNamedProperty("red") redComponent: ColorComponent;
      constructor(redComponent: ColorComponent, blueComponent: ColorComponent) {
        super();
        this.blueComponent = blueComponent;
        this.redComponent = redComponent;
      }
      getBlueComponent(): ColorComponent {
        return this.blueComponent;
      }
      getRedComponent(): ColorComponent {
        return this.redComponent;
      }
    }

    const blueComponent = new BlueComponent();
    const redComponent = new RedComponent();

    iocContainer.bind(ColorComponent, blueComponent);
    iocContainer.bind(ColorComponent, redComponent);
    iocContainer.bind(Consumer, ComponentConsumerWithNamedParam);

    expect(iocContainer.get(Consumer).getBlueComponent().getColor()).toBe(
      "blue"
    );
    expect(iocContainer.get(Consumer).getRedComponent().getColor()).toBe("red");
  });
});
