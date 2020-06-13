<template>
  <div v-if="checkboxes" class="tags">
    <label class="checkbox" v-for="tag in datasource" :key="tag.tid">
      <input type="checkbox" value="tag.value" />
      {{localizedName(tag)}}
    </label>
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
      datasource: [],
      value: [],
      inputVisible: false,
      currentVal: ""
    };
  },

  async mounted() {
    if (this.checkboxes) {
      const result = await this.getTags(this.tagType);
      this.datasource = result.content;
      console.log(result.content);
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
    },
    localizedName(tag) {
      if (tag.i18n) {
        return tag.i18n[this.$i18n.locale] || tag.i18n.eng || tag.name;
      } else {
        return tag.name;
      }
    }
  },

  computed: {}
});
</script>

<style scoped lang="scss">
.checkbox {
  width: 250px;
}
</style>