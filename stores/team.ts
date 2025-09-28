import { defineStore } from 'pinia'
import type { TeamMember } from '@/types/team'

export const useTeamStore = defineStore('team', {
  state: () => ({
    members: [] as TeamMember[],
    currentMember: null as TeamMember | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    hasMembers: (state) => state.members.length > 0,
    coordinators: (state) => state.members.filter(m => m.role === 'coordinator'),
    collaborators: (state) => state.members.filter(m => m.role !== 'coordinator'),
    membersByRole: (state) => (role: string) => 
      state.members.filter(m => m.role === role)
  },

  actions: {
    async fetchMembers() {
      this.isLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const responseData = await $api<TeamMember[]>('/team', { method: 'GET' })
        this.members = responseData
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Erro ao carregar membros da equipe'
        console.error('Fetch members error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchMemberById(id: number) {
      this.isLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const responseData = await $api<TeamMember>(`/team/${id}`, { method: 'GET' })
        this.currentMember = responseData
        return this.currentMember
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Membro da equipe não encontrado'
        console.error('Fetch member by ID error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createMember(memberData: Partial<TeamMember>) {
      try {
        const { $api } = useNuxtApp()
        const newMember = await $api<TeamMember>('/team', {
          method: 'POST',
          body: memberData
        })
        this.members.push(newMember)
        return { success: true, data: newMember }
      } catch (error: any) {
        console.error('Create member error:', error)
        return { 
          success: false, 
          error: error.data?.error?.message || 'Erro ao criar membro da equipe' 
        }
      }
    },

    async updateMember(id: number, memberData: Partial<TeamMember>) {
      try {
        const { $api } = useNuxtApp()
        const updatedMember = await $api<TeamMember>(`/team/${id}`, {
          method: 'PUT',
          body: memberData
        })
        
        const index = this.members.findIndex(m => m.id === id)
        if (index !== -1) {
          this.members[index] = updatedMember
        }
        if (this.currentMember?.id === id) {
          this.currentMember = updatedMember
        }
        
        return { success: true, data: updatedMember }
      } catch (error: any) {
        console.error('Update member error:', error)
        return { 
          success: false, 
          error: error.data?.error?.message || 'Erro ao atualizar membro da equipe' 
        }
      }
    },

    async deleteMember(id: number) {
      try {
        const { $api } = useNuxtApp()
        await $api(`/team/${id}`, { method: 'DELETE' })
        
        this.members = this.members.filter(m => m.id !== id)
        if (this.currentMember?.id === id) {
          this.currentMember = null
        }
        
        return { success: true }
      } catch (error: any) {
        console.error('Delete member error:', error)
        return { 
          success: false, 
          error: error.data?.error?.message || 'Erro ao excluir membro da equipe' 
        }
      }
    },

    clearError() {
      this.error = null
    },

    reset() {
      this.members = []
      this.currentMember = null
      this.isLoading = false
      this.error = null
    }
  }
})