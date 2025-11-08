import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar } from "lucide-react";

// ✅ Replaced Supabase type with local interface
interface Quiz {
  _id: string;
  title: string;
  description?: string;
  createdAt?: string; // backend sends createdAt instead of created_at
}

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
      <div className="h-2 bg-gradient-primary" />
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          <span className="flex-1">{quiz.title}</span>
          <BookOpen className="h-5 w-5 text-primary" />
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {quiz.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(quiz.createdAt || "").toLocaleDateString()}</span>
        </div>
        <Button onClick={() => navigate(`/quiz/${quiz._id}`)} className="w-full">
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );
}
