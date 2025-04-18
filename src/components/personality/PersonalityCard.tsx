
import { Card, CardContent } from "@/components/ui/card";
import { PersonalityType, personalityDescriptions, personalityIcons } from "@/utils/personalityQuizUtils";

interface PersonalityCardProps {
  personality: PersonalityType;
}

const PersonalityCard = ({ personality }: PersonalityCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-poker-gold text-white p-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          {personalityIcons[personality]} {personality}
        </h2>
      </div>
      
      <CardContent className="pt-6 pb-6">
        <div className="w-full h-48 bg-amber-100 rounded-lg mb-6 flex items-center justify-center">
          <span className="text-6xl">{personalityIcons[personality]}</span>
        </div>
        
        <p className="text-gray-700 text-lg leading-relaxed">
          {personalityDescriptions[personality]}
        </p>
      </CardContent>
    </Card>
  );
};

export default PersonalityCard;
