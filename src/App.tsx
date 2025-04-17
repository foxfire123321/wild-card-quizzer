
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import QuizTwo from "./pages/QuizTwo";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PokerCompanion from "./pages/PokerCompanion";
import CreatePokerLog from "./pages/CreatePokerLog";
import PokerLogDetails from "./pages/PokerLogDetails";
import PokerPersonalityQuiz from "./pages/PokerPersonalityQuiz";
import PokerPersonalityResult from "./pages/PokerPersonalityResult";
import Leaderboard from "./pages/Leaderboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  console.log("Protected route: User:", user?.email, "Loading:", isLoading);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="animate-spin h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    );
  }
  
  if (!user) {
    console.log("User not authenticated, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/quiz-two" element={<QuizTwo />} />
              <Route path="/poker-companion" element={<PokerCompanion />} />
              <Route path="/poker-companion/create" element={
                <ProtectedRoute>
                  <CreatePokerLog />
                </ProtectedRoute>
              } />
              <Route path="/poker-companion/log/:logId" element={
                <ProtectedRoute>
                  <PokerLogDetails />
                </ProtectedRoute>
              } />
              <Route path="/poker-personality-quiz" element={<PokerPersonalityQuiz />} />
              <Route path="/poker-personality-result" element={<PokerPersonalityResult />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
