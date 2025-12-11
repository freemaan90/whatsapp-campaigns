export interface GoogleJwtClient {
  apiKey?: string;
  projectId?: string;
  quotaProjectId?: string;
  credentials?: {
    refresh_token?: string;
    expiry_date?: number;
  };
  eagerRefreshThresholdMillis?: number;
  forceRefreshOnFailure?: boolean;
  universeDomain?: string;
  redirectUri?: string;
  certificateCache?: Record<string, unknown>;
  certificateExpiry?: number | null;
  certificateCacheFormat?: 'PEM' | string;
  email?: string;
  keyFile?: string;
  key?: string;
  keyId?: string;
  defaultScopes?: string[];
  scopes?: string[];
  scope?: string;
  subject?: string;
  gtoken?: unknown;
  additionalClaims?: Record<string, unknown>;
  useJWTAccessWithScope?: boolean;
  defaultServicePath?: string;
  access?: unknown;
}