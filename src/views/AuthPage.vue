<script setup>
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import authFormVue from '../components/authForm.vue';
</script>
<template>
    <v-container class="d-flex justify-center align-center fill-height">
        <authFormVue />
    </v-container>
</template>
<style lang="less"></style>
