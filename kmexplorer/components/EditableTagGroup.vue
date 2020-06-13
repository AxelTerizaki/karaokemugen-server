<template>
  <div v-if="this.checkboxes">
    <div v-for="tag in this.DS" :key="tag.tid">
      <Checkbox value="{tag.value}">{{tag.name}}</Checkbox>
      <label class="checkbox">
        <input type="checkbox" value="tag.value" />
        {{tag.text}}
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { tagTypes } from "../assets/constants";
import { Kara } from "../../src/lib/types/kara";

let timer: any[] = [];

export default Vue.extend({
  name: "EditableTagGroup",

  props: ["i18n", "checkboxes", "tagType"],

  data() {
    return {
      DS: [],
      value: [],
      inputVisible: false,
      currentVal: ""
    };
  },

  components: {},

  methods: {
    switchImage() {
      this.karaoke.title;
    }
  },

  computed: {
    karaoke(): Kara {
      return this.karaparam ? this.karaparam : {};
    }
  }
});
</script>

<style scoped lang="scss">
.tags {
  margin-top: 0.5rem;
  display: unset;
  .tag *:first-child {
    margin-right: 0.25rem;
  }
}
</style>