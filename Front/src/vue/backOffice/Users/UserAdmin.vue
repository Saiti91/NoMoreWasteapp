<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/Axios.js';
import HeaderBackOffice from "@/components/HeaderBackOffice.vue";
import { useRouter } from 'vue-router';

const users = ref([]);
const router = useRouter();

const fetchUsers = async () => {
  try {
    const response = await axios.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const goToDetails = (userId) => {
  router.push({ name: 'UserDetails', params: { id: userId } });
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <HeaderBackOffice/>
  <div class="spacer"></div>
  <div class="ui container full-width no-center">
    <h1>Admin Users</h1>
    <table class="ui celled table full-width-table">
      <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.User_ID" @click="goToDetails(user.User_ID)" class="clickable-row">
        <td>{{ user.Name }}</td>
        <td>{{ user.Email }}</td>
        <td>{{ user.Phone }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.spacer {
  margin: 20px 0;
}
.ui.container.full-width {
  width: 100%;
  margin-top: 20px;
  padding: 0 20px;
}
.ui.celled.table.full-width-table {
  width: 100%;
}
.ui.celled.table tr.clickable-row {
  cursor: pointer;
}
.ui.celled.table tr.clickable-row:hover {
  background-color: #f1f1f1;
}
</style>
