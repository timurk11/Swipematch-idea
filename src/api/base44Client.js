import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68894b2c896b7a4f1624d2c7", 
  requiresAuth: true // Ensure authentication is required for all operations
});
