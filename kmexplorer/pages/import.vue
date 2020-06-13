<template>
    <div class="is-ancestor">
		<i18n path="kara.import.description" tag="div" class="description"></i18n>
		<div class="description">
			<i18n path="kara.import.attention" class="attention"></i18n>
			<i18n path="kara.import.check_in_progress"></i18n>
		</div>
		<div class="tile is-child is-4">
			<kara-edit :karaparam="karaparam"></kara-edit>
		</div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import KaraEdit from "../components/KaraEdit.vue";

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
			let data;
			if (params.id) {
				data = await $axios.get(`/api/karas/${params.id}`).catch(
					_err => error({ statusCode: 404, message: app.i18n.t('kara.notfound') }));
			}
            return { karaparam: data };
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
        transition: width 0.8s ;
    }
</style>