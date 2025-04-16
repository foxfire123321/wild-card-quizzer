
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-poker-gold text-3xl font-bold">Poker Quiz</h1>
          <Button 
            variant="outline" 
            className="border-poker-gold text-poker-gold hover:bg-poker-gold hover:text-white"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-poker-gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button 
              className="mt-4 bg-poker-gold hover:bg-amber-600"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-medium mb-4">All Questions:</h2>
            {questions.map((question) => (
              <Card key={question.id} className="p-4 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-lg font-medium">{question.id}. {question.text}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
