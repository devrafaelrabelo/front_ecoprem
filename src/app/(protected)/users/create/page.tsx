"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { UserPlus, Save, ArrowLeft, User, Lock, Settings, Shield, Plus, Trash2 } from "lucide-react"

interface Permission {
  id: string
  departmentId: string
  userGroupId: string
  accessLevelId: string
}

interface CreateUserData {
  firstName: string
  lastName: string
  socialName: string
  username: string
  email: string
  password: string
  origin: string
  interfaceTheme: string
  timezone: string
  notificationsEnabled: boolean
  preferredLanguage: string
  roles: string[]
  permissions: Permission[]
}

const initialFormData: CreateUserData = {
  firstName: "",
  lastName: "",
  socialName: "",
  username: "",
  email: "",
  password: "",
  origin: "",
  interfaceTheme: "light",
  timezone: "America/Sao_Paulo",
  notificationsEnabled: true,
  preferredLanguage: "pt_BR",
  roles: [],
  permissions: [],
}

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "supervisor", label: "Supervisor" },
  { value: "gestor", label: "Gestor" },
  { value: "user", label: "User" },
]

const accessLevelOptions = [
  { value: "1", label: "Nível 1" },
  { value: "2", label: "Nível 2" },
  { value: "3", label: "Nível 3" },
]

const departmentOptions = [
  { value: "Comercial", label: "Comercial" },
  { value: "RH", label: "RH" },
  { value: "TI", label: "TI" },
]

const userGroupOptions = {
  Comercial: [
    { value: "consultor", label: "Consultor" },
    { value: "gestor", label: "Gestor" },
    { value: "supervisor", label: "Supervisor" },
  ],
  RH: [
    { value: "analista", label: "Analista" },
    { value: "gestor", label: "Gestor" },
    { value: "supervisor", label: "Supervisor" },
  ],
  TI: [
    { value: "analista", label: "Analista" },
    { value: "gestor", label: "Gestor" },
    { value: "supervisor", label: "Supervisor" },
  ],
}

const originOptions = [
  { value: "admin", label: "Admin" },
  { value: "gestor", label: "Gestor" },
  { value: "supervisor", label: "Supervisor" },
]

