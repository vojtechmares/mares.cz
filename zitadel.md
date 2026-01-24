# Zitadel OIDC Client Credentials Setup Guide

## Overview

This guide explains how to set up Zitadel for OIDC Client Credentials authentication to use with the backoffice API session loader.

## Recommended Approach: Service User with Client Secret

For build-time authentication (Astro content loaders run at build time), **Client Credentials with a Service User** is the simplest and most appropriate approach.

### Why Client Credentials (not Private Key JWT)?

| Factor             | Client Credentials              | Private Key JWT                      |
| ------------------ | ------------------------------- | ------------------------------------ |
| **Complexity**     | Simple - just ID + secret       | Requires key management              |
| **Build-time use** | Ideal - secrets stored in CI/CD | Overkill for build-time              |
| **Security**       | Sufficient for server-to-server | Better for long-lived services       |
| **Rotation**       | Easy secret rotation            | Requires key rotation infrastructure |

**Recommendation:** Use Client Credentials for this use case. The authentication happens once per build in a controlled CI/CD environment, making the simpler approach appropriate.

## Step-by-Step Setup in Zitadel Console

### Step 1: Create a Service User

1. Log in to your Zitadel Console
2. Navigate to **Users** → **Service Users**
3. Click **"+ New"**
4. Fill in:
   - **Username**: `mares-cz-sessions-reader` (or similar descriptive name)
   - **Display Name**: `mares.cz Sessions Reader`
5. Click **"Create"**

### Step 2: Generate Client Credentials

1. Open the newly created service user
2. Click the **Actions menu** (⋮ or "...")
3. Select **"Generate Client Secret"**
4. **IMPORTANT**: Copy both values immediately:
   - **Client ID**: Format like `123456789012345678@your-project`
   - **Client Secret**: Format like `secret_xxxxxxxx...` (shown only once!)
5. Store these securely (password manager, secure notes)

### Step 3: Grant API Permissions (on your API side)

Your backoffice API (`api.mares-skoleni.cz`) needs to:

1. Accept tokens from your Zitadel instance
2. Validate the `sub` claim matches the service user ID
3. Grant appropriate permissions for reading sessions

This is configured on your API, not in Zitadel.

### Step 4: Configure Environment Variables

Add to your `.env` file (local) and CI/CD secrets:

```bash
SESSIONS_API_URL=https://api.mares-skoleni.cz
SESSIONS_OIDC_ISSUER=https://your-instance.zitadel.cloud
SESSIONS_OIDC_CLIENT_ID=123456789012345678@your-project
SESSIONS_OIDC_CLIENT_SECRET=secret_xxxxxxxxxxxxxxxxxxxxxxxx
# Optional: Required when API expects JWT token format with audience claim
SESSIONS_OIDC_AUDIENCE=urn:zitadel:iam:org:project:id:PROJECT_ID:aud
```

## Environment Variable Reference

| Variable                      | Description                              | Example                                         |
| ----------------------------- | ---------------------------------------- | ----------------------------------------------- |
| `SESSIONS_API_URL`            | Backoffice API base URL                  | `https://api.mares-skoleni.cz`                  |
| `SESSIONS_OIDC_ISSUER`        | Zitadel instance URL (no trailing slash) | `https://mares-skoleni.zitadel.cloud`           |
| `SESSIONS_OIDC_CLIENT_ID`     | Service user client ID                   | `123456789@project-name`                        |
| `SESSIONS_OIDC_CLIENT_SECRET` | Service user client secret               | `secret_xxx...`                                 |
| `SESSIONS_OIDC_AUDIENCE`      | (Optional) Audience scope for JWT token  | `urn:zitadel:iam:org:project:id:PROJECT_ID:aud` |

## Token Request Flow (for reference)

The implemented `BackofficeClient` performs these steps automatically:

1. **OIDC Discovery**: Fetches `{issuer}/.well-known/openid-configuration` to get token endpoint
2. **Token Request**: POST to token endpoint with:
   ```
   grant_type=client_credentials
   client_id=<CLIENT_ID>
   client_secret=<CLIENT_SECRET>
   scope=openid [AUDIENCE_SCOPE]
   ```
   Note: If `SESSIONS_OIDC_AUDIENCE` is set, it's appended to the scope (e.g., `openid urn:zitadel:iam:org:project:id:PROJECT_ID:aud`)
3. **API Call**: Uses returned `access_token` in `Authorization: Bearer <token>` header

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Use CI/CD secrets** - GitHub Actions, GitLab CI, etc. have secure secret storage
3. **Rotate periodically** - Regenerate client secret every 6-12 months
4. **Minimal scopes** - Only request `openid` scope (add more only if needed)
5. **Audit access** - Review service user activity in Zitadel logs

## Verification

After setup, test locally:

```bash
# Set environment variables
export SESSIONS_OIDC_ISSUER="https://your-instance.zitadel.cloud"
export SESSIONS_OIDC_CLIENT_ID="your-client-id"
export SESSIONS_OIDC_CLIENT_SECRET="your-client-secret"
# Optional: Set audience if API requires JWT token format
export SESSIONS_OIDC_AUDIENCE="urn:zitadel:iam:org:project:id:PROJECT_ID:aud"

# Run Astro sync to test the loader
pnpm astro sync
```

Expected output:

```
[session-loader] Fetching sessions from backoffice API...
[session-loader] Received X sessions
[session-loader] Loaded X sessions into content collection
```

## Sources

- [Zitadel Client Credentials Guide](https://zitadel.com/docs/guides/integrate/service-users/client-credentials)
- [Zitadel Service User Authentication](https://zitadel.com/docs/guides/integrate/service-users/authenticate-service-users)
- [Zitadel Recommended OIDC Flows](https://zitadel.com/docs/guides/integrate/login/oidc/oauth-recommended-flows)
