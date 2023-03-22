import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return { isAuthenticated: false, token: '' }
  },
  actions: {
    login({ token }: { token: string }) {
      this.isAuthenticated = true
      this.token = token
    },
    logout() {
      this.isAuthenticated = false
      this.token = ''
    }
  }
})
