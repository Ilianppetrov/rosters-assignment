import axiosInstance from '@/axios'
import { teamDetailsSchema, type Player, type Team } from '@/schemas'

export async function getAll() {
  const { data } = await axiosInstance.get<{ teams: Team[] }>('/teams')

  return data.teams
}

export async function createPlayer(player: Omit<Player, 'id'>) {
  try {
    await axiosInstance.post(`/players`, player)
  } catch ({ response }) {
    throw response?.data?.message || ''
  }
}
export async function deletePlayer(playerId: Player['id']) {
  try {
    await axiosInstance.delete(`/players/${playerId}`)
  } catch ({ response }) {
    throw response?.data?.message || ''
  }
}
export async function updatePlayer({
  payload,
  playerId
}: {
  playerId: Player['id']
  payload: {
    isInjured: boolean
  }
}) {
  try {
    const { data } = await axiosInstance.patch(`/players/${playerId}`, payload)

    const parsedData = teamDetailsSchema.parse(data)
    return parsedData
  } catch ({ response }) {
    throw response?.data?.message || ''
  }
}
