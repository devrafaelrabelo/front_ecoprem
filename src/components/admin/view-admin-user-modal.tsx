"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  Mail,
  Key,
  User,
  Phone,
  Building,
  Briefcase,
  Calendar,
  LogIn,
  Globe,
  Palette,
  Users,
  FileText,
} from "lucide-react"
import type { AdminUser } from "@/types/admin-user"

interface ViewAdminUserModalProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewAdminUserModal({ user, open, onOpenChange }: ViewAdminUserModalProps) {
  if (!user) return null

  const getStatusBadge = (status: AdminUser["status"]) => {
    const statusMap = {
      active: { label: "Ativo", variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      inactive: { label: "Inativo", variant: "secondary" as const, icon: XCircle, color: "text-gray-600" },
      suspended: { label: "Suspenso", variant: "destructive" as const, icon: AlertTriangle, color: "text-red-600" },
      pending: { label: "Pendente", variant: "outline" as const, icon: Clock, color: "text-yellow-600" },
    }
    const config = statusMap[status]
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const getRoleBadge = (role: AdminUser["mainRole"]) => {
    const roleMap = {
      admin: { label: "Administrador", variant: "default" as const, color: "bg-red-100 text-red-800" },
      manager: { label: "Gerente", variant: "secondary" as const, color: "bg-blue-100 text-blue-800" },
      analyst: { label: "Analista", variant: "outline" as const, color: "bg-green-100 text-green-800" },
      user: { label: "Usuário", variant: "outline" as const, color: "bg-gray-100 text-gray-800" },
    }
    const config = roleMap[role]
    return (
      <Badge variant={config.variant} className={config.color}>
        <Shield className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getDepartmentLabel = (department: string) => {
    const departmentMap = {
      ti: "Tecnologia da Informação",
      rh: "Recursos Humanos",
      comercial: "Comercial",
      financeiro: "Financeiro",
      operacional: "Operacional",
    }
    return departmentMap[department as keyof typeof departmentMap] || department
  }

  const getLanguageLabel = (language: string) => {
    const languageMap = {
      "pt-BR": "Português (Brasil)",
      "en-US": "English (US)",
      "es-ES": "Español",
    }
    return languageMap[language as keyof typeof languageMap] || language
  }

  const getThemeLabel = (theme: string) => {
    const themeMap = {
      light: "Claro",
      dark: "Escuro",
      system: "Sistema",
    }
    return themeMap[theme as keyof typeof themeMap] || theme
  }

  const BooleanValue = ({
    value,
    trueLabel = "Sim",
    falseLabel = "Não",
  }: {
    value: boolean
    trueLabel?: string
    falseLabel?: string
  }) => {
    return (
      <div className="flex items-center gap-2">
        {value ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-600 font-medium">{trueLabel}</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-600">{falseLabel}</span>
          </>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
              <AvatarFallback>
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-bold">{user.fullName}</div>
              <div className="text-sm text-muted-foreground">{user.position}</div>
            </div>
          </DialogTitle>
          <DialogDescription>Informações detalhadas do usuário no sistema</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Nome Completo</div>
                  <div className="text-lg font-medium">{user.fullName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Username</div>
                  <div className="text-lg font-mono">{user.username}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    E-mail
                  </div>
                  <div className="text-lg">{user.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">CPF</div>
                  <div className="text-lg font-mono">{user.cpf}</div>
                </div>
              </div>
              {user.phone && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Telefone
                  </div>
                  <div className="text-lg font-mono">{user.phone}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Cargo</div>
                  <div className="text-lg font-medium">{user.position}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    Departamento Principal
                  </div>
                  <div className="text-lg">{getDepartmentLabel(user.mainDepartment)}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Papel Principal no Sistema</div>
                  <div className="mt-1">{getRoleBadge(user.mainRole)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="mt-1">{getStatusBadge(user.status)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status de Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Status de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Usuário Bloqueado</div>
                  <div className="mt-1">
                    <BooleanValue value={user.locked} trueLabel="Bloqueado" falseLabel="Desbloqueado" />
                  </div>
                  {user.locked && user.lockReason && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                      <div className="font-medium">Motivo do bloqueio:</div>
                      <div>{user.lockReason}</div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">E-mail Verificado</div>
                  <div className="mt-1">
                    <BooleanValue value={user.emailVerified} trueLabel="Verificado" falseLabel="Não Verificado" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Autenticação 2FA</div>
                  <div className="mt-1">
                    <BooleanValue value={user.twoFactorEnabled} trueLabel="Habilitado" falseLabel="Desabilitado" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Primeiro Login</div>
                  <div className="mt-1">
                    <BooleanValue value={user.firstLogin} trueLabel="Pendente" falseLabel="Concluído" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Senha Comprometida</div>
                  <div className="mt-1">
                    <BooleanValue value={user.passwordCompromised} trueLabel="Comprometida" falseLabel="Segura" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Última Alteração de Senha</div>
                  <div className="text-lg">
                    {user.passwordChangedAt
                      ? new Date(user.passwordChangedAt).toLocaleDateString("pt-BR")
                      : "Nunca alterada"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferências e Configurações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Preferências do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Idioma Preferido
                  </div>
                  <div className="text-lg">{getLanguageLabel(user.preferredLanguage)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    Tema da Interface
                  </div>
                  <div className="text-lg">{getThemeLabel(user.interfaceTheme)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atividade e Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Atividade no Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Data de Criação
                  </div>
                  <div className="text-lg">{new Date(user.createdAt).toLocaleDateString("pt-BR")}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleTimeString("pt-BR")}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Último Login</div>
                  <div className="text-lg">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("pt-BR") : "Nunca logou"}
                  </div>
                  {user.lastLogin && (
                    <div className="text-sm text-muted-foreground">
                      {new Date(user.lastLogin).toLocaleTimeString("pt-BR")}
                    </div>
                  )}
                </div>                
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Última Atualização</div>
                <div className="text-lg">{new Date(user.updatedAt).toLocaleDateString("pt-BR")}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(user.updatedAt).toLocaleTimeString("pt-BR")}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissões e Grupos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Permissões
                </CardTitle>
                <CardDescription>Permissões individuais do usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.permissions.length > 0 ? (
                    user.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {permission}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Nenhuma permissão individual</div>
                  )}
                </div>
              </CardContent>
            </Card> */}

            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Grupos
                </CardTitle>
                <CardDescription>Grupos aos quais o usuário pertence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.groups.length > 0 ? (
                    user.groups.map((group, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                        {group}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Não pertence a nenhum grupo</div>
                  )}
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Notas e Observações */}
          {user.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notas e Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <div className="text-sm whitespace-pre-wrap">{user.notes}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
