
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Auth = () => {
  const { user, isLoading, signInWithGoogle, signInWithApple } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="animate-spin h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="text-center mb-8">
        <h1 className="text-poker-gold text-4xl md:text-5xl font-bold mb-2">
          poker gone wild
        </h1>
        <h2 className="text-poker-gold text-6xl md:text-7xl font-bold mb-8">
          login
        </h2>
      </div>
      
      <div className="w-full max-w-md space-y-4">
        <Button 
          onClick={signInWithGoogle}
          className="w-full bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
        >
          <svg className="mr-2 h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          Sign in with Google
        </Button>
        
        <Button 
          onClick={signInWithApple}
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          <svg className="mr-2 h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
          </svg>
          Sign in with Apple
        </Button>
        
        <Button 
          onClick={() => navigate('/')}
          variant="outline" 
          className="w-full mt-4"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Auth;
