// Pre-register all "base Vue components"
import Vue from "vue";
import BaseButton from "../src/components/BaseButton.vue";
import BaseInput from "../src/components/BaseInput.vue";
import BaseSelect from "../src/components/BaseSelect.vue";

Vue.component("BaseButton", BaseButton);
Vue.component("BaseInput", BaseInput);
Vue.component("BaseSelect", BaseSelect);
