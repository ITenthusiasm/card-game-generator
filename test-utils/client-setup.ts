// Pre-register all "base Vue components"
import Vue from "vue";
import BaseButton from "../src/components/_common/BaseButton.vue";
import BaseInput from "../src/components/_common/BaseInput.vue";
import BaseSelect from "../src/components/_common/BaseSelect.vue";

Vue.component("BaseButton", BaseButton);
Vue.component("BaseInput", BaseInput);
Vue.component("BaseSelect", BaseSelect);
