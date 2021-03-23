import { h } from "vue";

const defineDescriptor = (src, dest, name) => {
  // eslint-disable-next-line no-prototype-builtins
  if (!dest.hasOwnProperty(name) && src[name]) {
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
  return extendDestObjFromProps(obj, props, res);
};

const extendDestObjFromProps = (obj, props, dest) => {
  props.forEach((prop) => defineDescriptor(obj, dest, prop));
  return dest;
};

const removeDuplicatesFromArray = (arr) => {
  return [...new Set(arr)];
};

/*
 * This fork has been made in order to make use of the plugin with the new composition api possible. Currently the original vue3-runtime-template plugin
 * only works with the options api. This fork therefore should be able to serve our needs of using both the composition api and the options api or even the mix of both.
 * Consider avoiding using the plugin with components built with the mix of both apis, however, since it might override some important model data.
 *
 * For the composition api you should pass an object of type { '[attribute-name]': attribute } to setupData props (apart from passing the template string to template props),
 * which must contain all properties of your component
 * that are referenced in the template you are going to compile with the plugin. This includes: data, computed values, and methods. Props do not need to be included in setupData.
 *
 * If you use the options API, you don't need to pass such an object to setupData. Only provide the template string to the props.
 */
export default {
  props: {
    template: String,
    setupData: Object,
    templateProps: {
      type: Object,
      default: () => ({}),
    },
  },
  render() {
    if (this.template) {
      const parent = this.$parent;
      const setupData = this.setupData || {};
      const {
        $data: parentData = {},
        $props: parentProps = {},
        $options: parentOptions = {},
      } = parent;
      const {
        components: parentComponents = {},
        computed: parentComputed = {},
        methods: parentMethods = {},
      } = parentOptions;
      const {
        $data = {},
        $props = {},
        $options: { methods = {}, computed = {}, components = {} } = {},
      } = this;
      const passthrough = {
        $data: {},
        $props: {},
        $options: {},
        components: {},
        computed: {},
        methods: {},
        setupData: {},
      };

      // build new objects by removing keys if already exists (e.g. created by mixins)
      Object.keys(parentData).forEach((e) => {
        if (typeof $data[e] === "undefined") {
          passthrough.$data[e] = parentData[e];
        }
      });
      Object.keys(parentProps).forEach((e) => {
        if (typeof $props[e] === "undefined") {
          passthrough.$props[e] = parentProps[e];
        }
      });
      Object.keys(parentMethods).forEach((e) => {
        if (typeof methods[e] === "undefined") {
          passthrough.methods[e] = parentMethods[e];
        }
      });
      Object.keys(parentComputed).forEach((e) => {
        if (typeof computed[e] === "undefined") {
          passthrough.computed[e] = parentComputed[e];
        }
      });
      Object.keys(parentComponents).forEach((e) => {
        if (typeof components[e] === "undefined") {
          passthrough.components[e] = parentComponents[e];
        }
      });

      Object.keys(setupData).forEach((e) => {
        if (typeof setupData[e] === "function") {
          // Methods must be handled separately from the rest of the setup
          passthrough.methods[e] = setupData[e];
        } else {
          passthrough.setupData[e] = setupData[e];
        }
      });

      const methodKeys = Object.keys(passthrough.methods || {});
      const dataKeys = Object.keys(passthrough.$data || {});
      const propKeys = Object.keys(passthrough.$props || {});
      const templatePropKeys = Object.keys(this.templateProps);
      const setupDataKeys = Object.keys(passthrough.setupData || {});
      let allKeys = dataKeys
        .concat(propKeys)
        .concat(methodKeys)
        .concat(templatePropKeys)
        .concat(setupDataKeys);

      const allKeysWithoutDuplicates = removeDuplicatesFromArray(allKeys);
      if (allKeysWithoutDuplicates.length !== allKeys.length) {
        console.warn(
          "vue3-runtime-template:",
          `Apparently there are duplicates in the component's model. This could result from using both the composition api and the options api, where properties with duplicate names are defined, as well as from passing props into setupData. We strongly recommend using either the composition api or the options api only, since otherwise you risk overriding some data.`
        );
      }

      let methodsFromProps = buildFromProps(setupData, methodKeys);
      methodsFromProps = extendDestObjFromProps(
        parent,
        methodKeys,
        methodsFromProps
      );

      const finalProps = merge([
        passthrough.$data,
        passthrough.$props,
        methodsFromProps,
        this.templateProps,
        passthrough.setupData,
      ]);

      const provide = this.$parent.$.provides ? this.$parent.$.provides : {}; // Avoids Vue warning

      const dynamic = {
        template: this.template || "<div></div>",
        props: allKeysWithoutDuplicates,
        computed: passthrough.computed,
        components: passthrough.components,
        provide: provide,
      };
      // debugger;

      return h(dynamic, { ...finalProps });
    }
  },
};
