
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";

const Achievements = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100 p-4">
      <div className="text-center mb-8">
        <Trophy className="h-16 w-16 text-amber-400 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-amber-500 mb-4">
          Achievements
        </h1>
        <p className="text-xl text-amber-600 mb-8">Coming Soon</p>
        
        <Button
          onClick={() => navigate("/")}
          className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-2 px-6 rounded-lg"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Achievements;
