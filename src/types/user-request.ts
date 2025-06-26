// src/types/user-request.ts

// Tipos para os dados do formulário no frontend
export interface UserFormData {
  nome: string
  cpf: string
  dt_nascimento: string
  telefone: string
  supervisor: string // Pode ser ID ou nome, dependendo da implementação
  lider: string // Pode ser ID ou nome, dependendo da implementação
  endereco: {
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }
}

// Tipos para o payload enviado à API de criação de solicitação
export interface CreateUserRequestPayload {
  cpf: string
  birthDate: string // Formato AAAA-MM-DD
  fullName: string
  phone: string // Somente números
  supervisorId: string | null // ID do supervisor
  leaderId: string | null // ID do líder
  cep: string // Somente números
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
}

// Tipo para os dados recebidos da API ao listar solicitações
export interface ApiListedUserRequest {
  id: string
  firstName: string
  lastName: string
  cpf: string
  status: string // Ex: "PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELED"
  requestedAt: string // Data e hora da solicitação (ISO string)
  // Adicione outros campos que a API possa retornar para a listagem, se houver
  // Ex: supervisorName?: string;
  // Ex: leaderName?: string;
}

// Tipo para os dados de solicitação mapeados para exibição na tabela
export interface MappedUserRequest {
  id: string
  fullName: string
  cpf: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELED" // Status mapeado para um enum de strings literais
  requestDate: string // Data e hora da solicitação (ISO string)
  originalData: ApiListedUserRequest // Manter os dados originais da API para detalhes
}
