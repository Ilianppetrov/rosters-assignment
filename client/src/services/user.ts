import axiosInstance from '@/axios'
import type { UserLogin, UserRegister } from '@/schemas'
import { useUserStore } from '@/stores/user'

const storeToken = (token: string) => {
  // raise authentication flag in the local state
  const userStore = useUserStore()
  userStore.login({ token })

  // set default axios headers for future requests
  axiosInstance.defaults.headers.common['Authorization'] = token
}

export async function register(
  { email, password, token }: Omit<UserRegister, 'confirmPassword'>,
  temp_uuid: string
) {
  try {
    const { data } = await axiosInstance.post<{ token: string }>('/register', {
      email,
      password,
      token,
      tempUuid: temp_uuid
    })

    storeToken(data.token)

    return
  } catch ({ response }) {
    throw response?.data?.message || ''
  }
}

export async function login({ email, password, token }: UserLogin) {
  try {
    const { data } = await axiosInstance.post<{ token: string }>('/login', {
      email,
      password,
      token
    })

    storeToken(data.token)
  } catch ({ response }) {
    throw response?.data?.message || ''
  }
}

export async function logout() {
  const userStore = useUserStore()
  userStore.logout()

  // set default axios headers for future requests
  delete axiosInstance.defaults.headers.common['Authorization']
}
