export interface Resource {
  id: string
  name: string
  tag: string
  serialNumber?: string
  brand: string
  model?: string
  description?: string
  purchaseDate: string
  price: number
  availableForUse: boolean
  statusId: string
  resourceTypeId: string
  location?: string
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  status?: ResourceStatus
  resourceType?: ResourceType
}

export interface ResourceStatus {
  id: string
  name: string
  description?: string
  color?: string
}

export interface ResourceType {
  id: string
  name: string
  description?: string
  category?: string
}

export interface ResourceFilters {
  search?: string
  brand?: string
  statusId?: string
  resourceTypeId?: string
  availableForUse?: boolean
  purchaseDateFrom?: string
  purchaseDateTo?: string
  priceMin?: number
  priceMax?: number
}

export interface ResourceFormData {
  name: string
  tag: string
  serialNumber?: string
  brand: string
  model?: string
  description?: string
  purchaseDate: string
  price: number
  availableForUse: boolean
  statusId: string
  resourceTypeId: string
  location?: string
  notes?: string
}

export interface ResourceResponse {
  data: Resource[]
  total: number
  page: number
  limit: number
}
