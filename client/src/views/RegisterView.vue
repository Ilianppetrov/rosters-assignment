<script lang="ts" setup>
import axiosInstance from '@/axios'
import { userRegisterSchema, type UserRegister } from '@/schemas'
import { validateBySchema } from '@/utils/validateBySchema'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { register } from '@/services/user'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const token = ref('')
const imageUrl = ref('')
const temp_uuid = ref('')

const errors = ref<Partial<UserRegister>>({})

const router = useRouter()

onMounted(() => {
  axiosInstance.get<{ temp_uuid: string; url: string }>('/2fa').then(({ data }) => {
    imageUrl.value = data.url
    temp_uuid.value = data.temp_uuid
  })
})

const { mutate, isError, error } = useMutation(
  () =>
    register({ email: email.value, password: password.value, token: token.value }, temp_uuid.value),
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
      confirmPassword: confirmPassword.value,
      token: token.value
    },
    userRegisterSchema
      .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords must match',
        path: ['confirmPassword']
      })
      .refine(
        (data) => {
          console.log(data)

          return String(data.token).length === 6
        },
        {
          message: 'Code must be 6 digits',
          path: ['token']
        }
      )
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
        <h5 class="card-header">Register New User</h5>
        <div class="card-body">
          <div v-if="isError" class="alert alert-danger" role="alert">{{ error }}</div>
          <div class="card-text">
            <form @submit.prevent="handleSubmit">
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
                  v-model="password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': !!errors.password }"
                  id="password"
                />
                <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': !!errors.confirmPassword }"
                  id="confirmPassword"
                />
                <div v-if="errors.confirmPassword" class="invalid-feedback">
                  {{ errors.confirmPassword }}
                </div>
              </div>
              <img :src="imageUrl" alt="qrCode" />
              <div class="mb-3">
                <label for="2faCode" class="form-label">2FA</label>
                <input
                  v-model="token"
                  class="form-control"
                  :class="{ 'is-invalid': !!errors.token }"
                  id="2faCode"
                />
                <div v-if="errors.token" class="invalid-feedback">
                  {{ errors.token }}
                </div>
              </div>
              <div class="d-grid gap-2 d-sm-flex justify-content-sm-end">
                <button @click="router.push('/login')" class="btn btn-danger" type="button">
                  Cancel
                </button>
                <button class="btn btn-primary me-md-2" type="submit">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
