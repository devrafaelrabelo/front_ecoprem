"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { UserPlus, Save, RotateCcw, Plus, Trash2 } from "lucide-react"

interface Permission {
  id: string
  departmentId: string
  userGroupId: string
  accessLevelId: string
}

interface CreateUserData {
  firstName: string
  lastName: string
  fullName: string
  socialName: string
  username: string
  email: string
  emailVerified: boolean
  password: string
  origin: string
  interfaceTheme: string
  timezone: string
  notificationsEnabled: boolean
  loginAttempts: number
  firstLogin: boolean
  preferredLanguage: string
  passwordCompromised: boolean
  twoFactorEnabled: boolean
  roles: string[]
  permissions: Permission[]
}

const initialFormData: CreateUserData = {
  firstName: "",
  lastName: "",
  fullName: "",
  socialName: "",
  username: "",
  email: "",
  emailVerified: false,
  password: "",
  origin: "web",
  interfaceTheme: "light",
  timezone: "America/Sao_Paulo",
  notificationsEnabled: true,
  loginAttempts: 0,
  firstLogin: true,
  preferredLanguage: "pt_BR",
  passwordCompromised: false,
  twoFactorEnabled: false,
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

interface CreateUserFormProps {
  compact?: boolean
}

export function CreateUserForm({ compact = false }: CreateUserFormProps) {
  const [formData, setFormData] = useState<CreateUserData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [newPermission, setNewPermission] = useState<Omit<Permission, "id">>({
    departmentId: "",
    userGroupId: "",
    accessLevelId: "",
  })
  const { toast } = useToast()

  const handleInputChange = (field: keyof CreateUserData, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Auto-gerar fullName quando firstName ou lastName mudam
      if (field === "firstName" || field === "lastName") {
        const firstName = field === "firstName" ? value : prev.firstName
        const lastName = field === "lastName" ? value : prev.lastName
        newData.fullName = `${firstName} ${lastName}`.trim()
      }

      return newData
    })
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

      if (field === "departmentId") {
        updated.userGroupId = ""
      }

      return updated
    })
  }

  const addPermission = () => {
    if (newPermission.departmentId && newPermission.userGroupId && newPermission.accessLevelId) {
      const existingPermission = formData.permissions.find((p) => p.departmentId === newPermission.departmentId)

      if (existingPermission) {
        toast({
          title: "Departamento já adicionado",
          description: "Este departamento já possui uma permissão.",
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
    }
  }

  const removePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.filter((p) => p.id !== permissionId),
    }))
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setNewPermission({
      departmentId: "",
      userGroupId: "",
      accessLevelId: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Dados do usuário a serem enviados:", formData)

      toast({
        title: "Usuário criado com sucesso!",
        description: `${formData.firstName} ${formData.lastName} foi adicionado ao sistema.`,
        variant: "default",
      })

      resetForm()
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className={compact ? "text-lg" : "text-xl"}>Criar Usuário</CardTitle>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={resetForm}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
        <CardDescription>Sistema de permissões múltiplas por departamento</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Nome *</Label>
              <Input
                placeholder="Nome"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Sobrenome *</Label>
              <Input
                placeholder="Sobrenome"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Nome Completo</Label>
              <Input
                placeholder="Auto-gerado"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Nome Social</Label>
              <Input
                placeholder="Opcional"
                value={formData.socialName}
                onChange={(e) => handleInputChange("socialName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Username *</Label>
              <Input
                placeholder="Username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Email *</Label>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-xs">Senha *</Label>
              <Input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Configurações */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Configurações</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Idioma</Label>
                <Select
                  value={formData.preferredLanguage}
                  onValueChange={(value) => handleInputChange("preferredLanguage", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt_BR">Português (BR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tema</Label>
                <Select
                  value={formData.interfaceTheme}
                  onValueChange={(value) => handleInputChange("interfaceTheme", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Notificações</Label>
                <Switch
                  checked={formData.notificationsEnabled}
                  onCheckedChange={(checked) => handleInputChange("notificationsEnabled", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">2FA</Label>
                <Switch
                  checked={formData.twoFactorEnabled}
                  onCheckedChange={(checked) => handleInputChange("twoFactorEnabled", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Email Verificado</Label>
                <Switch
                  checked={formData.emailVerified}
                  onCheckedChange={(checked) => handleInputChange("emailVerified", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Primeiro Login</Label>
                <Switch
                  checked={formData.firstLogin}
                  onCheckedChange={(checked) => handleInputChange("firstLogin", checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Roles (ADMIN + uma role OU apenas uma role) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Roles (ADMIN + uma role OU apenas uma role)</Label>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((role) => (
                <div
                  key={role.value}
                  className={`p-2 border rounded cursor-pointer text-center text-xs transition-colors ${
                    formData.roles.includes(role.value)
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20"
                      : "bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800"
                  }`}
                  onClick={() => toggleRole(role.value)}
                >
                  {role.label} {formData.roles.includes(role.value) && "✓"}
                </div>
              ))}
            </div>
            {formData.roles.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs">
                    {roleOptions.find((r) => r.value === role)?.label || role}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Regra: Pode ser ADMIN + uma role, ou apenas uma role (nunca duas roles sem ser ADMIN)
            </p>
          </div>

          <Separator />

          {/* Permissões */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Permissões por Departamento</Label>

            {/* Adicionar Permissão */}
            <div className="p-3 border rounded bg-gray-50 dark:bg-gray-800/50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Select
                  value={newPermission.departmentId}
                  onValueChange={(value) => handleNewPermissionChange("departmentId", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Departamento" />
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

                <Select
                  value={newPermission.userGroupId}
                  onValueChange={(value) => handleNewPermissionChange("userGroupId", value)}
                  disabled={!newPermission.departmentId}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUserGroupOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={newPermission.accessLevelId}
                  onValueChange={(value) => handleNewPermissionChange("accessLevelId", value)}
                  disabled={!newPermission.departmentId || !newPermission.userGroupId}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  onClick={addPermission}
                  disabled={!newPermission.departmentId || !newPermission.userGroupId || !newPermission.accessLevelId}
                  size="sm"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Lista de Permissões */}
            <div className="space-y-2">
              {formData.permissions.map((permission) => (
                <div key={permission.id} className="flex items-center justify-between p-2 border rounded text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getDepartmentLabel(permission.departmentId)}
                    </Badge>
                    <span>{getUserGroupLabel(permission.departmentId, permission.userGroupId)}</span>
                    <span>({getAccessLevelLabel(permission.accessLevelId)})</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removePermission(permission.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {formData.permissions.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">Nenhuma permissão adicionada</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Criar
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
