!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("vue")):"function"==typeof define&&define.amd?define(["vue"],e):t.vue3RuntimeTemplate=e(t.vue)}(this,function(t){var e=function(t,e,o){if(!e.hasOwnProperty(o)&&t[o]){var n=Object.getOwnPropertyDescriptor(t,o);Object.defineProperty(e,o,n)}},o=function(t,o,n){return o.forEach(function(o){return e(t,n,o)}),n};return{props:{template:String,setupData:Object,templateProps:{type:Object,default:function(){return{}}}},render:function(){if(this.template){var n=this.$parent,r=this.setupData||{},i=n.$data;void 0===i&&(i={});var a=n.$props;void 0===a&&(a={});var s=n.$options;void 0===s&&(s={});var p=s.components;void 0===p&&(p={});var c=s.computed;void 0===c&&(c={});var d=s.methods;void 0===d&&(d={});var u=this.$data;void 0===u&&(u={});var v=this.$props;void 0===v&&(v={});var f=this.$options;void 0===f&&(f={});var h=f.methods;void 0===h&&(h={});var m=f.computed;void 0===m&&(m={});var l=f.components;void 0===l&&(l={});var y={$data:{},$props:{},$options:{},components:{},computed:{},methods:{},setupData:{}};Object.keys(i).forEach(function(t){void 0===u[t]&&(y.$data[t]=i[t])}),Object.keys(a).forEach(function(t){void 0===v[t]&&(y.$props[t]=a[t])}),Object.keys(d).forEach(function(t){void 0===h[t]&&(y.methods[t]=d[t])}),Object.keys(c).forEach(function(t){void 0===m[t]&&(y.computed[t]=c[t])}),Object.keys(p).forEach(function(t){void 0===l[t]&&(y.components[t]=p[t])}),Object.keys(r).forEach(function(t){"function"==typeof r[t]?y.methods[t]=r[t]:y.setupData[t]=r[t]});var O=Object.keys(y.methods||{}),$=Object.keys(y.$data||{}),b=Object.keys(y.$props||{}),j=Object.keys(this.templateProps),k=Object.keys(y.setupData||{}),g=$.concat(b).concat(O).concat(j).concat(k),E=(x=g).filter(function(t,e){return x.indexOf(t)===e});E.length!==g.length&&console.warn("vue3-runtime-template:","Apparently there are duplicates in the component's model. This could result from using both the composition api and the options api, where properties with duplicate names are defined, as well as from passing props into setupData. We strongly recommend using either the composition api or the options api only, since otherwise you risk overriding some data.");var w=o(r,O,{});w=o(n,O,w);var D=(P={},[y.$data,y.$props,w,this.templateProps,y.setupData].forEach(function(t){t&&Object.getOwnPropertyNames(t).forEach(function(o){return e(t,P,o)})}),P);return t.h({template:this.template||"<div></div>",props:E,computed:y.computed,components:y.components,provide:this.$parent.$.provides?this.$parent.$.provides:{}},Object.assign({},D))}var P,x}}});
//# sourceMappingURL=vue3-runtime-template.umd.js.map
