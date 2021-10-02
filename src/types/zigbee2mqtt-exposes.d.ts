declare namespace Zigbee2Mqtt {
  // features are directly exposed as a state property
  namespace Feature {
    interface Base {
      // type: string;
      name: string;
      property: string;
      access: number;
      description?: string;
      endpoint?: string;
    }

    interface Binary extends Base {
      type: 'binary';
      value_on: boolean | string;
      value_off: boolean | string;
      value_toggle?: string;
    }

    interface Numeric extends Base {
      type: 'numeric';
      unit?: string;
      value_min?: number;
      value_max?: number;
      value_step?: number;
      presets?: { name: string; value: number; description: string }[];
    }

    interface Enum extends Base {
      type: 'enum';
      values: (string | number)[];
    }

    interface Text extends Base {
      type: 'text';
    }

    type Scalar = Binary | Numeric | Enum | Text;

    interface Composite {
      type: 'composite';
      name: string;
      property: string;
      features: Scalar[];
    }
  }

  type Feature = Feature.Composite | Feature.Scalar;

  interface ExposedDevice {
    type: 'switch' | 'light' | 'cover' | 'lock' | 'climate' | 'fan';
    features: Feature[];
    endpoint?: string;
  }

  type Expose = Feature | ExposedDevice;

  type ExposeWithFeatures = ExposedDevice | Feature.Composite;
}
