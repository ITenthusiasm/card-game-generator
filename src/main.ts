import Vue from "vue";
import App from "@/App.vue";
import router from "./router";
import store from "./store";

/* Start code for Automatic Global Vue Component Registration */
const requireComponent = require.context(
  "./components",
  false,
  /Base[A-Z]\w+\.(vue)$/
);

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName);

  // Get name of component (assumes Pascal Case)
  const componentName = fileName
    .split("/")
    .pop()
    ?.replace(/\.vue$/, "") as string;

  // Register component globally
  Vue.component(componentName, componentConfig.default || componentConfig);
});
/* End code for Automatic Global Registration */

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
