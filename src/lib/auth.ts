// Mock authentication - replace with NextAuth.js or similar in production
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CREATOR' | 'MARKETER';
  avatarUrl?: string;
}

// Mock current user - in production, this would come from your auth provider
export const getCurrentUser = (): User => {
  return {
    id: 'user_1',
    name: 'Content Creator',
    email: 'creator@tusitala.com',
    role: 'CREATOR',
    avatarUrl: undefined,
  };
};

// Mock authentication check
export const isAuthenticated = (): boolean => {
  return true; // Always authenticated for demo
};

// Mock sign out
export const signOut = async (): Promise<void> => {
  console.log('Signing out...');
  // In production, clear auth tokens, redirect to login, etc.
};

// Mock sign in
export const signIn = async (email: string, password: string): Promise<User> => {
  console.log('Signing in with:', email);
  // In production, validate credentials with your auth provider
  return getCurrentUser();
};
