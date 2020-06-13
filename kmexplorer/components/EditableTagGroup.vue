<template>
  <div>
    <div v-if="checkboxes" class="tags">
      <label class="checkbox" v-for="tag in datasource" :key="tag.tid">
        <input type="checkbox" value="tag.value" :checked="value.includes(tag.tid)" />
        {{localizedName(tag)}}
      </label>
    </div>
    <div v-if="!checkboxes" class="tags">
      <span class="tag" v-for="tag in value" :key="tag.tid">
        {{localizedName(tag)}}
        <button class="delete is-small"></button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { DBTag } from "../../src/lib/types/database/tag";

export default Vue.extend({
  name: "EditableTagGroup",

  props: {
    checkboxes: {
      type: Boolean
    },
    tagType: {
      type: Number,
      required: true
    },
    params: {
      type: Array
    }
  },

  data() {
    return {
      datasource: [],
      value: this.checkboxes
        ? this.params.map((tag: DBTag) => tag.tid)
        : this.params,
      inputVisible: false,
      currentVal: ""
    };
  },

  async mounted() {
    if (this.checkboxes) {
      const result = await this.getTags(this.tagType);
      this.datasource = result.content;
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