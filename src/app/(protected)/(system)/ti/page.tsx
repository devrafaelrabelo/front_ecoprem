"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  RefreshCw,
  Server,
  Database,
  Globe,
  Bell,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi,
  Monitor,
  Shield,
  Zap,
} from "lucide-react"
import { useBackendStatus } from "@/hooks/use-backend-status"
import { cn } from "@/lib/utils"

interface ServiceStatus {
  name: string
  status: "online" | "offline" | "warning" | "maintenance"
  uptime: number
  responseTime: number
  url: string
  lastCheck: Date
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
}

interface SystemStats {
  totalServices: number
  onlineServices: number
  warningServices: number
  offlineServices: number
  averageUptime: number
  averageResponseTime: number
  activeAlerts: number
}

export default function TIDashboard() {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
  })
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { status: backendStatus, isOnline: backendOnline } = useBackendStatus()

  // Simular dados dos serviços
  const initializeServices = () => {
    const mockServices: ServiceStatus[] = [
      {
        name: "ControlCenter",
        status: backendOnline ? "online" : "offline",
        uptime: Math.random() * 100,
        responseTime: Math.floor(Math.random() * 200) + 50,
        url: "http://localhost:3001/control",
        lastCheck: new Date(),
        icon: Settings,
        description: "Sistema de controle central",
      },
      {
        name: "Manager",
        status: Math.random() > 0.1 ? "online" : "warning",
        uptime: Math.random() * 100,
        responseTime: Math.floor(Math.random() * 300) + 100,
        url: "http://localhost:3002/manager",
        lastCheck: new Date(),
        icon: Server,
        description: "Gerenciador de aplicações",
      },
      {
        name: "Account",
        status: Math.random() > 0.05 ? "online" : "offline",
        uptime: Math.random() * 100,
        responseTime: Math.floor(Math.random() * 150) + 75,
        url: "http://localhost:3003/account",
        lastCheck: new Date(),
        icon: Globe,
        description: "Sistema de contas",
      },
      {
        name: "Notify",
        status: Math.random() > 0.15 ? "online" : "maintenance",
        uptime: Math.random() * 100,
        responseTime: Math.floor(Math.random() * 250) + 80,
        url: "http://localhost:3004/notify",
        lastCheck: new Date(),
        icon: Bell,
        description: "Sistema de notificações",
      },
      {
        name: "TISeleniumHub",
        status: Math.random() > 0.2 ? "online" : "warning",
        uptime: Math.random() * 100,
        responseTime: Math.floor(Math.random() * 400) + 200,
        url: "http://localhost:4444/selenium",
        lastCheck: new Date(),
        icon: Activity,
        description: "Hub de automação Selenium",
      },
      {
        name: "Banco de Dados",
        status: backendOnline ? "online" : "offline",
        uptime: Math.random() * 100,
        responseTime: Math.floor(Math.random() * 100) + 25,
        url: "postgresql://localhost:5432/main",
        lastCheck: new Date(),
        icon: Database,
        description: "Banco de dados principal",
      },
    ]
    setServices(mockServices)
  }

  // Simular métricas do sistema
  const updateSystemMetrics = () => {
    setSystemMetrics({
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100),
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setError(null)
    try {
      // Simular delay de atualização
      await new Promise((resolve) => setTimeout(resolve, 1000))
      initializeServices()
      updateSystemMetrics()
      setLastUpdate(new Date())
    } catch (err) {
      setError("Erro ao atualizar dados do dashboard")
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setTimeout(() => {
      initializeServices()
      updateSystemMetrics()
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        initializeServices()
        updateSystemMetrics()
        setLastUpdate(new Date())
      } catch (err) {
        setError("Erro ao carregar dados do dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Atualizar automaticamente a cada 30 segundos
    const interval = setInterval(() => {
      if (!isRefreshing) {
        initializeServices()
        updateSystemMetrics()
        setLastUpdate(new Date())
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [backendOnline])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500 text-white"
      case "offline":
        return "bg-red-500 text-white"
      case "warning":
        return "bg-yellow-500 text-black"
      case "maintenance":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "offline":
        return "Offline"
      case "warning":
        return "Atenção"
      case "maintenance":
        return "Manutenção"
      default:
        return "Desconhecido"
    }
  }

  const getMetricColor = (value: number) => {
    if (value >= 80) return "text-red-500"
    if (value >= 60) return "text-yellow-500"
    return "text-green-500"
  }

  const getMetricBgColor = (value: number) => {
    if (value >= 80) return "bg-red-500"
    if (value >= 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Calcular estatísticas
  const stats: SystemStats = {
    totalServices: services.length,
    onlineServices: services.filter((s) => s.status === "online").length,
    warningServices: services.filter((s) => s.status === "warning").length,
    offlineServices: services.filter((s) => s.status === "offline").length,
    averageUptime: services.reduce((acc, s) => acc + s.uptime, 0) / services.length || 0,
    averageResponseTime: services.reduce((acc, s) => acc + s.responseTime, 0) / services.length || 0,
    activeAlerts: services.filter((s) => s.status !== "online").length,
  }

  if (error) {
    return (
      <div className="w-full h-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Dashboard TI</h1>
              <p className="text-muted-foreground">Monitoramento de serviços e infraestrutura</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Sistema TI
          </Badge>
        </div>

        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar dashboard</h3>
            <p className="text-muted-foreground mb-4 text-center">{error}</p>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Dashboard TI</h1>
              <p className="text-muted-foreground">Monitoramento de serviços e infraestrutura</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Sistema TI
          </Badge>
        </div>

        {/* Loading das estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading dos serviços */}
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="w-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center py-8 w-full">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Carregando dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Header Padronizado */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Monitor className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Dashboard TI</h1>
            <p className="text-muted-foreground">Monitoramento de serviços e infraestrutura</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Sistema TI
          </Badge>
          <div className="text-sm text-muted-foreground">
            Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços Online</CardTitle>
            <Server className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.onlineServices}/{stats.totalServices}
            </div>
            <p className="text-xs text-muted-foreground">serviços ativos</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime Médio</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageUptime.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">disponibilidade geral</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.averageResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">latência média</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">requerem atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Status dos Serviços */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Status dos Serviços
            </CardTitle>
            <Badge variant="outline">{services.length} serviços</Badge>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <Card key={service.name} className="w-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base">{service.name}</CardTitle>
                      </div>
                      {getStatusIcon(service.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3 w-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className={getStatusColor(service.status)}>{getStatusText(service.status)}</Badge>
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm text-muted-foreground">Uptime</span>
                      <span className="text-sm font-medium">{service.uptime.toFixed(1)}%</span>
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm text-muted-foreground">Resposta</span>
                      <span className="text-sm font-medium">{service.responseTime}ms</span>
                    </div>

                    <div className="space-y-1 w-full">
                      <span className="text-xs text-muted-foreground">Endpoint</span>
                      <p className="text-xs font-mono bg-muted px-2 py-1 rounded truncate w-full">{service.url}</p>
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-muted-foreground">Última verificação</span>
                      <span className="text-xs">{service.lastCheck.toLocaleTimeString("pt-BR")}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Métricas do Sistema */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Recursos do Sistema
            </CardTitle>
            <Badge variant="outline">Tempo real</Badge>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">CPU</span>
                </div>
                <span className={cn("text-sm font-medium", getMetricColor(systemMetrics.cpu))}>
                  {systemMetrics.cpu}%
                </span>
              </div>
              <Progress value={systemMetrics.cpu} className="h-2 w-full" />
            </div>

            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Memória</span>
                </div>
                <span className={cn("text-sm font-medium", getMetricColor(systemMetrics.memory))}>
                  {systemMetrics.memory}%
                </span>
              </div>
              <Progress value={systemMetrics.memory} className="h-2 w-full" />
            </div>

            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Disco</span>
                </div>
                <span className={cn("text-sm font-medium", getMetricColor(systemMetrics.disk))}>
                  {systemMetrics.disk}%
                </span>
              </div>
              <Progress value={systemMetrics.disk} className="h-2 w-full" />
            </div>

            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Rede</span>
                </div>
                <span className={cn("text-sm font-medium", getMetricColor(systemMetrics.network))}>
                  {systemMetrics.network}%
                </span>
              </div>
              <Progress value={systemMetrics.network} className="h-2 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Notificações */}
      {stats.activeAlerts > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Alertas e Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <div className="space-y-3 w-full">
              {services
                .filter((service) => service.status !== "online")
                .map((service) => (
                  <Alert key={service.name} className="border-l-4 border-l-yellow-500 w-full">
                    <div className="flex items-center gap-3 w-full">
                      {getStatusIcon(service.status)}
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between w-full">
                          <p className="font-medium">{service.name}</p>
                          <Badge variant="outline" className={getStatusColor(service.status)}>
                            {getStatusText(service.status)}
                          </Badge>
                        </div>
                        <AlertDescription className="mt-1">
                          {service.status === "warning" && "Serviço com problemas de performance"}
                          {service.status === "offline" && "Serviço indisponível"}
                          {service.status === "maintenance" && "Serviço em manutenção programada"}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
