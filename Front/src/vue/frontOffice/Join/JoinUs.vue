<script setup>
import axios from '@/utils/Axios.js';
import Header from "@/components/HeaderFrontOffice.vue";
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useAuth from '@/components/Auth/useAuth';  // Importation de useAuth

const { t } = useI18n();
const router = useRouter(); // Récupérer l'instance du routeur

const { isAuthenticated, userId } = useAuth();  // Utilisation de useAuth pour récupérer isAuthenticated et userId

// Fonction pour naviguer vers une autre page
const navigateTo = (routeName, params = {}) => {
  router.push({ name: routeName, params }); // Utilisation de paramètres dynamiques
};
</script>

<template>
  <div class="ui container full-width" style="min-height: 100vh; display: flex; flex-direction: column;">
    <Header/>
    <div class="spacer"></div>
    <div class="ui stackable grid" style="text-align: center;">
      <div class="sixteen wide column">
        <h1>{{ t('join_us') }}</h1>
      </div>
      <!-- Bloc de gauche -->
      <div v-if="isAuthenticated" class="eight wide column">
        <div class="ui segment">
          <h2>{{ t('update-account') }}</h2>
          <p>{{ t('update-txt') }}</p>
          <button class="ui primary button" @click="navigateTo('MyAccount', { id: userId })">{{ t('update') }}</button>
        </div>
      </div>
      <div v-if="!isAuthenticated" class="eight wide column">
        <div class="ui segment">
          <h2>{{ t('create-account') }}</h2>
          <p>{{ t('join-us-txt') }}</p>
          <button class="ui primary button" @click="navigateTo('SignUp')">{{ t('login') }}</button>
        </div>
      </div>
      <!-- Bloc de droite -->
      <div v-if="isAuthenticated" class="eight wide column">
        <div class="ui segment">
          <h2>{{ t('access-additional-services') }}</h2>
          <p>{{ t('additional-services-txt') }}</p>
          <button class="ui primary button" @click="navigateTo('PaymentCotisation')">{{ t('payment-cotisation') }}</button>
        </div>
      </div>
      <div v-if="!isAuthenticated" class="eight wide column">
        <div class="ui segment">
          <h2>{{ t('access-additional-services') }}</h2>
          <p>{{ t('additional-services-txt') }}</p>
          <button class="ui primary button" @click="navigateTo('Login')">{{ t('login') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.spacer {
  margin-top: 10%;
}

.ui.segment {
  margin: 20px 0;
}

button.ui.primary.button {
  margin-top: 10px;
}
</style>