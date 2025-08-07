export interface AdminUser {
  id: string
  fullName: string
  username: string
  email: string
  position: string
  departments: string[]
  mainDepartment: string
  roles: string[]
  mainRole: "admin" | "manager" | "analyst" | "user"
  status: "active" | "inactive" | "suspended" | "pending"
  locked: boolean
  emailVerified: boolean
  twoFactorEnabled: boolean
  passwordCompromised: boolean
  avatar?: string
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface AdminUserFiltersType {
  nameOrEmail?: string
  status?: string
  role?: string
  department?: string
  position?: string
  locked?: boolean
  emailVerified?: boolean
  twoFactorEnabled?: boolean
  passwordCompromised?: boolean
  createdFrom?: string
  createdTo?: string
  lastLoginFrom?: string
  lastLoginTo?: string
  page?: number
  size?: number
  sort?: string
  direction?: "asc" | "desc"
}

export interface AdminUserPagination {
  currentPage: number
  totalPages: number
  totalElements: number
  size: number
  first: boolean
  last: boolean
}

// API response wrapper (e.g., from Spring Boot)
export interface SpringBootPageResponse<T> {
  content: T[]
  pageable: {
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    pageSize: number
    pageNumber: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}

// Raw user data from the API based on the new standard
export interface ApiAdminUser {
  id: string
  username: string
  fullName: string
  email: string
  roles: string[]
  departments: string[]
  position: string | null
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING"
  locked: boolean
  twoFactorEnabled: boolean
  emailVerified: boolean
  passwordCompromised: boolean
  createdAt: string
  lastLogin: string | null
}
