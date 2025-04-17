
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Achievements = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="text-gray-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-500 mb-4">
          Achievements
        </h1>
        <p className="text-xl text-amber-600">
          Coming Soon
        </p>
      </div>
    </div>
  );
};

export default Achievements;
