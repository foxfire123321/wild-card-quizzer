
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const CreatePokerLog = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [buyIn, setBuyIn] = useState('');
  const [smallBlind, setSmallBlind] = useState('');
  const [bigBlind, setBigBlind] = useState('');
  const [cashOut, setCashOut] = useState('');
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to create a log");
      return;
    }

    try {
      const { data, error } = await supabase.from('poker_logs').insert({
        user_id: user.id,
        date: new Date(date).toISOString(),
        buy_in: parseFloat(buyIn),
        small_blind: parseFloat(smallBlind),
        big_blind: parseFloat(bigBlind),
        cash_out: parseFloat(cashOut),
        notes: notes || null
      });

      if (error) throw error;

      toast.success("Poker log created successfully");
      navigate('/poker-companion');
    } catch (error) {
      console.error(error);
      toast.error("Failed to create poker log");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-poker-brown mb-6">Create Poker Log</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Date</Label>
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>

        <div>
          <Label>Buy-in Amount ($)</Label>
          <Input 
            type="number" 
            step="0.01" 
            value={buyIn} 
            onChange={(e) => setBuyIn(e.target.value)} 
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Small Blind ($)</Label>
            <Input 
              type="number" 
              step="0.01" 
              value={smallBlind} 
              onChange={(e) => setSmallBlind(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label>Big Blind ($)</Label>
            <Input 
              type="number" 
              step="0.01" 
              value={bigBlind} 
              onChange={(e) => setBigBlind(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div>
          <Label>Cash-out Amount ($)</Label>
          <Input 
            type="number" 
            step="0.01" 
            value={cashOut} 
            onChange={(e) => setCashOut(e.target.value)} 
            required 
          />
        </div>

        <div>
          <Label>Notes (Optional)</Label>
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate('/poker-companion')}>
            Cancel
          </Button>
          <Button type="submit" className="bg-poker-gold hover:bg-amber-600">
            Save Log
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePokerLog;
