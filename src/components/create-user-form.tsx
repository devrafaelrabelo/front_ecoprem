"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { SelectDepartment } from "./select-department"
import { SelectUserGroup } from "./select-user-group"
import { SelectAccessLevel } from "./select-access-level"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { UserPlus, Save, RotateCcw } from "lucide-react"

interface PermissionData {
  departmentId: string
  userGroupId: string
  accessLevelId: string
}

interface CreateUserFullData {
  firstName: string
  lastName: string
  socialName: string
  username: string
  email: string
  password?: string
  origin: string
  interfaceTheme: string
  timezone: string
  notificationsEnabled: boolean
  preferredLanguage: string
  roles: string[]
  permission: PermissionData
}

interface CreateUserFormProps {
  compact?: boolean
  initialData?: Partial<CreateUserFullData>
  onSuccess?: (createdUserData: CreateUserFullData) => void
  onCancel?: () => void
  isModal?: boolean
}

const initialFullFormData: CreateUserFullData = {
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
  permission: {
    departmentId: "",
    userGroupId: "",
    accessLevelId: "",
  },
}

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "supervisor", label: "Supervisor" },
  { value: "gestor", label: "Gestor" },
  { value: "user", label: "User" },
]

const originOptions = [
  { value: "admin", label: "Admin" },
  { value: "gestor", label: "Gestor" },
  { value: "supervisor", label: "Supervisor" },
]

