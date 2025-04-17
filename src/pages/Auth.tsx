
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const { signInWithGoogle, signInWithApple } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/';

  const handleBackToMain = () => {
    navigate('/');
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(() => {
        // Navigation back to the original page will happen after the redirect and sign-in process completes
      })
      .catch(error => {
        toast.error("Sign in with Google failed");
        console.error(error);
      });
  };

  const handleAppleSignIn = () => {
    signInWithApple()
      .then(() => {
        // Navigation back to the original page will happen after the redirect and sign-in process completes
      })
      .catch(error => {
        toast.error("Sign in with Apple failed");
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <Card className="max-w-md w-full bg-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-poker-gold">Sign In</CardTitle>
          <CardDescription>
            Sign in to save your progress and view the leaderboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4ZM24.0005 18.3652C25.5633 18.3652 26.9715 18.9053 28.0969 19.8184L32.1622 15.7919C29.7867 13.6414 26.9323 12.4217 24.0005 12.4217C19.4246 12.4217 15.456 14.9759 13.5542 18.7003L18.2598 22.3681C19.1557 20.0092 21.3781 18.3652 24.0005 18.3652ZM32.6411 24.5966C32.6411 23.5225 32.5099 22.5398 32.2427 21.6306L24.0005 21.6304V27.4913H28.8758C28.5723 29.0037 27.6978 30.1795 26.3611 30.9279L30.7685 34.3724C32.9086 32.3865 34.1817 29.6186 34.1817 26.1572C34.1817 25.6254 34.1405 25.1048 34.0622 24.5966H32.6411Z" fill="#4285F4"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M13.5542 18.7003L18.2598 22.3681C19.1557 20.0092 21.3781 18.3652 24.0005 18.3652V12.4217C19.4246 12.4217 15.456 14.9759 13.5542 18.7003Z" fill="#EA4335"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M24.0005 35.5783C26.9323 35.5783 29.7867 34.4307 32.1622 32.2802L26.3611 30.9279C25.3049 31.6155 23.9795 32.0348 24.0005 32.0348C21.3781 32.0348 19.1557 30.3908 18.2598 28.0319L13.5542 31.6997C15.456 35.4241 19.4246 35.5783 24.0005 35.5783Z" fill="#34A853"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M24.0005 12.4217V18.3652C26.9323 18.3652 29.7867 19.5128 32.1622 21.6633L28.0969 25.7898C26.9715 24.8767 25.5633 24.3366 24.0005 24.3366C21.3781 24.3366 19.1557 25.9806 18.2598 28.3395L13.5542 24.6717C15.456 20.9473 19.4246 12.4217 24.0005 12.4217Z" fill="#FBBC05"/>
            </svg>
            Continue with Google
          </Button>
          
          <Button 
            className="w-full bg-black hover:bg-gray-900 text-white flex items-center justify-center gap-2"
            onClick={handleAppleSignIn}
          >
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.40647 3.99874C7.77368 3.56467 8.26937 3.19738 8.7872 3.15351C8.85455 3.62521 8.70062 4.10546 8.35549 4.49859C8.00452 4.9119 7.52582 5.29333 6.96028 5.24111C6.88009 4.78246 7.07126 4.29541 7.40647 3.99874ZM8.67016 5.49292C7.8952 5.49292 7.6137 5.99565 6.97621 5.99565C6.32695 5.99565 5.95366 5.50242 5.30291 5.50242C4.2989 5.50242 3.0925 6.40472 3.0925 8.18862C3.0925 9.58301 3.63059 11.0279 4.34114 11.9399C4.74097 12.4461 5.20593 13 5.81471 13C6.41344 13 6.64637 12.595 7.37267 12.595C8.11079 12.595 8.29868 13 8.94793 13C9.56831 13 10.0641 12.378 10.464 11.8718C10.9397 11.2653 11.1429 10.6682 11.1524 10.6396C11.1332 10.6301 9.70139 10.0624 9.70139 8.5297C9.70139 7.21342 10.8185 6.63217 10.8862 6.58496C10.2575 5.67265 9.27217 5.5782 8.9562 5.5782C8.86423 5.57918 8.76752 5.58672 8.67016 5.59974V5.49292Z" fill="white" />
            </svg>
            Continue with Apple
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            className="text-poker-gold"
            onClick={handleBackToMain}
          >
            Back to Main Menu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
