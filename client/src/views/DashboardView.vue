<script lang="ts" setup>
import type { Team } from '@/schemas'
import { getAll, create, deleteTeam } from '@/services/teams'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'

const queryClient = useQueryClient()

const newTeamName = ref('')
const error = ref('')

const { data } = useQuery({
  queryKey: ['teams'],
  queryFn: getAll,
  refetchOnWindowFocus: false
})

const createMutation = useMutation(create, {
  onMutate() {
    newTeamName.value = ''
  },
  onSuccess() {
    queryClient.invalidateQueries(['teams'])
  },
  onError(_error: string) {
    error.value = _error
    setTimeout(() => {
      error.value = ''
    }, 1500)
  }
})

const onCreateTeam = () => {
  createMutation.mutate({ name: newTeamName.value })
}

const deleteMutation = useMutation(deleteTeam, {
  onSuccess() {
    queryClient.invalidateQueries(['teams'])
  }
})

const onDeleteTeam = (teamId: Team['id']) => {
  deleteMutation.mutate(teamId)
}
</script>

<template>
  <div id="app" class="container">
    <div>
      <h1>Teams</h1>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Team Name</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <div v-if="!!error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>
        <tbody class="table-group-divider">
          <tr v-for="team in data" :key="team.name">
            <td>
              <router-link :to="{ name: 'details', params: { teamId: team.id } }" href="#">{{
                team.name
              }}</router-link>
            </td>
            <td>
              <span
                @click="
                  () => {
                    onDeleteTeam(team.id)
                  }
                "
                class="btn btn-link"
                >Delete</span
              >
            </td>
          </tr>

          <tr class="table-secondary">
            <td><input v-model="newTeamName" type="text" /></td>
            <td>
              <button @click="onCreateTeam" class="btn btn-link" :disabled="!newTeamName">
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
