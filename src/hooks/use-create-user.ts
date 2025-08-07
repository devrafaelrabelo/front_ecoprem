import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import type { CreateUserFormData } from '@/types/create-user'

interface CPFValidationResponse {
  valid: boolean
  data?: {
    name: string
    birthDate: string
    motherName?: string
    document: string
  }
}

interface AddressResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingCPF, setIsValidatingCPF] = useState(false)
  const [isFetchingAddress, setIsFetchingAddress] = useState(false)
  const [cpfValidated, setCpfValidated] = useState(false)
  const [addressFound, setAddressFound] = useState(false)
  const { toast } = useToast()

  const validateCPF = async (cpf: string): Promise<CPFValidationResponse | null> => {
    if (!cpf || cpf.length < 11) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido com 11 dígitos.",
        variant: "destructive",
      })
      return null
    }

    setIsValidatingCPF(true)
    
    try {
      // Simular chamada para API de validação de CPF
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simular resposta da API
      const mockResponse: CPFValidationResponse = {
        valid: true,
        data: {
          name: "João Silva Santos",
          birthDate: "1990-05-15",
          motherName: "Maria Silva Santos",
          document: cpf
        }
      }

      if (mockResponse.valid && mockResponse.data) {
        setCpfValidated(true)
        toast({
          title: "CPF validado com sucesso!",
          description: "Dados pessoais preenchidos automaticamente.",
          variant: "default",
        })
        return mockResponse
      } else {
        toast({
          title: "CPF não encontrado",
          description: "Não foi possível validar o CPF informado.",
          variant: "destructive",
        })
        return null
      }
    } catch (error) {
      toast({
        title: "Erro na validação",
        description: "Erro ao validar CPF. Tente novamente.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsValidatingCPF(false)
    }
  }

  const fetchAddressByCEP = async (cep: string): Promise<AddressResponse | null> => {
    if (!cep || cep.length < 8) {
      toast({
        title: "CEP inválido",
        description: "Por favor, insira um CEP válido com 8 dígitos.",
        variant: "destructive",
      })
      return null
    }

    setIsFetchingAddress(true)
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data: AddressResponse = await response.json()

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "O CEP informado não foi encontrado.",
          variant: "destructive",
        })
        return null
      }

      setAddressFound(true)
      toast({
        title: "Endereço encontrado!",
        description: "Dados do endereço preenchidos automaticamente.",
        variant: "default",
      })
      
      return data
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Erro ao buscar endereço. Tente novamente.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsFetchingAddress(false)
    }
  }

  const createUser = async (userData: CreateUserFormData) => {
    setIsLoading(true)
    
    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Usuário criado com sucesso!",
        description: `O usuário ${userData.firstName} ${userData.lastName} foi criado.`,
        variant: "default",
      })
      
      // Reset validation states
      setCpfValidated(false)
      setAddressFound(false)
      
      return { success: true, id: Date.now().toString() }
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao criar o usuário. Tente novamente.",
        variant: "destructive",
      })
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createUser,
    validateCPF,
    fetchAddressByCEP,
    isLoading,
    isValidatingCPF,
    isFetchingAddress,
    cpfValidated,
    addressFound,
  }
}