export function CreateUserForm({
  compact = false,
  initialData = {},
  onSuccess,
  onCancel,
  isModal = false,
}: CreateUserFormProps) {
  const [formData, setFormData] = useState<CreateUserFullData>(() => ({
    ...initialFullFormData,
    ...initialData,
    permission: {
      ...initialFullFormData.permission,
      ...(initialData.permission || {}),
    },
  }))

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Memoize the initial data to prevent unnecessary re-renders
  const memoizedInitialData = React.useMemo(() => {
    return JSON.stringify(initialData)
  }, [initialData])

  // Update form data only when initialData actually changes
  useEffect(() => {
    const parsedInitialData = JSON.parse(memoizedInitialData)
    setFormData({
      ...initialFullFormData,
      ...parsedInitialData,
      permission: {
        ...initialFullFormData.permission,
        ...(parsedInitialData.permission || {}),
      },
    })
  }, [memoizedInitialData])

  const handleInputChange = useCallback((field: keyof Omit<CreateUserFullData, "permission" | "roles">, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handlePermissionChange = useCallback((field: keyof PermissionData, value: string) => {
    setFormData((prev) => {
      const newPermission = { ...prev.permission, [field]: value }
      // Reset userGroupId if department changes
      if (field === "departmentId") {
        newPermission.userGroupId = ""
      }
      return { ...prev, permission: newPermission }
    })
  }, [])

  const toggleRole = useCallback((roleValue: string) => {
    setFormData((prev) => {
      const currentRoles = prev.roles
      const isAdmin = currentRoles.includes("admin")
      const hasRole = currentRoles.includes(roleValue)

      if (hasRole) {
        return { ...prev, roles: currentRoles.filter((r) => r !== roleValue) }
      }
      if (roleValue === "admin") {
        return { ...prev, roles: [...currentRoles, roleValue] }
      }
      if (isAdmin) {
        const nonAdminRoles = currentRoles.filter((r) => r !== "admin")
        if (nonAdminRoles.length > 0) {
          return { ...prev, roles: ["admin", roleValue] }
        } else {
          return { ...prev, roles: [...currentRoles, roleValue] }
        }
      }
      if (currentRoles.length === 0) {
        return { ...prev, roles: [roleValue] }
      }
      return { ...prev, roles: [roleValue] }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const parsedInitialData = JSON.parse(memoizedInitialData)

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.username ||
      (!formData.password && !parsedInitialData.email)
    ) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos marcados com *.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!formData.permission.departmentId || !formData.permission.userGroupId || !formData.permission.accessLevelId) {
      toast({
        title: "Permissão Incompleta",
        description: "Selecione Departamento, Grupo e Nível de Acesso.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Dados do usuário a serem enviados:", formData)

      toast({
        title: parsedInitialData.email ? "Usuário Atualizado!" : "Usuário Criado!",
        description: `${formData.firstName} ${formData.lastName} foi ${parsedInitialData.email ? "atualizado" : "adicionado"} com sucesso.`,
      })

      if (onSuccess) {
        onSuccess(formData)
      } else {
        if (!isModal) {
          setFormData(initialFullFormData)
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocorreu um erro inesperado."
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = useCallback(() => {
    const parsedInitialData = JSON.parse(memoizedInitialData)
    setFormData({
      ...initialFullFormData,
      ...(parsedInitialData.email
        ? {
            ...parsedInitialData,
            permission: {
              ...initialFullFormData.permission,
              ...(parsedInitialData.permission || {}),
            },
          }
        : {}),
    })
    toast({ title: "Formulário Resetado", description: "Os campos foram limpos." })
  }, [memoizedInitialData, toast])

  const parsedInitialData = JSON.parse(memoizedInitialData)

  return (
    <Card className={compact ? "border-none shadow-none" : "w-full"}>
      {!compact && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>{parsedInitialData.email ? "Editar Usuário" : "Criar Novo Usuário"}</CardTitle>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleReset} disabled={isLoading}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          </div>
          <CardDescription>
            {parsedInitialData.email
              ? "Atualize os detalhes do usuário."
              : "Preencha os dados para criar um novo usuário."}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={compact ? "p-0" : ""}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nome *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Sobrenome *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="socialName">Nome Social</Label>
              <Input
                id="socialName"
                value={formData.socialName}
                onChange={(e) => handleInputChange("socialName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={!!parsedInitialData.email}
              />
            </div>
            {!parsedInitialData.email && (
              <div>
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>
            )}
            <div className="space-y-1">
              <Label className="text-xs">Origem</Label>
              <Select value={formData.origin} onValueChange={(value) => handleInputChange("origin", value)} required>
                <SelectTrigger className="h-10">
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
          </div>

          <Separator />
          <Label className="text-sm font-medium">Configurações da Conta</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interfaceTheme">Tema da Interface</Label>
              <Select value={formData.interfaceTheme} onValueChange={(v) => handleInputChange("interfaceTheme", v)}>
                <SelectTrigger id="interfaceTheme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="preferredLanguage">Idioma Preferido</Label>
              <Select
                value={formData.preferredLanguage}
                onValueChange={(v) => handleInputChange("preferredLanguage", v)}
              >
                <SelectTrigger id="preferredLanguage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt_BR">Português (BR)</SelectItem>
                  <SelectItem value="en_US">Inglês (US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select value={formData.timezone} onValueChange={(v) => handleInputChange("timezone", v)}>
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/New_York">Nova York (GMT-4/GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="notificationsEnabled"
                checked={formData.notificationsEnabled}
                onCheckedChange={(c) => handleInputChange("notificationsEnabled", c)}
              />
              <Label htmlFor="notificationsEnabled">Receber Notificações</Label>
            </div>
          </div>

          <Separator />
          <Label className="text-sm font-medium">Roles (Funções)</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {roleOptions.map((role) => (
              <Button
                key={role.value}
                type="button"
                variant={formData.roles.includes(role.value) ? "default" : "outline"}
                onClick={() => toggleRole(role.value)}
                className="w-full"
              >
                {role.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Regra: Pode ser ADMIN + uma role, ou apenas uma role.</p>

          <Separator />
          <Label className="text-sm font-medium">Permissão Principal</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectDepartment
              value={formData.permission.departmentId}
              onChange={(value) => handlePermissionChange("departmentId", value)}
            />
            <SelectUserGroup
              value={formData.permission.userGroupId}
              onChange={(value) => handlePermissionChange("userGroupId", value)}
              departmentId={formData.permission.departmentId}
            />
            <SelectAccessLevel
              value={formData.permission.accessLevelId}
              onChange={(value) => handlePermissionChange("accessLevelId", value)}
            />
          </div>

          <CardFooter className={`flex ${isModal ? "justify-end" : "justify-between"} pt-6 px-0`}>
            {isModal && onCancel && (
              <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
                Cancelar
              </Button>
            )}
            {!isModal && <div></div>}
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  {parsedInitialData.email ? "Salvando..." : "Criando..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {parsedInitialData.email ? "Salvar Alterações" : "Criar Usuário"}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
