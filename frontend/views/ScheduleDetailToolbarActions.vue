<template>
    <div>
        <v-dialog v-model="showDeleteDialog" max-width="300">
            <template v-slot:activator="dialog">
                <v-tooltip bottom>
                    <template v-slot:activator="tooltip">
                        <v-btn icon v-bind="Object.assign({}, dialog.attrs, tooltip.attrs)" v-on="Object.assign({}, dialog.on, tooltip.on)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                    <span>Delete</span>
                </v-tooltip>
            </template>
            <v-card>
                <v-card-title class="text-h5">Delete schedule?</v-card-title>
                <v-card-text>This action is irreversible.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="red" @click.stop="confirm">Delete</v-btn>
                    <v-btn text @click.stop="showDeleteDialog = false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<style lang="scss">
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class ScheduleDetailToolbarActions extends Vue {
    private showDeleteDialog = false;

    private confirm() {
        this.showDeleteDialog = false;
    }
}
</script>
