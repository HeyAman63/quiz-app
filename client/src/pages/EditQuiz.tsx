import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { quizService } from "@/services/apiService"; // ✅ using Express backend API

interface QuestionInput {
  id?: string;
  question: string;
  options: string[];
  correct_answer: string;
}

export default function EditQuiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchQuizData();
  }, [id]);

  const fetchQuizData = async () => {
    try {
      const res = await quizService.getById(id!); // ✅ replaced Supabase call
      const quiz = res.data;

      setTitle(quiz.title);
      setDescription(quiz.description || "");
      setQuestions(
        quiz.questions?.map((q: any) => ({
          id: q._id,
          question: q.question,
          options: q.options || ["", "", "", ""],
          correct_answer: q.correctAnswer,
        })) || []
      );
    } catch (error: any) {
      console.error(error);
      toast.error("Error loading quiz");
      navigate("/admin");
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correct_answer: "" }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionInput, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation (unchanged)
    if (!title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    if (questions.length === 0) {
      toast.error("Add at least one question");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} text is required`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        toast.error(`All options for question ${i + 1} are required`);
        return;
      }
      if (!q.correct_answer.trim()) {
        toast.error(`Correct answer for question ${i + 1} is required`);
        return;
      }
      if (!q.options.includes(q.correct_answer)) {
        toast.error(`Correct answer for question ${i + 1} must match one of the options`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // ✅ replaced Supabase update with backend API
      const formattedQuestions = questions.map((q) => ({
        question: q.question.trim(),
        options: q.options.map((opt) => opt.trim()),
        correctAnswer: q.correct_answer.trim(),
      }));

      await quizService.update(id!, {
        title: title.trim(),
        description: description.trim() || "",
        questions: formattedQuestions,
      });

      toast.success("Quiz updated successfully!");
      navigate("/admin");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Edit Quiz</h1>
          <p className="text-muted-foreground">
            Update quiz details and questions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {questions.map((question, qIndex) => (
            <Card key={qIndex}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Question {qIndex + 1}</CardTitle>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question Text *</Label>
                  <Input
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                    placeholder="Enter your question"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Options *</Label>
                  {question.options.map((option, oIndex) => (
                    <Input
                      key={oIndex}
                      value={option}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      required
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Correct Answer *</Label>
                  <Input
                    value={question.correct_answer}
                    onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)}
                    placeholder="Enter the correct answer (must match one option exactly)"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={addQuestion} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Question
            </Button>

            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Quiz...
                </>
              ) : (
                "Update Quiz"
              )}
            </Button>

            <Button type="button" variant="outline" onClick={() => navigate("/admin")}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
