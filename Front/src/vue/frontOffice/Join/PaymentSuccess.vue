<script setup>
import Header from "@/components/HeaderFrontOffice.vue";
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosInstance from "@/utils/Axios.js";
import Cookies from 'js-cookie';
import jwtDecode from 'vue-jwt-decode';

const router = useRouter();

const saveReservation = async () => {
  const reservationDetails = JSON.parse(localStorage.getItem('reservationDetails'));

  if (!reservationDetails) {
    console.error('Aucune donnée de réservation trouvée dans le localStorage.');
    return;
  }

  // Ensure correct data types
  reservationDetails.services = reservationDetails.services || [];

  // Retrieve token from cookies
  const token = Cookies.get('token');

  if (!token) {
    console.error('Token non trouvé dans les cookies.');
    return;
  }

  // Decode the token to get user information
  const decodedToken = jwtDecode.decode(token);

  if (!decodedToken) {
    console.error('Impossible de décoder le token.');
    return;
  }

  // Format dates to ISO 8601
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const dataToSend = {
    customer: parseInt(decodedToken.uid, 10),
    date_start: formatDate(reservationDetails.startDate),
    date_end: formatDate(reservationDetails.endDate),
    services: reservationDetails.services.map(service => ({
      serviceType_id: service.serviceType_id,
      serviceProvider_id: service.servicesproviders_id // Corrected field name
    })),
    totalPrice: parseFloat(reservationDetails.totalPrice),
    apartment_id: parseInt(reservationDetails.apartment_id, 10)
  };

  console.log('dataToSend:', dataToSend);

  try {
    const response = await axiosInstance.post('/reservations', dataToSend);
    console.log('Réponse du serveur:', response.data);
    localStorage.removeItem('reservationDetails');
  } catch (error) {
    if (error.response) {
      console.error('Erreur lors de l\'enregistrement de la réservation:', error.response.data);
    } else if (error.request) {
      console.error('Aucune réponse reçue pour la requête:', error.request);
    } else {
      console.error('Erreur lors de la configuration de la requête:', error.message);
    }
  }
};

const goHome = () => {
  router.push('/');
};

onMounted(() => {
  saveReservation();
});
</script>

<template>
  <div class="payment-success ui container">
    <Header/>
    <div class="spacer"></div>
    <div class="ui segment">
      <h1 class="ui header">Paiement Réussi</h1>
      <p>Votre paiement a été effectué avec succès.</p>
      <button class="ui primary button" @click="goHome">Retour à l'accueil</button>
    </div>

  </div>
</template>

<style scoped>
.spacer {
  margin-top: 7%;
}
.payment-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
}

.ui.segment {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

button.ui.primary.button {
  margin-top: 20px;
}

h1.ui.header {
  color: #4CAF50;
}
</style>
