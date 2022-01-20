<template>
    <v-container fluid>
        <v-text-field label="Username" v-model="username"></v-text-field>
        <v-text-field type="password" label="Password" v-model="password"></v-text-field>
        <v-btn color="primary" @click.stop="continueLogin">Continue</v-btn>
    </v-container>
</template>

<style lang="scss">
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class LocalLogin extends Vue {
    username: string = null
    password: string = null

    continueLogin() {
        this.$store.dispatch("localLogin", {
            username: this.username,
            password: this.password
        });
    }
}
</script>
