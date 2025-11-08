import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { QuizCard } from "@/components/QuizCard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { quizService } from "@/services/apiService"; // ✅ new import

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  createdAt?: string;
}

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await quizService.getAll(); // ✅ replaced Supabase fetch
      setQuizzes(res.data || []);
    } catch (error: any) {
      toast.error("Error loading quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Available Quizzes</h1>
          <p className="text-muted-foreground">
            Choose a quiz to test your knowledge
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">
              No quizzes available yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
