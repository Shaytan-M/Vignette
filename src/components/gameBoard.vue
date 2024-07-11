<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <v-text-field
                    type="number"
                    color="green"
                    v-model.number="sizeX"
                    label="Size X"
                    :rules="exampleRules"
                ></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field
                    type="number"
                    color="green"
                    v-model.number="sizeY"
                    label="Size Y"
                ></v-text-field>
            </v-col>
        </v-row>
    </v-container>
    <v-container class="d-flex justify-center align-center">
        <div>
            <v-row v-for="(row, y) in grid" :key="y">
                <v-col
                    cols="auto"
                    v-for="(cell, x) in row"
                    :key="x"
                    class="pa-0"
                    :class="'bg-' + cell.color"
                    @mouseover="toggleColor(x, y)"
                >
                    <div class="border-thin" style="height: 36px; width: 36px"></div>
                </v-col>
            </v-row>
        </div>
    </v-container>
    <!-- Контейнер для додавання блоку з картками -->
    <div class="cardsContainer" ref="cardsContainer"></div>
</template>
<script>
import { ref, watch, onMounted } from 'vue';
import { createCardsWrapper, fetchData, onChangeCountry } from '../vignette.lib.js';
export default {
    async mounted() {
        const cardsWrapper = createCardsWrapper();
        this.$refs.cardsContainer.appendChild(cardsWrapper);
        try {
            await fetchData();
        } catch (error) {
            console.error('Error:', error);
        }
    },
    setup() {
        const sizeX = ref(0);
        const sizeY = ref(0);
        const grid = ref([]);
        const exampleRules = ref([(v) => (v && v <= 35) || 'Max 35']);

        const createGrid = () => {
            grid.value = Array.from({ length: sizeY.value }, () =>
                Array.from({ length: sizeX.value > 35 ? 0 : sizeX.value }, () => ({
                    color: 'white',
                })),
            );
        };

        const toggleColor = (x, y) => {
            grid.value[y][x].color = grid.value[y][x].color === 'white' ? 'blue' : 'white';
        };

        watch([sizeX, sizeY], () => {
            createGrid();
        });

        onMounted(() => {
            createGrid();
        });

        return { sizeX, sizeY, grid, toggleColor, exampleRules };
    },
};
</script>
<style></style>
