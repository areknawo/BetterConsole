import { PropType } from "vue";

type StyleProps = Record<string, string | number | boolean | undefined>;
type Config<Ps extends StyleProps> = Array<
  [{ [P in keyof Ps]?: Ps[P] | Array<Ps[P]> }, string] | string
>;
type Defaults<Ps extends StyleProps> = { [P in keyof Ps]?: Ps[P] };
type VueProps<Ps extends StyleProps, Ds extends Defaults<Ps>> = {
  [P in keyof Ps]: {
    type: PropType<Ps[P]>;
    default: Ds[P];
    required: Ds[P] extends string | number | boolean ? false : true;
  };
};

interface Result<Ps extends StyleProps> {
  getVueProps<Ds extends Defaults<Ps>>(defaults: Ds): VueProps<Ps, Ds>;
  getClass(props: Partial<RequiredOnly<Ps>>): string;
}

const merge = <Ps extends StyleProps>(
  mergedMatch: { [P in keyof Ps]?: Ps[P] },
  config: Config<Ps>
): Config<Ps> => {
  return config.map((value) => {
    if (typeof value === "object") {
      const [match, className] = value;

      return [{ ...mergedMatch, ...match }, className];
    }

    return [{ ...mergedMatch }, value];
  });
};
const styleProps = <Ps extends StyleProps>(config: Config<Ps>): Result<Ps> => {
  return {
    getClass(props: Ps) {
      return config
        .map((value) => {
          if (typeof value === "object") {
            const [match, className] = value;

            let applies = true;

            Object.keys(match).forEach((prop) => {
              if (applies) {
                const value = match[prop];

                if (typeof value === "object") {
                  applies = value.includes(props[prop] as Ps[string]);
                } else {
                  applies = value === props[prop];
                }
              }
            });

            return applies ? className : "";
          }

          return value;
        })
        .filter((value) => value)
        .join(" ");
    },
    getVueProps(defaults) {
      const keys: string[] = [];
      const result = {} as VueProps<Ps, typeof defaults>;

      config.forEach((value) => {
        if (typeof value === "object") {
          Object.keys(value[0]).forEach((matchKey) => {
            if (!keys.includes(matchKey)) {
              keys.push(matchKey);
            }
          });
        }
      });
      keys.forEach((key: keyof Ps) => {
        const defaultValue = defaults[key];

        result[key] = {
          default: defaultValue,
          required: typeof defaultValue === "undefined",
          type: [String, Number, Boolean] as PropType<string | number | boolean>
        } as typeof result[typeof key];
      });

      return result;
    }
  };
};

export { StyleProps, merge, styleProps };
