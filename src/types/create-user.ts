export interface CreateUserAddress {
  street: string
  number: string
  complement?: string
  city: string
  neighborhood: string
  state: string
  country: string
  postalCode: string
}

export interface CreateUserRequest {
  firstName: string
  lastName: string
  fullName: string
  socialName?: string
  username: string
  email: string
  cpf: string
  birthDate: string
  password: string
  interfaceTheme: string
  timezone: string
  preferredLanguage: string
  invitationStatus: string
  avatar?: string
  origin: string
  privacyPolicyVersion: string
  cookieConsentStatus: string
  managerId: string
  twoFactorEnabled: boolean
  lastKnownLocation: string
  accountSuspendedReason?: string
  emailVerified: boolean
  roleIds: string[]
  departmentIds: string[]
  groupIds: string[]
  functionIds: string[]
  positionId?: string
  statusId?: string
  personalPhoneNumbers: string[]
  address: CreateUserAddress
  requestedById?: string
}

export interface CreateUserResponse {
  id: string
  message: string
  success: boolean
}

export interface CpfValidationResponse {
  valid: boolean
  name?: string
  birthDate?: string
  message?: string
}

export interface AddressResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}
