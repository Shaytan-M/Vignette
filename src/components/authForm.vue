<script>
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const em = ref('');
        const password = ref('');
        const showErrors = ref(false);
        const router = useRouter();

        const rules = {
            em: { required, email },
            password: { required, minLength: minLength(6) },
        };
        const emailErrors = computed(() => {
            const errors = [];
            if (v$.value.em.required.$invalid) {
                errors.push('Email is required');
            }
            if (v$.value.em.email.$invalid) {
                errors.push('Invalid email format');
            }
            return errors;
        });

        const passwordErrors = computed(() => {
            const errors = [];
            if (!v$.value.password.$pending && v$.value.password.required.$invalid)
                errors.push('Password is required');
            if (!v$.value.password.$pending && v$.value.password.minLength.$invalid)
                errors.push('The password must contain at least 6 characters');
            return errors;
        });

        const v$ = useVuelidate(rules, { em, password });

        const login = () => {
            showErrors.value = true;
            v$.value.$touch();
            if (v$.value.$invalid) {
                return;
            }
            router.push('/game');
        };
        return {
            em,
            password,
            login,
            v$,
            emailErrors,
            passwordErrors,
            showErrors,
        };
    },
};
</script>
<template>
    <v-card
        class="mx-auto bg-transparent rounded-xl pa-5"
        title="Authorization"
        width="400"
        border="success sm"
    >
        <v-form @submit.prevent="login">
            <v-text-field
                v-model="em"
                label="Email"
                required
                color="green"
                :error-messages="showErrors ? emailErrors : []"
            ></v-text-field>
            <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :error-messages="showErrors ? passwordErrors : []"
                required
                color="green"
            ></v-text-field>
            <v-btn class="mt-2" block color="success" type="submit">Log In</v-btn>
        </v-form>
    </v-card>
</template>
<style lang="less"></style>
