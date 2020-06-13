<template>
  <div>
    <div v-if="checkboxes" class="tags">
      <label class="checkbox" v-for="tag in data" :key="tag.tid">
        <input type="checkbox" value="tag.value" :checked="values.includes(tag.tid)" />
        {{localizedName(tag)}}
      </label>
    </div>
    <div v-if="!checkboxes">
      <div class="tags">
        <span class="tag" v-for="tag in values" :key="tag.tid">
          {{localizedName(tag)}}
          <button class="delete is-small" @click="() => deleteValue(tag)"></button>
        </span>
		<div class="button tag is-small" @click="inputVisible=true">Add</div>
      </div>
	  <div v-if="inputVisible">
      <b-autocomplete
        keep-first
        placeholder="e.g. Orange"
        v-model="currentVal"
        :data="data"
        :loading="isFetching"
        @typing="getAsyncData"
        :custom-formatter="localizedName"
        :clear-on-select="true"
        @select="addValue">
        <template slot="header">
            <a @click="newValue">
                <span> Add new... </span>
            </a> 
        </template>
      </b-autocomplete>
	  </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { DBTag } from "../../src/lib/types/database/tag";
import debounce from "lodash/debounce";

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
      data: [],
      values: this.checkboxes
        ? this.params.map((tag: DBTag) => tag.tid)
        : this.params,
      inputVisible: false,
      currentVal: "",
      isFetching: false
    };
  },

  async mounted() {
    if (this.checkboxes) {
      const result = await this.getTags(this.tagType);
      this.data = result.content;
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
    getAsyncData: debounce(function(val: string) {
      this.isFetching = true;
      this.getTags(this.tagType, val)
        .then(result => {
          this.data = this.sortByProp(result.content || [], "name");
        })
        .finally(() => {
          this.isFetching = false;
        });
    }, 500),
    localizedName(tag) {
      if (tag.i18n) {
        return tag.i18n[this.$i18n.locale] || tag.i18n.eng || tag.name;
      } else {
        return tag.name;
      }
    },
    sortByProp(array, val) {
      return array.sort((a, b) => {
        return a[val] > b[val] ? 1 : a[val] < b[val] ? -1 : 0;
      });
    },
    addValue(option) {
		this.inputVisible = false;
        if (option) {
            let values:DBTag[] = this.values;
            values.push(option);
            this.$emit('change', values);
        }
    },
    newValue() {
        this.addValue({name: this.currentVal});
    },
    deleteValue(option) {
        this.$emit('change', this.values.filter(tag => tag[1] !== option[1]));
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