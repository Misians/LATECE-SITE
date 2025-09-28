import { defineStore } from 'pinia'
import type { Equipment } from '@/types/equipment'

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipment: [] as Equipment[],
    currentEquipment: null as Equipment | null,
    categories: [] as string[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    hasEquipment: (state) => state.equipment.length > 0,
    availableEquipment: (state) => state.equipment.filter(e => e.status === 'available'),
    equipmentByCategory: (state) => (category: string) => 
      state.equipment.filter(e => e.category === category)
  },

  actions: {
    async fetchEquipment() {
      this.isLoading = true
      this.error = null
      
      try {
        const { $api } = useNuxtApp()
        const response = await $api('/equipment', { method: 'GET' })
        
        this.equipment = response.data
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Erro ao carregar equipamentos'
        console.error('Fetch equipment error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchEquipmentById(id: number) {
      this.isLoading = true
      this.error = null
      
      try {
        const { $api } = useNuxtApp()
        const response = await $api(`/equipment/${id}`, { method: 'GET' })
        
        this.currentEquipment = response.data
        return this.currentEquipment
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Equipamento não encontrado'
        console.error('Fetch equipment by ID error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchCategories() {
      try {
        const { $api } = useNuxtApp()
        const response = await $api('/equipment/categories', { method: 'GET' })
        
        this.categories = response.data
      } catch (error) {
        console.error('Fetch categories error:', error)
      }
    },

    async createEquipment(equipmentData: Partial<Equipment>) {
      try {
        const { $api } = useNuxtApp()
        const response = await $api('/equipment', {
          method: 'POST',
          body: equipmentData
        })
        
        this.equipment.push(response.data)
        return { success: true, data: response.data }
      } catch (error: any) {
        console.error('Create equipment error:', error)
        return { 
          success: false, 
          error: error.data?.error?.message || 'Erro ao criar equipamento' 
        }
      }
    },

    async updateEquipment(id: number, equipmentData: Partial<Equipment>) {
      try {
        const { $api } = useNuxtApp()
        const response = await $api(`/equipment/${id}`, {
          method: 'PUT',
          body: equipmentData
        })
        
        const index = this.equipment.findIndex(e => e.id === id)
        if (index !== -1) {
          this.equipment[index] = response.data
        }
        
        if (this.currentEquipment?.id === id) {
          this.currentEquipment = response.data
        }
        
        return { success: true, data: response.data }
      } catch (error: any) {
        console.error('Update equipment error:', error)
        return { 
          success: false, 
          error: error.data?.error?.message || 'Erro ao atualizar equipamento' 
        }
      }
    },

    async deleteEquipment(id: number) {
      try {
        const { $api } = useNuxtApp()
        await $api(`/equipment/${id}`, { method: 'DELETE' })
        
        this.equipment = this.equipment.filter(e => e.id !== id)
        
        if (this.currentEquipment?.id === id) {
          this.currentEquipment = null
        }
        
        return { success: true }
      } catch (error: any) {
        console.error('Delete equipment error:', error)
        return { 
          success: false, 
          error: error.data?.error?.message || 'Erro ao excluir equipamento' 
        }
      }
    },

    clearError() {
      this.error = null
    },

    reset() {
      this.equipment = []
      this.currentEquipment = null
      this.categories = []
      this.isLoading = false
      this.error = null
    }
  }
})