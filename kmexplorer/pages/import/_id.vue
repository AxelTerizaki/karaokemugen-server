<template>
  <div class="is-ancestor">
    <i18n path="kara.import.description" tag="div" class="description"></i18n>
    <div class="description">
      <i18n path="kara.import.attention" class="attention"></i18n>
      <i18n path="kara.import.check_in_progress"></i18n>
    </div>
    <div class="description">
      <ul>
        <li>
          <a href="http://docs.karaokes.moe">{{$t('kara.import.documentation_link')}}</a>
        </li>
        <li>
          <a
            href="https://lab.shelter.moe/karaokemugen/bases/karaokebase/issues?label_name%5B%5D=en+cours"
          >{{$t('kara.import.in_progress_link')}}</a>
        </li>
      </ul>
    </div>
    <article class="message is-info">
      <div class="message-header">
        <p>{{$t('kara.import.license_reminder')}}</p>
      </div>
      <div class="message-body">
        <a
          href="https://lab.shelter.moe/karaokemugen/bases/karaokebase/-/blob/master/LICENSE.md"
        >{{$t('kara.import.license_link')}}</a>
        <p>{{$t('kara.import.license_info')}}</p>
      </div>
    </article>
    <div class="tile is-child is-5">
      <kara-edit :karaparam="karaparam"></kara-edit>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import KaraEdit from "../../components/KaraEdit.vue";

export default Vue.extend({
  name: "ImportKara",

  components: {
    KaraEdit
  },

  methods: {
    placeForLive() {
      this.liveOpened = true;
    }
  },

  async asyncData({ params, $axios, error, app }) {
    let result;
    if (params.id) {
      result = await $axios
        .get(`/api/karas/${params.id}`)
        .catch(_err =>
          error({ statusCode: 404, message: app.i18n.t("kara.notfound") })
        );
    }
    return { karaparam: result.data };
  }
});
</script>

<style scoped lang="scss">
.description {
  margin: 1em;
  font-size: medium;

  .attention {
    font-weight: bolder;
  }
}
.tile .is-child {
  transition: width 0.8s;
}

.is-info {
  max-width: 1000px;
}
</style>