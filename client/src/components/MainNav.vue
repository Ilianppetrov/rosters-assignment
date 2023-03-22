<script lang="ts" setup>
import { useUserStore } from '../stores/user'
import { logout } from '@/services/user'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)
const router = useRouter()

const logoutuser = () => {
  logout()
  router.replace('/login')
}
</script>

<template>
  <nav
    class="navbar navbar-expand-lg sticky-top bg-body-tertiary"
    data-bs-theme="dark"
    style="margin-bottom: 1rem"
  >
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Team Rosters</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div v-if="isAuthenticated" class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/">Teams</router-link>
          </li>
        </ul>
        <div class="d-flex">
          <button @click="logoutuser" class="btn btn-link" type="submit">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>
