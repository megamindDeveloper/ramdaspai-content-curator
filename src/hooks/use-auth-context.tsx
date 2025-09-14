
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmailAndPassword: (email: string, pass: string) => Promise<any>;
  signUpWithEmailAndPassword: (email: string, pass: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setLoading(false);
      throw error;
    }
  };

  const emailSignIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        router.push('/dashboard');
    } catch(error) {
        setLoading(false);
        console.error("Error signing in with email: ", error);
        throw error;
    }
  }

  const emailSignUp = async (email: string, pass: string) => {
    setLoading(true);
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
        router.push('/dashboard');
    } catch(error) {
        setLoading(false);
        console.error("Error signing up with email: ", error);
        throw error;
    }
  }


  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const value = { user, loading, signInWithGoogle, signOut, signInWithEmailAndPassword: emailSignIn, signUpWithEmailAndPassword: emailSignUp };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
