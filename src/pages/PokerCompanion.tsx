
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { PlusIcon, ArrowDownUpIcon, HomeIcon } from "lucide-react";
import { toast } from "sonner";

interface PokerLog {
  id: string;
  date: string;
  buy_in: number;
  small_blind: number;
  big_blind: number;
  cash_out: number;
  notes?: string;
  pnl: number;
}

const PokerCompanion = () => {
  const [logs, setLogs] = useState<PokerLog[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'pnl'>('date');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('poker_logs')
        .select('*')
        .eq('user_id', user.id)
        .order(sortBy, { ascending: false });

      if (error) {
        toast.error("Failed to fetch poker logs");
        console.error(error);
        return;
      }

      const logsWithPnL = data.map(log => ({
        ...log,
        pnl: log.cash_out - log.buy_in
      }));

      setLogs(logsWithPnL);
    };

    fetchLogs();
  }, [user, sortBy]);

  const toggleSort = () => {
    setSortBy(prev => prev === 'date' ? 'pnl' : 'date');
  };

  const openLogDetails = (logId: string) => {
    navigate(`/poker-companion/log/${logId}`);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl mb-4">Please log in to view poker logs</p>
        <Button onClick={() => navigate('/')}>Back to Main Menu</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <HomeIcon className="h-4 w-4" />
            Main Menu
          </Button>
          <h1 className="text-3xl font-bold text-poker-brown">Poker Companion</h1>
        </div>
        <Button variant="outline" onClick={toggleSort}>
          <ArrowDownUpIcon className="mr-2" /> 
          Sort by {sortBy === 'date' ? 'Date' : 'PnL'}
        </Button>
      </div>

      {logs.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">
          No poker logs yet. Create your first log!
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map(log => (
            <Card 
              key={log.id} 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => openLogDetails(log.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle>
                  {new Date(log.date).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p>Buy-in: ${log.buy_in}</p>
                    <p>Cash-out: ${log.cash_out}</p>
                  </div>
                  <div>
                    <p>Blinds: {log.small_blind}/{log.big_blind}</p>
                    <p 
                      className={`font-bold ${
                        log.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      PnL: ${log.pnl.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 rounded-full w-16 h-16 bg-poker-gold hover:bg-amber-600"
        onClick={() => navigate('/poker-companion/create')}
      >
        <PlusIcon className="w-8 h-8" />
      </Button>
    </div>
  );
};

export default PokerCompanion;
