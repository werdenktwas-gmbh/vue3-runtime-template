import { h } from "vue";

const defineDescriptor = (src, dest, name) => {
  // eslint-disable-next-line no-prototype-builtins
  if (!dest.hasOwnProperty(name)) {
    const descriptor = Object.getOwnPropertyDescriptor(src, name);
    Object.defineProperty(dest, name, descriptor);
  }
};

const merge = (objs) => {
  const res = {};
  objs.forEach((obj) => {
    obj &&
      Object.getOwnPropertyNames(obj).forEach((name) =>
        defineDescriptor(obj, res, name)
      );
  });
  return res;
};

const buildFromProps = (obj, props) => {
  const res = {};
  props.forEach((prop) => defineDescriptor(obj, res, prop));
  return res;
};
/* This fork of vue3-runtime-template plugin has been made to suit the needs of the composition api
 * in particular, the necessity of our project to use setup() instead of data, computed, props, methods etc.
 * If you wish to continue using the options api, then this fork is not gonna work for you.
 * Instead, you shall stick to the original vue3-runtime-template solution
 */
export default {
  props: {
    template: String,
    parent: Object,
    templateProps: {
      type: Object,
      default: () => ({}),
    },
  },
  render() {
    if (this.template) {
      const parent = this.parent || this.$parent;
      const { $options: parentOptions = {} } = parent;

      const { components: parentComponents = {} } = parentOptions;
      const { $options: { components = {} } = {} } = this;
      const passthrough = {
        $setup: {},
        components: {},
        methods: {},
      };

      Object.keys(parent).forEach((e) => {
        if (typeof parent[e] === "function") {
          // Methods must be handled separately from the rest of the setup
          passthrough.methods[e] = parent[e];
        } else {
          passthrough.$setup[e] = parent[e];
        }
      });

      Object.keys(parentComponents).forEach((e) => {
        if (typeof components[e] === "undefined") {
          passthrough.components[e] = parentComponents[e];
        }
      });

      const setupKeys = Object.keys(passthrough.$setup || {});
      const methodKeys = Object.keys(passthrough.methods || {});
      const templatePropKeys = Object.keys(this.templateProps);
      const allKeys = setupKeys.concat(methodKeys).concat(templatePropKeys);
      const methodsFromProps = buildFromProps(parent, methodKeys);
      const finalProps = merge([
        passthrough.$setup,
        methodsFromProps,
        this.templateProps,
      ]);

      const provide = this.$parent.$.provides ? this.$parent.$.provides : {}; // Avoids Vue warning

      const dynamic = {
        template: this.template || "<div></div>",
        props: allKeys,
        computed: passthrough.computed,
        components: passthrough.components,
        provide: provide,
      };
      // debugger;

      return h(dynamic, { ...finalProps });
    }
  },
};
