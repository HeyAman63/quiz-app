import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { quizService } from "@/services/apiService"; // ✅ backend API

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { score, total, answers, correctAnswers } = location.state || {};

  useEffect(() => {
    if (!score && score !== 0) {
      navigate("/dashboard");
      return;
    }
    if (id) {
      fetchQuizData();
    }
  }, [id, score]);

  const fetchQuizData = async () => {
    try {
      const res = await quizService.getById(id!); // ✅ Replaced Supabase calls
      const data = res.data;
      setQuiz(data);
      setQuestions(data.questions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const percentage = (score / total) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="mb-2 text-6xl font-bold text-primary">
                {score}/{total}
              </p>
              <p className="text-lg text-muted-foreground">
                You scored {percentage.toFixed(0)}%
              </p>
            </div>

            <Progress value={percentage} className="h-4" />

            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate(`/quiz/${id}`)}>
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Answer Review</h2>
          {questions.map((question, index) => {
            const userAnswer = answers?.[question._id];

            // prefer correct answer passed in location.state (returned from backend on submit)
            const correctFromState = correctAnswers?.[question._id];
            const correctValue = (correctFromState ?? question.correctAnswer ?? "").toString();

            // normalize whitespace when comparing to avoid false negatives
            const normalizedUser = (userAnswer || "").toString().trim();
            const normalizedCorrect = (correctValue || "").toString().trim();
            const isCorrect = normalizedUser === normalizedCorrect;

            return (
              <Card
                key={question._id}
                className={
                  isCorrect ? "border-success" : "border-destructive"
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-start gap-2 text-lg">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
                    )}
                    <span className="flex-1">
                      Question {index + 1}: {question.question}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Your answer:
                    </p>
                    <p
                      className={
                        isCorrect ? "text-success" : "text-destructive"
                      }
                    >
                      {userAnswer || "No answer"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Correct answer:
                    </p>
                      <p className="text-success">{correctValue}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
