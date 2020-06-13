<template>
  <form>
    <div class="field">
      <label class="label">Name</label>
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <input class="file-input" type="file" name="resume" />
          <span class="file-cta">
            <span class="file-icon">
				<font-awesome-icon icon="upload" :fixed-width="true" />
            </span>
            <span class="file-label">Choose a file…</span>
          </span>
          <span class="file-name">{{karaoke.mediafile}}</span>
        </label>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <input class="file-input" type="file" name="resume" />
          <span class="file-cta">
            <span class="file-icon">
              <font-awesome-icon icon="upload" :fixed-width="true" />
            </span>
            <span class="file-label">Choose a file…</span>
          </span>
          <span class="file-name">{{karaoke.subfile}}</span>
        </label>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input class="input" type="text" placeholder="Text input" v-model="karaoke.title" />
      </div>
    </div>
	 <div class="field">
      <label class="label">Name</label>
      <editable-tag-group :tagType="1" :params="karaoke.series"
	  	v-on:change="(tags) => karaoke.series = tags"></editable-tag-group>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <editable-tag-group v-bind:checkboxes="true" :tagType="3" :params="karaoke.songtypes" 
	  	v-on:change="(tags) => karaoke.songtypes = tags"></editable-tag-group>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { tagTypes } from "../assets/constants";
import { Kara } from "../../src/lib/types/kara";
import EditableTagGroup from "./EditableTagGroup";

export default Vue.extend({
  props: ["karaparam", "i18n"],

  name: "KaraEdit",

  data() {
    return {
      tagTypes,
      activate: false
    };
  },

  components: { EditableTagGroup },

  methods: {},

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