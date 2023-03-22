import axiosInstance from '@/axios'
import { teamDetailsSchema, type Team } from '@/schemas'

export async function getAll() {
  const { data } = await axiosInstance.get<{ teams: Team[] }>('/teams')

  return data.teams
}

export async function create(team: Omit<Team, 'id'>) {
  try {
    await axiosInstance.post('/teams/create', team)
  } catch ({ response }) {
    throw response?.data?.message || ''
  }
}
export async function deleteTeam(teamId: Team['id']) {
  try {
    await axiosInstance.delete(`/teams/${teamId}`)
  } catch ({ response }) {
    throw response?.data?.message || ''
  }
}
export async function getDetails(teamId: string) {
  try {
    const { data } = await axiosInstance.get(`/teams/${teamId}`)

    const parsedData = teamDetailsSchema.parse(data)
    return parsedData
  } catch ({ response }) {
    throw response?.data?.message || ''
  }
}
