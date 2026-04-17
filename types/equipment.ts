export interface Equipment {
  id: number
  name: string
  description: string
  category: string
  imageUrl?: string
  location?: string
  status: 'available' | 'in_use' | 'maintenance' | 'unavailable'
  specifications?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface EquipmentFilters {
  category?: string
  status?: string
  search?: string
}

export interface EquipmentFormData {
  name: string
  description: string
  category: string
  imageUrl?: string
  location?: string
  status: 'available' | 'in_use' | 'maintenance' | 'unavailable'
  specifications?: string
  notes?: string
}