export default function CreateUserPage() {
  const [formData, setFormData] = useState<CreateUserData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [newPermission, setNewPermission] = useState<Omit<Permission, "id">>({
    departmentId: "",
    userGroupId: "",
    accessLevelId: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (field: keyof CreateUserData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Nova função com lógica específica para ADMIN + uma role
  const toggleRole = (role: string) => {
    setFormData((prev) => {
      const currentRoles = prev.roles
      const isAdmin = currentRoles.includes("admin")
      const hasRole = currentRoles.includes(role)

      if (hasRole) {
        // Se já tem a role, remove
        return {
          ...prev,
          roles: currentRoles.filter((r) => r !== role),
        }
      }

      if (role === "admin") {
        // Se está adicionando admin, pode adicionar
        return {
          ...prev,
          roles: [...currentRoles, role],
        }
      }

      if (isAdmin) {
        // Se já é admin, pode adicionar mais uma role (mas remove outras que não sejam admin)
        const nonAdminRoles = currentRoles.filter((r) => r !== "admin")
        if (nonAdminRoles.length > 0) {
          // Já tem uma role além de admin, substitui
          return {
            ...prev,
            roles: ["admin", role],
          }
        } else {
          // Não tem role além de admin, adiciona
          return {
            ...prev,
            roles: [...currentRoles, role],
          }
        }
      }

      if (currentRoles.length === 0) {
        // Não tem nenhuma role, pode adicionar
        return {
          ...prev,
          roles: [role],
        }
      }

      // Já tem uma role que não é admin, substitui
      return {
        ...prev,
        roles: [role],
      }
    })
  }

  const handleNewPermissionChange = (field: keyof Omit<Permission, "id">, value: string) => {
    setNewPermission((prev) => {
      const updated = { ...prev, [field]: value }

      // Limpar userGroupId quando departmentId muda
      if (field === "departmentId") {
        updated.userGroupId = ""
      }

      return updated
    })
  }

  const addPermission = () => {
    if (newPermission.departmentId && newPermission.userGroupId && newPermission.accessLevelId) {
      // Verificar se já existe uma permissão para este departamento
      const existingPermission = formData.permissions.find((p) => p.departmentId === newPermission.departmentId)

      if (existingPermission) {
        toast({
          title: "Departamento já adicionado",
          description: "Este departamento já possui uma permissão. Remova a existente primeiro.",
          variant: "destructive",
        })
        return
      }

      const permission: Permission = {
        id: Date.now().toString(),
        ...newPermission,
      }

      setFormData((prev) => ({
        ...prev,
        permissions: [...prev.permissions, permission],
      }))

      setNewPermission({
        departmentId: "",
        userGroupId: "",
        accessLevelId: "",
      })

      toast({
        title: "Permissão adicionada",
        description: `Permissão para ${newPermission.departmentId} foi adicionada.`,
        variant: "default",
      })
    }
  }

  const removePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.filter((p) => p.id !== permissionId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular criação de usuário
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Dados do usuário a serem enviados:", formData)

      toast({
        title: "Usuário criado com sucesso!",
        description: `${formData.firstName} ${formData.lastName} foi adicionado ao sistema.`,
        variant: "default",
      })

      // Resetar formulário
      setFormData(initialFormData)
      setNewPermission({
        departmentId: "",
        userGroupId: "",
        accessLevelId: "",
      })
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const currentUserGroupOptions = newPermission.departmentId
    ? userGroupOptions[newPermission.departmentId as keyof typeof userGroupOptions] || []
    : []

  const getDepartmentLabel = (departmentId: string) => {
    return departmentOptions.find((d) => d.value === departmentId)?.label || departmentId
  }

  const getUserGroupLabel = (departmentId: string, userGroupId: string) => {
    const groups = userGroupOptions[departmentId as keyof typeof userGroupOptions] || []
    return groups.find((g) => g.value === userGroupId)?.label || userGroupId
  }

  const getAccessLevelLabel = (accessLevelId: string) => {
    return accessLevelOptions.find((a) => a.value === accessLevelId)?.label || accessLevelId
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-2xl">Criar Novo Usuário</CardTitle>
                </div>
              </div>
              <Badge variant="outline">Sistema de Usuários</Badge>
            </div>
            <CardDescription>Preencha os dados para criar um novo usuário no sistema</CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Digite o nome"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Digite o sobrenome"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="socialName">Nome Social</Label>
                <Input
                  id="socialName"
                  value={formData.socialName}
                  onChange={(e) => handleInputChange("socialName", e.target.value)}
                  placeholder="Nome social (opcional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Credenciais de Acesso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Credenciais de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Digite o username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Digite o email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Digite a senha"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin">Origem</Label>
                <Select value={formData.origin} onValueChange={(value) => handleInputChange("origin", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {originOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredLanguage">Idioma Preferido</Label>
                  <Select
                    value={formData.preferredLanguage}
                    onValueChange={(value) => handleInputChange("preferredLanguage", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt_BR">Português (Brasil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interfaceTheme">Tema da Interface</Label>
                  <Select
                    value={formData.interfaceTheme}
                    onValueChange={(value) => handleInputChange("interfaceTheme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={formData.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações Habilitadas</Label>
                    <p className="text-sm text-muted-foreground">Receber notificações do sistema</p>
                  </div>
                  <Switch
                    checked={formData.notificationsEnabled}
                    onCheckedChange={(checked) => handleInputChange("notificationsEnabled", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roles (ADMIN + uma role OU apenas uma role) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles (Funções)
              </CardTitle>
              <CardDescription>
                Regra: Pode ser ADMIN + uma role, ou apenas uma role (nunca duas roles sem ser ADMIN)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {roleOptions.map((role) => (
                  <div
                    key={role.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.roles.includes(role.value)
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => toggleRole(role.value)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{role.label}</span>
                      {formData.roles.includes(role.value) && (
                        <Badge variant="secondary" className="text-xs">
                          ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="flex items-center gap-1">
                    {roleOptions.find((r) => r.value === role)?.label || role}
                  </Badge>
                ))}
              </div>
              {formData.roles.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma role selecionada</p>}
            </CardContent>
          </Card>

          {/* Permissões por Departamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissões por Departamento
              </CardTitle>
              <CardDescription>
                Adicione permissões específicas para cada departamento. O usuário pode ter acesso a múltiplos
                departamentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Adicionar Nova Permissão */}
              <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="h-4 w-4" />
                  <Label className="font-medium">Adicionar Nova Permissão</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Departamento</Label>
                    <Select
                      value={newPermission.departmentId}
                      onValueChange={(value) => handleNewPermissionChange("departmentId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions
                          .filter((dept) => !formData.permissions.some((p) => p.departmentId === dept.value))
                          .map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Grupo</Label>
                    <Select
                      value={newPermission.userGroupId}
                      onValueChange={(value) => handleNewPermissionChange("userGroupId", value)}
                      disabled={!newPermission.departmentId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentUserGroupOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Nível de Acesso</Label>
                    <Select
                      value={newPermission.accessLevelId}
                      onValueChange={(value) => handleNewPermissionChange("accessLevelId", value)}
                      disabled={!newPermission.departmentId || !newPermission.userGroupId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {accessLevelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={addPermission}
                      disabled={
                        !newPermission.departmentId || !newPermission.userGroupId || !newPermission.accessLevelId
                      }
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lista de Permissões Adicionadas */}
              {formData.permissions.length > 0 && (
                <div className="space-y-3">
                  <Label className="font-medium">Permissões Configuradas</Label>
                  <div className="space-y-2">
                    {formData.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{getDepartmentLabel(permission.departmentId)}</Badge>
                          <span className="text-sm">
                            <strong>Grupo:</strong> {getUserGroupLabel(permission.departmentId, permission.userGroupId)}
                          </span>
                          <span className="text-sm">
                            <strong>Nível:</strong> {getAccessLevelLabel(permission.accessLevelId)}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePermission(permission.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.permissions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma permissão adicionada ainda.</p>
                  <p className="text-sm">Adicione pelo menos uma permissão para o usuário.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Criar Usuário
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <Toaster />
      </div>
    </div>
  )
}
