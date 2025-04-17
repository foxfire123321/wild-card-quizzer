
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
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

const PokerLogDetails = () => {
  const [log, setLog] = useState<PokerLog | null>(null);
  const { logId } = useParams<{ logId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchLogDetails = async () => {
      if (!user || !logId) return;

      const { data, error } = await supabase
        .from('poker_logs')
        .select('*')
        .eq('id', logId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        toast.error("Failed to fetch log details");
        console.error(error);
        navigate('/poker-companion');
        return;
      }

      const logWithPnL = {
        ...data,
        pnl: data.cash_out - data.buy_in
      };

      setLog(logWithPnL);
    };

    fetchLogDetails();
  }, [user, logId, navigate]);

  if (!log) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Poker Session Details</CardTitle>
          <p className="text-muted-foreground">
            {new Date(log.date).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Buy-in Amount</p>
              <p>${log.buy_in.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Cash-out Amount</p>
              <p>${log.cash_out.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Small Blind</p>
              <p>${log.small_blind.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Big Blind</p>
              <p>${log.big_blind.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold">Profit & Loss (PnL)</p>
            <p className={`text-2xl font-bold ${
              log.pnl >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${log.pnl.toFixed(2)}
            </p>
          </div>

          {log.notes && (
            <div>
              <p className="font-semibold">Notes</p>
              <p>{log.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/poker-companion')}
        >
          Back to Logs
        </Button>
      </div>
    </div>
  );
};

export default PokerLogDetails;
