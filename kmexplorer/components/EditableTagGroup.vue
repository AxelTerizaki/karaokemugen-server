<template>
  <div v-if="this.checkboxes">
    <div v-for="tag in this.DS" :key="tag.tid">
      <Checkbox v-bind="this.DS.contains(tag.tid)">{{tag.name}}</Checkbox>
      <label class="checkbox">
        <input type="checkbox" value="tag.value" />
        {{tag.text}}
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Kara } from "../../src/lib/types/kara";

export default Vue.extend({
  name: "EditableTagGroup",

  props: ["checkboxes", "tagType"],

  data() {
    return {
      DS: [],
      value: [],
      inputVisible: false,
      currentVal: ""
    };
  },

  mounted: async () => {
      console.log(this.checkboxes)
      if (this.checkboxes) {
        this.DS = await this.getTags(this.tagType);
        console.log(this.DS)
      }
  },

  components: {},

  methods: {
    async getTags (type, filter) {
		if (filter === '') {
			return ({data: []});
		}
		return this.$axios.$get(`/api/karas/tags/${type}`, {
			params: {
				type: type,
				filter: filter
			}
		});
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