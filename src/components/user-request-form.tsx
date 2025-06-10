"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, User, MapPin, Calendar, CreditCard } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface UserRequestData {
  nome: string
  cpf: string
  dt_nascimento: string
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

export function UserRequestForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingName, setIsLoadingName] = useState(false)
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [formData, setFormData] = useState<UserRequestData>({
    nome: "",
    cpf: "",
    dt_nascimento: "",
    endereco: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  })
  const [addressLoaded, setAddressLoaded] = useState(false)

  const fetchUserName = async (cpf: string, dtNascimento: string) => {
    if (!cpf || !dtNascimento || dtNascimento.length !== 10) return

    setIsLoadingName(true)
    try {
      // Simular chamada da API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Exemplo de resposta da API
      const mockResponse = {
        nome: "João Silva Santos",
      }

      setFormData((prev) => ({
        ...prev,
        nome: mockResponse.nome,
      }))

      toast({
        title: "Nome encontrado!",
        description: `Dados encontrados para CPF ${cpf} nascido em ${dtNascimento}`,
      })
    } catch (error) {
      toast({
        title: "Erro ao buscar dados",
        description: "Não foi possível encontrar o usuário com os dados informados.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingName(false)
    }
  }

  // Buscar CEP via API
  const fetchAddress = async (cep: string) => {
    if (cep.length !== 8) return

    setIsLoadingCep(true) // Iniciar loading
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            cep,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
            numero: prev.endereco.numero,
            complemento: prev.endereco.complemento,
          },
        }))
        setAddressLoaded(true)

        toast({
          title: "CEP encontrado!",
          description: `Endereço: ${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`,
        })
      } else {
        toast({
          title: "CEP não encontrado",
          description: "Verifique se o CEP está correto.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível consultar o CEP. Tente novamente.",
        variant: "destructive",
      })
      setAddressLoaded(false)
    } finally {
      setIsLoadingCep(false) // Finalizar loading
    }
  }

  useEffect(() => {
    if (formData.cpf.length === 11 && formData.dt_nascimento.length === 10) {
      fetchUserName(formData.cpf, formData.dt_nascimento)
    }
  }, [formData.cpf, formData.dt_nascimento])

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("endereco.")) {
      const addressField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [addressField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleCepChange = (value: string) => {
    const cleanCep = value.replace(/\D/g, "")
    handleInputChange("endereco.cep", cleanCep)

    if (cleanCep.length === 8) {
      fetchAddress(cleanCep)
    } else {
      setAddressLoaded(false)
      // Limpar apenas os campos que vêm da API, manter número e complemento
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cep: cleanCep,
          logradouro: "",
          bairro: "",
          cidade: "",
          estado: "",
          // Manter número e complemento
        },
      }))
    }
  }

  const handleCpfChange = (value: string) => {
    const cleanCpf = value.replace(/\D/g, "")
    handleInputChange("cpf", cleanCpf)
  }

  const handleDateChange = (value: string) => {
    // Remove tudo que não é número
    let cleanValue = value.replace(/\D/g, "")

    // Aplica a máscara DD/MM/AAAA
    if (cleanValue.length >= 2) {
      cleanValue = cleanValue.substring(0, 2) + "/" + cleanValue.substring(2)
    }
    if (cleanValue.length >= 5) {
      cleanValue = cleanValue.substring(0, 5) + "/" + cleanValue.substring(5, 9)
    }

    handleInputChange("dt_nascimento", cleanValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular envio
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Solicitação enviada!",
        description: "A solicitação de usuário foi enviada com sucesso.",
      })

      // Reset form
      setFormData({
        nome: "",
        cpf: "",
        dt_nascimento: "",
        endereco: {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
        },
      })
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar a solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Solicitação de Usuário
          </CardTitle>
          <CardDescription>Preencha os dados para solicitar a criação de um novo usuário no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-muted/40 rounded-lg p-6 border">
              {/* Cabeçalho da seção */}
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dados Pessoais
                </h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cpf" className="text-sm font-medium">
                      CPF *
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="cpf"
                        type="text"
                        value={formData.cpf}
                        onChange={(e) => handleCpfChange(e.target.value)}
                        maxLength={11}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dt_nascimento" className="text-sm font-medium">
                      Data de Nascimento *
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="dt_nascimento"
                        type="text"
                        value={formData.dt_nascimento}
                        onChange={(e) => handleDateChange(e.target.value)}
                        maxLength={10}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-sm font-medium">
                      Nome Completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="nome"
                        type="text"
                        value={formData.nome}
                        onChange={(e) => handleInputChange("nome", e.target.value)}
                        disabled={isLoadingName}
                        className="pl-10"
                      />
                      {isLoadingName && (
                        <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground -mt-4">
                  O nome será preenchido automaticamente após informar CPF e data de nascimento
                </p>
              </div>
            </div>

            {/* Linha conectora entre seções */}
            <div className="flex items-center justify-center py-4">
              <div className="flex-1 border-t border-dashed border-gray-300"></div>
            </div>

            {/* Endereço */}
            <div className="bg-muted/40 rounded-lg p-6 border relative">
              {/* Cabeçalho da seção */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </h3>
                </div>
                {isLoadingCep && (
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Buscando endereço...
                  </div>
                )}
              </div>

              {/* Overlay de loading */}
              {isLoadingCep && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Consultando CEP...</p>
                      <p className="text-xs text-muted-foreground">Aguarde enquanto buscamos o endereço</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cep" className="text-sm font-medium">
                      CEP *
                    </Label>
                    <Input
                      id="cep"
                      type="text"
                      value={formData.endereco.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      maxLength={8}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="space-y-2">
                      <Label htmlFor="logradouro" className="text-sm font-medium">
                        Logradouro * (Preenchido automaticamente)
                      </Label>
                      <Input
                        id="logradouro"
                        type="text"
                        value={formData.endereco.logradouro}
                        disabled={true}
                        className="bg-muted/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="numero" className="text-sm font-medium">
                      Número *
                    </Label>
                    <Input
                      id="numero"
                      type="text"
                      value={formData.endereco.numero}
                      onChange={(e) => handleInputChange("endereco.numero", e.target.value)}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="space-y-2">
                      <Label htmlFor="complemento" className="text-sm font-medium">
                        Complemento (Opcional)
                      </Label>
                      <Input
                        id="complemento"
                        type="text"
                        value={formData.endereco.complemento}
                        onChange={(e) => handleInputChange("endereco.complemento", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bairro" className="text-sm font-medium">
                      Bairro * (Preenchido automaticamente)
                    </Label>
                    <Input
                      id="bairro"
                      type="text"
                      value={formData.endereco.bairro}
                      disabled={true}
                      className="bg-muted/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cidade" className="text-sm font-medium">
                      Cidade * (Preenchido automaticamente)
                    </Label>
                    <Input
                      id="cidade"
                      type="text"
                      value={formData.endereco.cidade}
                      disabled={true}
                      className="bg-muted/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estado" className="text-sm font-medium">
                      Estado
                    </Label>
                    <Select
                      value={formData.endereco.estado}
                      onValueChange={(value) => handleInputChange("endereco.estado", value)}
                      disabled={true}
                    >
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Estado será preenchido automaticamente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Solicitação
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
