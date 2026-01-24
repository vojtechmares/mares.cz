import type { APISession, OIDCConfig, SessionsListParams, SessionsListResponse } from "./types";

export class BackofficeClient {
  private baseUrl: string;
  private oidcConfig: OIDCConfig;
  private accessToken: string | null = null;

  constructor(baseUrl: string, oidcConfig: OIDCConfig) {
    this.baseUrl = baseUrl;
    this.oidcConfig = oidcConfig;
  }

  async getSessions(params: SessionsListParams = {}): Promise<APISession[]> {
    const token = await this.getAccessToken();

    const url = new URL("/v1/sessions", this.baseUrl);
    if (params.limit) url.searchParams.set("limit", String(params.limit));
    if (params.sort) url.searchParams.set("sort", params.sort);
    if (params.order) url.searchParams.set("order", params.order);
    if (params.status) {
      for (const s of params.status) {
        url.searchParams.append("status", s);
      }
    }
    if (params.training_id) {
      url.searchParams.set("training_id", String(params.training_id));
    }
    if (params.cursor) url.searchParams.set("cursor", params.cursor);
    if (params.include_deleted) url.searchParams.set("include_deleted", "true");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: SessionsListResponse = await response.json();
    return data.items;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const tokenEndpoint = await this.discoverTokenEndpoint();
    this.accessToken = await this.requestToken(tokenEndpoint);
    return this.accessToken;
  }

  private async discoverTokenEndpoint(): Promise<string> {
    const discoveryUrl = `${this.oidcConfig.issuer}/.well-known/openid-configuration`;
    const response = await fetch(discoveryUrl);

    if (!response.ok) {
      throw new Error(`OIDC discovery failed: ${response.status}`);
    }

    const config = await response.json();
    return config.token_endpoint;
  }

  private async requestToken(tokenEndpoint: string): Promise<string> {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.oidcConfig.clientId,
        client_secret: this.oidcConfig.clientSecret,
        scope: this.oidcConfig.audience ? `openid ${this.oidcConfig.audience}` : "openid",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token request failed: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.access_token;
  }
}
