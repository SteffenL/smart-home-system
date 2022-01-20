<template>
    <div v-if="schedule">
        <router-view></router-view>
        <v-bottom-navigation absolute horizontal>
            <v-btn :to="`/schedules/${schedule.id}`" replace>
                <span>General</span>
                <v-icon>mdi-calendar</v-icon>
            </v-btn>
            <v-btn :to="`/schedules/${schedule.id}/actions`" replace>
                <span>Actions</span>
                <v-icon>mdi-puzzle</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </div>
</template>

<style lang="scss">
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ApiClient } from "../src/api";

@Component
export default class ScheduleDetailRoot extends Vue {
    private schedule = null;

    private _api: ApiClient

    async created() {
        this._api = (this as any).$api as ApiClient;
        const id = (this as any).$route.params.id;
        this.schedule = await this._api.getSchedule(id);
    }
}
</script>
