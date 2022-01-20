<template>
    <v-container fluid>
        <p>Please confirm that you wish to log out.</p>
        <v-btn color="primary" @click.stop="continueLogout">Log out</v-btn>
    </v-container>
</template>

<style lang="scss">
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Logout extends Vue {
    continueLogout() {
        this.$store.dispatch("logout");
    }
}
</script>
