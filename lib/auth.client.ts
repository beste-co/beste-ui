/**
 * Public-build auth client.
 *
 * Accounts live on ui.beste.co, not here. The shape is kept so the components
 * that call `authClient.signOut()` compile and behave sensibly; there is simply
 * never a session to end.
 */

export const authClient: any = {
  signIn: {
    social: async () => ({ error: { message: "Accounts are not part of this build." } }),
    email: async () => ({ error: { message: "Accounts are not part of this build." } }),
  },
  signOut: async () => ({ data: null, error: null }),
  getSession: async () => ({ data: null, error: null }),
  emailOtp: {
    sendVerificationOtp: async () => ({
      error: { message: "Accounts are not part of this build." },
    }),
  },
};
