<template>
  <div v-if="checkboxes">
    <div v-for="tag in DS" :key="tag.tid">
      <label class="checkbox">
        <input type="checkbox" value="tag.value" />
        {{tag.text}}
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "EditableTagGroup",

  props: {
    checkboxes: {
      type: Boolean
    },
    tagType: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      DS: [],
      value: [],
      inputVisible: false,
      currentVal: ""
    };
  },

  mounted: async () => {
    console.log(this.checkboxes);
    console.log(this.tagType);
    if (this.checkboxes) {
      this.DS = await this.getTags(this.tagType);
      console.log(this.DS);
    }
  },

  components: {},

  methods: {
    async getTags(type, filter) {
      if (filter === "") {
        return { data: [] };
      }
      return this.$axios.$get(`/api/karas/tags/${type}`, {
        params: {
          type: type,
          filter: filter
        }
      });
    }
  },

  computed: {}
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