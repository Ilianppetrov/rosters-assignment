<script lang="ts" setup>
import { createPlayer, deletePlayer, updatePlayer } from '@/services/players'
import { getDetails } from '@/services/teams'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const queryClient = useQueryClient()

const teamId = route.params.teamId as string

const filter = ref('')

const newPlayerName = ref('')
const newPlayerIsInjured = ref(false)

const error = ref('')

const { data } = useQuery({
  queryKey: ['teams', teamId],
  queryFn: () => {
    return getDetails(teamId)
  },
  refetchOnWindowFocus: false,
  enabled: !!teamId
})

const filteredPlayers = computed(() => {
  return (data?.value?.players || []).filter(({ name }) => name.includes(filter.value))
})

const createMutation = useMutation(createPlayer, {
  onMutate() {
    newPlayerName.value = ''
    newPlayerIsInjured.value = false
  },
  onSuccess() {
    queryClient.invalidateQueries(['teams', teamId])
  },
  onError(_error: string) {
    error.value = _error
    setTimeout(() => {
      error.value = ''
    }, 3500)
  }
})

const onCreatePlayer = () => {
  createMutation.mutate({
    name: newPlayerName.value,
    isInjured: newPlayerIsInjured.value,
    teamId: Number(teamId)
  })
}

const deleteMutation = useMutation(deletePlayer, {
  onSuccess() {
    queryClient.invalidateQueries(['teams', teamId])
  }
})

const updateMutation = useMutation(updatePlayer, {
  onSuccess() {
    queryClient.invalidateQueries(['teams', teamId])
  }
})
</script>

<template>
  <div id="app" class="container">
    <div>
      <h1>{{ data?.team?.name }}</h1>
      <br />
      <div class="d-flex">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Search Player"
          v-model="filter"
        />
      </div>
      <br />
      <div v-if="!!error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Injured</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="player in filteredPlayers" :key="player.id">
            <td>{{ player.name }}</td>
            <td>
              <input
                @change="
                  (event) => {
                    updateMutation.mutate({
                      playerId: player.id,
                      payload: {
                        isInjured: (event.target as HTMLInputElement).checked
                      }
                    })
                  }
                "
                :checked="player.isInjured"
                type="checkbox"
              />
            </td>
            <td>
              <span @click="() => deleteMutation.mutate(player.id)" class="btn btn-link"
                >Delete</span
              >
            </td>
          </tr>

          <tr class="table-secondary">
            <td><input v-model="newPlayerName" type="text" /></td>
            <td><input v-model="newPlayerIsInjured" type="checkbox" /></td>
            <td>
              <button @click="onCreatePlayer" class="btn btn-link" :disabled="!newPlayerName">
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
