<template>
  <div>
    <div class="field">
      <label class="label" :title="$t('kara.import.media_file_tooltip')">
        {{$t('kara.import.media_file')}}
        <font-awesome-icon :icon="['fas', 'question-circle']" :fixed-width="true" />
      </label>
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <input
            class="file-input"
            type="file"
            name="resume"
            ref="mediafile"
            accept="video/*, audio/*, .mkv"
            v-on:change="handleMediafileUpload()"
          />
          <span class="file-cta">
            <span class="file-icon">
              <font-awesome-icon :icon="['fas', 'upload']" :fixed-width="true" />
            </span>
            <span class="file-label">{{$t('kara.import.choose_file')}}</span>
          </span>
          <span class="file-name">{{mediafile}}</span>
        </label>
      </div>
      <p class="help is-danger" v-if="mediafile_error">{{mediafile_error}}</p>
    </div>
    <div class="field">
      <label class="label" :title="$t('kara.import.lyrics_file_tooltip')">
        {{$t('kara.import.lyrics_file')}}
        <font-awesome-icon :icon="['fas', 'question-circle']" :fixed-width="true" />
      </label>
      <div class="file has-name is-fullwidth">
        <label class="file-label">
          <input
            class="file-input"
            type="file"
            name="resume"
            ref="subfile"
            v-on:change="handleSubfileUpload()"
          />
          <span class="file-cta">
            <span class="file-icon">
              <font-awesome-icon :icon="['fas', 'upload']" :fixed-width="true" />
            </span>
            <span class="file-label">{{$t('kara.import.choose_file')}}</span>
          </span>
          <span class="file-name">{{subfile}}</span>
        </label>
      </div>
      <p class="help is-danger" v-if="subfile_error">{{subfile_error}}</p>
    </div>
    <div class="field">
      <label class="label" :title="$t('kara.import.title_tooltip')">
        {{$t('kara.import.title')}}
        <font-awesome-icon :icon="['fas', 'question-circle']" :fixed-width="true" />
      </label>
      <div class="control">
        <input
          :class="`input ${!karaoke.title && 'is-danger'}`"
          type="text"
          v-model="karaoke.title"
        />
      </div>
      <p class="help is-danger" v-if="!karaoke.title">{{$t('kara.import.title_required')}}</p>
    </div>
    <div class="field">
      <label class="label" :title="$t('kara.import.series_tooltip')">
        {{$tc('kara.tagtypes.series', karaoke.series.length)}}
        <font-awesome-icon :icon="['fas', 'question-circle']" :fixed-width="true" />
      </label>
      <editable-tag-group
        :tagType="1"
        :params="karaoke.series"
        v-on:change="(tags) => karaoke.series = tags"
      ></editable-tag-group>
      <p
        class="help is-danger"
        v-if="karaoke.series.length === 0 && karaoke.singers.length === 0"
      >{{$t('kara.import.series_singers_required')}}</p>
    </div>
    <div class="field">
      <label class="label">{{$tc('kara.tagtypes.songtypes', karaoke.songtypes.length)}}</label>
      <editable-tag-group
        v-bind:checkboxes="true"
        :tagType="3"
        :params="karaoke.songtypes"
        v-on:change="(tags) => karaoke.songtypes = tags"
      ></editable-tag-group>
      <p
        class="help is-danger"
        v-if="karaoke.songtypes.length === 0"
      >{{$t('kara.import.songtypes_required')}}</p>
    </div>
    <div class="field">
      <label class="label" :title="$t('kara.import.songorder_tooltip')">
        {{$t('kara.import.songorder')}}
        <font-awesome-icon :icon="['fas', 'question-circle']" :fixed-width="true" />
      </label>
      <div class="control">
        <input class="input" type="number" v-model="karaoke.songorder" />
      </div>
    </div>
    <div class="field">
      <label class="label">{{$tc('kara.tagtypes.langs', karaoke.langs.length)}}</label>
      <div class="control">
        <editable-tag-group
          :tagType="5"
          :params="karaoke.langs"
          v-on:change="(tags) => karaoke.langs = tags"
        ></editable-tag-group>
        <p
          class="help is-danger"
          v-if="karaoke.langs.length === 0"
        >{{$t('kara.import.langs_required')}}</p>
      </div>
    </div>
    <div class="field">
      <label class="label" :title="$t('kara.import.year_tooltip')">
        {{$t('kara.import.year')}}
        <font-awesome-icon :icon="['fas', 'question-circle']" :fixed-width="true" />
      </label>
      <div class="control">
        <input class="input" type="number" v-model="karaoke.year" />
        <p class="help is-danger" v-if="!karaoke.year">{{$t('kara.import.year_required')}}</p>
      </div>
    </div>
    <div class="field">
      <label class="label">{{$tc('kara.tagtypes.singers', karaoke.singers.length)}}</label>
      <div class="control">
        <editable-tag-group
          :tagType="2"
          :params="karaoke.singers"
          v-on:change="(tags) => karaoke.singers = tags"
        ></editable-tag-group>
        <p
          class="help is-danger"
          v-if="karaoke.series.length === 0 && karaoke.singers.length === 0"
        >{{$t('kara.import.series_singers_required')}}</p>
      </div>
    </div>
    <div class="field">
      <label class="label" :title="$t('kara.import.songwriters_tooltip')">
        {{$tc('kara.tagtypes.songwriters', karaoke.songwriters.length)}}
        <font-awesome-icon :icon="['fas', 'question-circle']" :fixed-width="true" />
      </label>
      <div class="control">
        <editable-tag-group
          :tagType="8"
          :params="karaoke.songwriters"
          v-on:change="(tags) => karaoke.songwriters = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label" :title="$t('kara.import.creators_tooltip')">
        {{$tc('kara.tagtypes.creators', karaoke.creators.length)}}
        <font-awesome-icon :icon="['fas', 'question-circle']" :fixed-width="true" />
      </label>
      <div class="control">
        <editable-tag-group
          :tagType="4"
          :params="karaoke.creators"
          v-on:change="(tags) => karaoke.creators = tags"
        ></editable-tag-group>
      </div>
    </div>
    <div class="field">
      <label class="label" :title="$t('kara.import.authors_tooltip')">
        {{$tc('kara.tagtypes.authors', karaoke.authors.length)}}
        <font-awesome-icon :icon="['fas', 'question-circle']" :fixed-width="true" />
      </label>
      <div class="control">
        <editable-tag-group
          :tagType="6"
          :params="karaoke.authors"
          v-on:change="(tags) => karaoke.authors = tags"
        ></editable-tag-group>
        <p
          class="help is-danger"
          v-if="karaoke.authors.length === 0"
        >{{$t('kara.import.authors_required')}}</p>
      </div>
    </div>
    <div class="field">
      <label class="label">{{$tc('kara.tagtypes.families', karaoke.families.length)}}</label>
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
      <label class="label">{{$tc('kara.tagtypes.platforms', karaoke.platforms.length)}}</label>
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
      <label class="label">{{$tc('kara.tagtypes.genres', karaoke.genres.length)}}</label>
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
      <label class="label">{{$tc('kara.tagtypes.origins', karaoke.origins.length)}}</label>
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
      <label class="label">{{$tc('kara.tagtypes.misc', karaoke.misc.length)}}</label>
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
      <label class="label" :title="$t('kara.import.groups_tooltip')">
        {{$tc('kara.tagtypes.groups', karaoke.groups.length)}}
        <font-awesome-icon :icon="['fas', 'question-circle']" :fixed-width="true" />
      </label>
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
      <label class="label">{{$t('kara.import.created_at')}}</label>
      <div class="control">
        <input
          class="input is-static"
          type="text"
          readonly
          :value="karaoke.created_at ? new Date(karaoke.created_at).toLocaleString() : null"
        />
      </div>
    </div>
    <div class="field">
      <label class="label">{{$t('kara.import.modified_at')}}</label>
      <div class="control">
        <input
          class="input is-static"
          type="text"
          readonly
          :value="karaoke.modified_at ? new Date(karaoke.modified_at).toLocaleString() : null"
        />
      </div>
    </div>
    <div class="field">
      <label class="label" :title="$t('kara.import.comment_tooltip')">
        {{$t('kara.import.comment')}}
        <font-awesome-icon :icon="['fas', 'question-circle']" :fixed-width="true" />
      </label>
      <div class="control">
        <label class="label">{{$t('kara.import.comment_edit')}}</label>
        <textarea class="textarea" v-model="karaoke.comment" />
      </div>
    </div>
    <div class="field">
      <div class="control submit">
        <button
          class="button is-link"
          :disabled="submitDisabled()"
          @click="submit"
        >{{$t('kara.import.submit')}}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { tagTypes } from "../assets/constants";
