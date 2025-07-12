// /lib/api-endpoints.ts
import { API_BASE, SELENIUM_BASE, USERHUB_BASE } from "@/config"

export const ApiEndpoints = {
  // 🌐 Backend (Spring Boot)
  backend: {
    health: `${API_BASE}/health`,
    login: `${API_BASE}/auth/login`,
    logout: `${API_BASE}/auth/logout`,
    // validateToken: `${API_BASE}/auth/validate`,
    // refreshToken: `${API_BASE}/auth/refresh`,
    myProfile: `${API_BASE}/user/me`,
    validateToken: `${API_BASE}/auth/session`,
    
    systemLogs: `${API_BASE}/admin/logs`,
    verify2fa: `${API_BASE}/auth/verify-2fa`,
    userMenu: `${API_BASE}/user/settings/theme`,
    userRequest: `${API_BASE}/user/request`,
    userRequestId: `${API_BASE}/user/request/`,
    userRequestBatch: `${API_BASE}/user/request/batch`,
    userPermissions: `${API_BASE}/user/permissions`,
    adminUserRequest: `${API_BASE}/admin/users/request`,
    adminUserRequestId: `${API_BASE}/admin/users/request/`,
    adminUserRequestBatch: `${API_BASE}/admin/users/request/batch`,
    adminUserDetails: `${API_BASE}/admin/users`,
    adminPermissions: `${API_BASE}/admin/permissions`,

    createUserFromRequest: `${API_BASE}/api/admin/users/create-from-request/`,
  },

  // ⚙️ Selenium (FastAPI + Selenium)
  selenium: {
    consultarcpf: `${SELENIUM_BASE}/cpf/consultarcpf`,
    status: `${SELENIUM_BASE}/status`,
    capturarPdf: `${SELENIUM_BASE}/pdf`,
  },

  // 👤 UserHub (FastAPI + Google Workspace)
  userhub: {
    verifyEmail: `${USERHUB_BASE}/email/exists/`,
    createEmail: `${USERHUB_BASE}/email/create`,
    resetEmailPassword: `${USERHUB_BASE}/email/reset-password`,
    deleteEmail: `${USERHUB_BASE}/email/delete`,
    listEmail: `${USERHUB_BASE}/users`,

    verifyUsername: `${USERHUB_BASE}/email/exists/`,
    createUsername: `${USERHUB_BASE}/email/create`,
    resetUsernamePassword: `${USERHUB_BASE}/email/reset-password`,
    deleteUsername: `${USERHUB_BASE}/email/delete`,
    listUsersname: `${USERHUB_BASE}/users`,
  },
}
