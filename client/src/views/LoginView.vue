<script setup lang="ts">
import { userLoginSchema, type UserLogin } from '@/schemas'
import { login } from '@/services/user'
import { validateBySchema } from '@/utils/validateBySchema'
import { useMutation } from '@tanstack/vue-query'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const email = ref('')
const password = ref('')
const token = ref('')

const errors = ref<Partial<UserLogin>>({})

const router = useRouter()

const { mutate, isError, error } = useMutation(
  () => login({ email: email.value, password: password.value, token: token.value }),
  {
    onSuccess() {
      router.replace('/')
    },
    onError() {
      errors.value = {}
    }
  }
)

const handleSubmit = () => {
  const results = validateBySchema(
    {
      email: email.value,
      password: password.value,
      token: token.value
    },
    userLoginSchema.refine((data) => String(data.token).length === 6, {
      message: 'Code must be 6 digits',
      path: ['token']
    })
  )

  if (!results.success) {
    errors.value = results.errors
    return
  }

  mutate()
}
</script>

<template>
  <div id="app" class="container">
    <div class="container-sm" style="max-width: 400px">
      <div class="card">
        <h5 class="card-header">Login</h5>
        <div class="card-body">
          <div v-if="isError" class="alert alert-danger" role="alert">{{ error }}</div>
          <div class="card-text">
            <form>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': !!errors.email }"
                />
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  v-model="password"
                  class="form-control"
                  :class="{ 'is-invalid': !!errors.password }"
                />
                <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
              </div>
              <div class="mb-3">
                <label for="2faCode" class="form-label">2FA</label>
                <input
                  id="2faCode"
                  v-model="token"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': !!errors.token }"
                />
                <div v-if="errors.token" class="invalid-feedback">
                  {{ errors.token }}
                </div>
              </div>
              <div class="d-grid gap-2 d-sm-flex justify-content-sm-end">
                <button @click.prevent="handleSubmit" class="btn btn-primary me-md-2" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div><router-link to="/register">Register</router-link></div>
    </div>
  </div>
</template>