import EditableTagGroup from "./EditableTagGroup";

export default Vue.extend({
  props: ["karaparam", "i18n"],

  name: "KaraEdit",

  data() {
    return {
      tagTypes,
      activate: false,
      karaoke: this.karaparam ? this.karaparam : {},
      mediafile: this.karaparam?.mediafile,
      subfile: this.karaparam?.subfile,
      mediafile_error: "",
      subfile_error: ""
    };
  },

  components: { EditableTagGroup },

  methods: {
    async handleMediafileUpload() {
      let file = this.$refs.mediafile.files[0];
      this.mediafile_error = "";
      if (!this.isMediaFile(file.name)) {
        this.mediafile_error = this.$t("kara.import.add_file_media_error", {
          name: file.name
        });
      } else {
        this.mediafile = file.name;
        let formData = new FormData();
        formData.append("file", file);
        let result = await this.$axios.$post(
          `/api/karas/importfile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        this.karaoke.mediafile = result.filename;
        this.karaoke.mediafile_orig = result.originalname;
      }
    },
    async handleSubfileUpload() {
      let file = this.$refs.subfile.files[0];
      this.mediafile_error = "";
      if (!this.isSubFile(file.name)) {
        this.subfile_error = this.$t("kara.import.add_file_lyrics_error", {
          name: file.name
        });
      } else {
        this.subfile = file.name;
        let formData = new FormData();
        formData.append("file", file);
        let result = this.$axios.$post(`/api/karas/importfile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        this.karaoke.subfile = result.filename;
        this.karaoke.subfile_orig = result.originalname;
      }
    },
    isMediaFile(filename) {
      return new RegExp(
        "^.+\\.(avi|mkv|mp4|webm|mov|wmv|mpg|ogg|m4a|mp3)$"
      ).test(filename);
    },
    isSubFile(filename) {
      return new RegExp("^.+\\.(ass|txt|kfn|kar)$").test(filename);
    },
    submit() {
      if (this.karaoke.kid) {
        this.$axios.$put(`/api/karas/${this.karaoke.kid}`, this.karaoke);
      } else {
        this.$axios.$post("/api/karas/", this.karaoke);
      }
    },
    submitDisabled() {
      return (
        this.mediafile_error ||
        this.subfile_error ||
        !this.karaoke.title ||
        (this.karaoke.series.length === 0 &&
          this.karaoke.singers.length === 0) ||
        this.karaoke.songtypes.length === 0 ||
        this.karaoke.langs.length === 0 ||
        !this.karaoke.year ||
        this.karaoke.authors.length === 0
      );
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

.field {
  margin-bottom: 25px;
}

.submit {
  text-align: right;
}
</style>