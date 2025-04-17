
import { supabase } from "@/integrations/supabase/client";

export async function saveQuizProgress(quizId: string, questionIndex: number) {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    console.error("Cannot save progress: No authenticated user");
    return;
  }
  
  const { data, error } = await supabase
    .from("quiz_progress")
    .upsert(
      {
        user_id: user.user.id,
        quiz_id: quizId,
        last_question_index: questionIndex,
        updated_at: new Date().toISOString() // Convert Date to ISO string
      },
      { onConflict: "user_id,quiz_id" }
    );
  
  if (error) {
    console.error("Error saving quiz progress:", error);
  }
  
  return data;
}

export async function getQuizProgress(quizId: string) {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    console.error("Cannot get progress: No authenticated user");
    return null;
  }
  
  const { data, error } = await supabase
    .from("quiz_progress")
    .select("last_question_index")
    .eq("user_id", user.user.id)
    .eq("quiz_id", quizId)
    .single();
  
  if (error && error.code !== "PGRST116") {
    // PGRST116 is the error code for "no rows returned"
    console.error("Error getting quiz progress:", error);
  }
  
  return data ? data.last_question_index : 0;
}
