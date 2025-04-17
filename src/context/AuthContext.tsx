
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth listeners");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        // Update state synchronously
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle login events
        if (event === 'SIGNED_IN') {
          toast.success("Signed in successfully");
          console.log("User signed in successfully", session?.user?.email);
        } else if (event === 'SIGNED_OUT') {
          toast.info("Signed out");
          console.log("User signed out");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Token refreshed");
        } else if (event === 'USER_UPDATED') {
          console.log("User updated");
        }
      }
    );

    // THEN check for existing session
    console.log("Checking for existing session");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session exists" : "No session");
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch(error => {
      console.error("Error getting session:", error);
      setIsLoading(false);
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log("Initiating Google sign in");
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error("Google sign in error:", error);
        throw error;
      }
      
      console.log("Google sign in initiated", data);
    } catch (error: any) {
      console.error("Error in signInWithGoogle:", error);
      toast.error(`Error signing in with Google: ${error.message}`);
    }
  };

  const signInWithApple = async () => {
    try {
      console.log("Initiating Apple sign in");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        console.error("Apple sign in error:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("Error in signInWithApple:", error);
      toast.error(`Error signing in with Apple: ${error.message}`);
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("Error in signOut:", error);
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signInWithGoogle, 
      signInWithApple, 
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
