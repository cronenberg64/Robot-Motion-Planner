import { MotionPlanner } from '@/components/motion-planner';
import { Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
             <Bot className="h-12 w-12 text-primary" />
             <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
              Robot Motion Planner
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe a sequence of robot movements in plain English. Our AI will parse your instructions, generate a motion plan, and allow you to fine-tune and export it.
          </p>
        </header>
        <MotionPlanner />
      </div>
      <footer className="text-center mt-8 text-sm text-muted-foreground">
        <p>Built with Next.js, Genkit, and ShadCN/UI.</p>
      </footer>
    </div>
  );
}
