
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface LoginPromptProps {
  title?: string;
  message: string;
  returnPath: string;
  onClose: () => void;
}

const LoginPrompt = ({
  title = "Login Recommended",
  message,
  returnPath,
  onClose
}: LoginPromptProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/auth", { state: { returnTo: returnPath } });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-poker-gold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{message}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Not Now
          </Button>
          <Button className="bg-poker-gold hover:bg-amber-600" onClick={handleLogin}>
            Log In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPrompt;
