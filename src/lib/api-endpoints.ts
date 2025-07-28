// /lib/api-endpoints.ts
import { API_BASE, SELENIUM_BASE, USERHUB_BASE } from "@/config"

export const ApiEndpoints = {
  // 🌐 Backend (Spring Boot)
  backend: {

    // RESOURCES
    resourcesList: `${API_BASE}/resources`,
    resourcesId: `${API_BASE}/resources/`,
    resourcesCreate: `${API_BASE}/resources`,
    resourcesIdAlter: `${API_BASE}/resources/`,
    resourcesIdDelete: `${API_BASE}/resources/`,

    // RESOURCE HISTORY
    resourceHistoryList: `${API_BASE}/resource/history`,
    resourceHistoryId: `${API_BASE}/resource/history/`,

    // RESOURCE ALLOCATE
    resourceAllocateList: `${API_BASE}/resource/allocate`,
    resourceAllocateId: `${API_BASE}/resource/allocate/`,
    resourceAllocateBatch: `${API_BASE}/resource/allocate/batch`,

    // RESOURCE DEALLOCATE
    resourceDeallocateList: `${API_BASE}/resource/deallocate`,
    resourceDeallocateId: `${API_BASE}/resource/deallocate/`,

    // RESOURCE TYPES
    resourceTypesList: `${API_BASE}/resourcetype`,
    resourceTypesId: `${API_BASE}/resourcetype/`,
    resourceTypesCreate: `${API_BASE}/resourcetype`,
    resourceTypesIdAlter: `${API_BASE}/resourcetype/`,
    resourceTypesIdDelete: `${API_BASE}/resourcetype/`,

    // RESOURCE STATUS
    resourceStatusList: `${API_BASE}/resourcestatus`,
    resourceStatusId: `${API_BASE}/resourcestatus/`,
    resourceStatusCreate: `${API_BASE}/resourcestatus`,
    resourceStatusIdAlter: `${API_BASE}/resourcestatus/`, 
    resourceStatusIdDelete: `${API_BASE}/resourcestatus/`,

    // RESOURCE CORPORATE-PHONES
    resourceCorporatePhoneList: `${API_BASE}/resource/corporate-phones`,
    resourceCorporatePhoneId: `${API_BASE}/resource/corporate-phones/`,
    resourceCorporatePhoneCreate: `${API_BASE}/resource/corporate-phones`,
    resourceCorporatePhoneIdAlter: `${API_BASE}/resource/corporate-phones/`,
    resourceCorporatePhoneIdDelete: `${API_BASE}/resource/corporate-phones/`,

    // RESOURCE INTERNAL-EXTENSIONS
    resourceInternalExtensionList: `${API_BASE}/resource/internal-extensions`,
    resourceInternalExtensionId: `${API_BASE}/resource/internal-extensions/`,
    resourceInternalExtensionCreate: `${API_BASE}/resource/internal-extensions`,
    resourceInternalExtensionIdAlter: `${API_BASE}/resource/internal-extensions/`,
    resourceInternalExtensionIdDelete: `${API_BASE}/resource/internal-extensions/`,

    // WORKFORCE SUBTEAM
    workforceSubteamList: `${API_BASE}/workforce/subteam`,
    workforceSubteamId: `${API_BASE}/workforce/subteam/`,
    workforceSubteamCreate: `${API_BASE}/workforce/subteam`,
    workforceSubteamIdAlter: `${API_BASE}/workforce/subteam/`,
    workforceSubteamIdDelete: `${API_BASE}/workforce/subteam/`,

    // WORKFORCE TEAM
    workforceTeamList: `${API_BASE}/workforce/team`,
    workforceTeamId: `${API_BASE}/workforce/team/`,
    workforceTeamCreate: `${API_BASE}/workforce/team`,
    workforceTeamIdAlter: `${API_BASE}/workforce/team/`,
    workforceTeamIdDelete: `${API_BASE}/workforce/team/`,

    // USER
    // USER RESOURCES ALLOCATE
    userIdResources: `${API_BASE}/user/resources/`,
    UserIdResourceHistory: `${API_BASE}/user/resources/history/`,

    // USER REQUESTS
    userRequestsList: `${API_BASE}/user/request`,
    userRequestsId: `${API_BASE}/user/request/`,
    userRequestsCreate: `${API_BASE}/user/request`,
    userRequestsIdAlter: `${API_BASE}/user/request/`,
    userRequestsIdDelete: `${API_BASE}/user/request/`,
    userRequestsIdDeleteBatch: `${API_BASE}/user/request/batch`,


    // PROFILE
    userProfile: `${API_BASE}/user/profile`,
    userMe: `${API_BASE}/user/me`,
    userSystemTheme: `${API_BASE}/user/settings/theme`,    
    userPermissions: `${API_BASE}/user/permissions`,


    // AUTHENTICATION
    login: `${API_BASE}/auth/login`,
    logout: `${API_BASE}/auth/logout`,
    validateToken: `${API_BASE}/auth/session`,

    // validateToken: `${API_BASE}/auth/validate`,
    // refreshToken: `${API_BASE}/auth/refresh`,

    // AUTHENTICATION 2FA
    auth2fa: `${API_BASE}/auth/2fa`,
    auth2faEnable: `${API_BASE}/auth/2fa/enable`,
    auth2faDisable: `${API_BASE}/auth/2fa/disable`,
    auth2faVerify: `${API_BASE}/auth/2fa/verify`,
    auth2faRecoveryCodes: `${API_BASE}/auth/2fa/recovery-codes`,
    auth2faRecoveryCodesGenerate: `${API_BASE}/auth/2fa/recovery-codes/generate`,
    auth2faRecoveryCodesRegenerate: `${API_BASE}/auth/2fa/recovery-codes/regenerate`,
    auth2faRecoveryCodesVerify: `${API_BASE}/auth/2fa/recovery-codes/verify`,
    verify2fa: `${API_BASE}/auth/verify-2fa`,


    // HEALTH CHECK
    health: `${API_BASE}/health`,
    systemLogs: `${API_BASE}/admin/logs`,

    //  endpoints   



    adminUserRequest: `${API_BASE}/admin/users/request`,
    adminUserRequestId: `${API_BASE}/admin/users/request/`,
    adminUserRequestBatch: `${API_BASE}/admin/users/request/batch`,
    adminUserDetails: `${API_BASE}/admin/users`,
    adminPermissions: `${API_BASE}/admin/permissions`,


    // ADMIN
    // ADMIN USERS
    adminUsers: `${API_BASE}/admin/users`,
    adminUserId: `${API_BASE}/admin/users/`,
    adminUserBatch: `${API_BASE}/admin/users/batch`,
    adminUserRoles: `${API_BASE}/admin/users/roles`,
    adminUserRoleId: `${API_BASE}/admin/users/roles/`,

    // ADMIN ROLES
    adminRoles: `${API_BASE}/admin/roles`,
    adminRoleId: `${API_BASE}/admin/roles/`,
    adminRoleCreate: `${API_BASE}/admin/roles`,
    adminRoleIdAlter: `${API_BASE}/admin/roles/`,
    adminRoleIdDelete: `${API_BASE}/admin/roles/`,

    // ADMIN PERMISSIONS
    adminPermissionsList: `${API_BASE}/admin/permissions`,
    adminPermissionsId: `${API_BASE}/admin/permissions/`,
    adminPermissionsCreate: `${API_BASE}/admin/permissions`,
    adminPermissionsIdAlter: `${API_BASE}/admin/permissions/`,    
    adminPermissionsIdDelete: `${API_BASE}/admin/permissions/`,

    // ADMIN USERS 
    adminUsersList: `${API_BASE}/admin/users`,
    adminUsersId: `${API_BASE}/admin/users/`,
    adminUsersCreate: `${API_BASE}/admin/users`,
    adminUsersIdAlter: `${API_BASE}/admin/users/`,
    adminUsersIdDelete: `${API_BASE}/admin/users/`,

    // ADMIN USER CREATE FROM REQUEST
    adminUserCreateFromRequest: `${API_BASE}/admin/users/create-from-request/`,

    // ADMIN USER REQUESTS
    adminUserRequestsList: `${API_BASE}/admin/users/request`,
    adminUserRequestsId: `${API_BASE}/admin/users/request/`,
    adminUserRequestsCreate: `${API_BASE}/admin/users/request`,
    adminUserRequestsIdAlter: `${API_BASE}/admin/users/request/`,
    adminUserRequestsIdDelete: `${API_BASE}/admin/users/request/`,


    // ADMIN AUDIT SECURITY EVENTS
    adminAuditSecurityEvents: `${API_BASE}/admin/audits/security-events`,
    adminAuditSecurityEventsId: `${API_BASE}/admin/audits/security-events/`,
    
    // ADMIN AUDIT REQUEST EVENTS
    adminAuditRequestEvents: `${API_BASE}/admin/audits/request-events`,
    adminAuditRequestEventsId: `${API_BASE}/admin/audits/request-events/`,

    // ADMIN AUDIT SYSTEM EVENTS
    adminAuditSystemEvents: `${API_BASE}/admin/audits/system-events`,
    adminAuditSystemEventsId: `${API_BASE}/admin/audits/system-events/`,

    // ADMIN SESSION
    adminSessionCount: `${API_BASE}/admin/sessions/count`,
    adminSessionExpired: `${API_BASE}/admin/sessions/expired`,
    adminSessionActive: `${API_BASE}/admin/sessions/active`,
    adminSessionAudit: `${API_BASE}/admin/sessions/audit-log`,
    adminSessionListUserId: `${API_BASE}/admin/sessions/by-user/`,
    adminSessionRevokeId: `${API_BASE}/admin/sessions/revoke/`,
    adminSessionRevokeAllUserId: `${API_BASE}/admin/sessions/revoke-all/`,

  },

  // ⚙️ Selenium (FastAPI + Selenium)
  selenium: {
    health: `${SELENIUM_BASE}/health`,
    
    consultarcpf: `${SELENIUM_BASE}/cpf/consultarcpf`,    
    capturarPdf: `${SELENIUM_BASE}/pdf`,
  },

  // 👤 UserHub (FastAPI + Google Workspace)
  userhub: {
    health: `${USERHUB_BASE}/health`,

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
