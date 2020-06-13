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
      <editable-tag-group
        :tagType="1"
        :params="karaoke.series"
        v-on:change="(tags) => karaoke.series = tags"
      ></editable-tag-group>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <editable-tag-group
        v-bind:checkboxes="true"
        :tagType="3"
        :params="karaoke.songtypes"
        v-on:change="(tags) => karaoke.songtypes = tags"
      ></editable-tag-group>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input class="input" type="number" placeholder="Text input" v-model="karaoke.songorder" />
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <editable-tag-group
          :tagType="5"
          :params="karaoke.langs"
          v-on:change="(tags) => karaoke.langs = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input class="input" type="number" placeholder="Text input" v-model="karaoke.year" />
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <editable-tag-group
          :tagType="2"
          :params="karaoke.singers"
          v-on:change="(tags) => karaoke.singers = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <editable-tag-group
          :tagType="8"
          :params="karaoke.songwriters"
          v-on:change="(tags) => karaoke.songwriters = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <editable-tag-group
          :tagType="4"
          :params="karaoke.creators"
          v-on:change="(tags) => karaoke.creators = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <editable-tag-group
          :tagType="6"
          :params="karaoke.authors"
          v-on:change="(tags) => karaoke.authors = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <editable-tag-group
          v-bind:checkboxes="true"
          :tagType="10"
          :params="karaoke.families"
          v-on:change="(tags) => karaoke.families = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <editable-tag-group
          v-bind:checkboxes="true"
          :tagType="13"
          :params="karaoke.platforms"
          v-on:change="(tags) => karaoke.platforms = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <editable-tag-group
          v-bind:checkboxes="true"
          :tagType="12"
          :params="karaoke.genres"
          v-on:change="(tags) => karaoke.genres = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <editable-tag-group
          v-bind:checkboxes="true"
          :tagType="11"
          :params="karaoke.origins"
          v-on:change="(tags) => karaoke.origins = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <editable-tag-group
          v-bind:checkboxes="true"
          :tagType="7"
          :params="karaoke.misc"
          v-on:change="(tags) => karaoke.misc = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <editable-tag-group
          v-bind:checkboxes="true"
          :tagType="9"
          :params="karaoke.groups"
          v-on:change="(tags) => karaoke.groups = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label>{{karaoke.created_at ? new Date(karaoke.created_at).toLocaleString() : null}}</label>
    </div>
    <div class="field">
      <label>{{karaoke.modified_at ? new Date(karaoke.modified_at).toLocaleString() : null}}</label>
    </div>
    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <textarea class="textarea" placeholder="Text input" v-model="karaoke.comment" />
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button class="button is-link">Submit</button>
      </div>
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