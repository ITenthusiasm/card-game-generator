import Vue from "vue";
import App from "../App.vue";
import router from "../router";
import store from "../store";

describe("App", () => {
  test("Successful Application Render", () => {
    const div = document.body.appendChild(document.createElement("div"));

    new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount(div);
  });
});
