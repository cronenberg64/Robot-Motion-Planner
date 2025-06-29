'use client';

import { useState } from 'react';
import { AlertCircle, BotMessageSquare, ChevronDown, Cog, Download, FileJson, FileText, Loader2, Play } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { generateMotionPlan } from '@/app/actions';
import type { MotionPlan, MotionStep } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { RobotPoseVisualizer } from './robot-pose-visualizer';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          Generate Motion Plan
        </>
      )}
    </Button>
  );
}

export function MotionPlanner() {
  const [motionPlan, setMotionPlan] = useState<MotionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (formData: FormData) => {
    setError(null);
    setMotionPlan(null);
    const prompt = formData.get('prompt') as string;
    const { plan, error: apiError } = await generateMotionPlan(prompt);

    if (apiError) {
      setError(apiError);
    } else {
      setMotionPlan(plan);
    }
  };
  
  const handleAngleChange = (stepId: string, jointName: string, angleIndex: number, newValue: number) => {
    setMotionPlan(currentPlan => {
      if (!currentPlan) return null;
      return currentPlan.map(step => {
        if (step.id === stepId) {
          const newAngles = [...step.jointAngles[jointName]];
          newAngles[angleIndex] = newValue;
          return {
            ...step,
            jointAngles: {
              ...step.jointAngles,
              [jointName]: newAngles,
            },
          };
        }
        return step;
      });
    });
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToJson = () => {
    if (!motionPlan) {
      toast({ variant: 'destructive', title: 'Error', description: 'No motion plan to export.' });
      return;
    }
    const jsonString = JSON.stringify(motionPlan, null, 2);
    downloadFile(jsonString, 'motion_plan.json', 'application/json');
  };

  const exportToYaml = () => {
    if (!motionPlan) {
      toast({ variant: 'destructive', title: 'Error', description: 'No motion plan to export.' });
      return;
    }
    let yamlString = '';
    motionPlan.forEach(step => {
      yamlString += `- motionPrimitive: ${step.motionPrimitive}\n`;
      yamlString += `  jointAngles:\n`;
      Object.entries(step.jointAngles).forEach(([jointName, angles]) => {
        yamlString += `    ${jointName}:\n`;
        angles.forEach(angle => {
          yamlString += `      - ${angle.toFixed(2)}\n`;
        });
      });
    });
    downloadFile(yamlString, 'motion_plan.yaml', 'application/x-yaml');
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <BotMessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline">Motion Prompt</CardTitle>
            <CardDescription>Enter instructions for the robot&apos;s movements.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action={handleFormSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="prompt">Instructions</Label>
            <Textarea
              name="prompt"
              id="prompt"
              placeholder="e.g., Make the robot wave, then point, then rest."
              className="min-h-[100px] text-base"
              required
            />
          </div>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>

        {useFormStatus().pending && (
          <div className="text-center p-8 space-y-3">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">AI is thinking...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {motionPlan && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold font-headline text-foreground">Generated Motion Plan</h3>
            <Accordion type="multiple" defaultValue={[motionPlan[0]?.id]} className="w-full">
              {motionPlan.map((step: MotionStep) => (
                <AccordionItem value={step.id} key={step.id} className="bg-card border rounded-lg mb-2">
                  <AccordionTrigger className="p-4 hover:no-underline text-lg">
                    <div className="flex items-center gap-3">
                      <Cog className="h-5 w-5 text-accent" />
                      <span className="capitalize">{step.motionPrimitive}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-muted-foreground">Joint Angles</h4>
                        {Object.entries(step.jointAngles).map(([jointName, angles]) => (
                          <div key={jointName} className="space-y-3">
                            <h5 className="font-medium capitalize">{jointName}</h5>
                            <div className="grid gap-4 pl-2">
                              {angles.map((angle, index) => (
                                <div key={index} className="grid grid-cols-5 items-center gap-2">
                                  <Label htmlFor={`${step.id}-${jointName}-${index}`} className="col-span-1">
                                    θ{index + 1}
                                  </Label>
                                  <Slider
                                    id={`${step.id}-${jointName}-${index}`}
                                    min={-1}
                                    max={1}
                                    step={0.01}
                                    value={[angle]}
                                    onValueChange={([val]) => handleAngleChange(step.id, jointName, index, val)}
                                    className="col-span-3"
                                  />
                                  <span className="col-span-1 text-right font-mono text-sm text-foreground">
                                    {angle.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-muted-foreground">Pose Previews</h4>
                        <div className="flex flex-wrap gap-4 p-2 rounded-lg bg-muted/30">
                          {step.jointAngles.joint1?.map((_, index) => {
                            const poseAngles: Record<string, number> = {};
                            Object.keys(step.jointAngles).forEach(key => {
                              poseAngles[key] = step.jointAngles[key][index];
                            });
                            return (
                              <div key={index} className="flex flex-col items-center gap-2">
                                <Label htmlFor={`${step.id}-pose-${index}`} className="font-mono text-sm">Pose {index + 1}</Label>
                                <RobotPoseVisualizer jointAngles={poseAngles} size={100} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
      {motionPlan && (
         <CardFooter className="flex-col sm:flex-row justify-end gap-2 bg-muted/50 p-4 rounded-b-lg">
            <span className="text-sm text-muted-foreground mr-auto hidden sm:block">Export your plan:</span>
            <Button variant="outline" onClick={exportToJson}>
              <FileJson className="mr-2 h-4 w-4" />
              Export to JSON
            </Button>
            <Button variant="outline" onClick={exportToYaml}>
              <FileText className="mr-2 h-4 w-4" />
              Export to YAML
            </Button>
         </CardFooter>
      )}
    </Card>
  );
}
