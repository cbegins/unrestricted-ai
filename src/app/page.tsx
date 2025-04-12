'use client';

import {useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {generateResponse} from '@/ai/flows/generate-response';
import {Toaster} from '@/components/ui/toaster';
import {toast} from '@/hooks/use-toast';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponse(null); // Clear previous response

    try {
      const result = await generateResponse({prompt});
      // Adding a fallback in case the AI returns null
      setResponse(result.response || 'No response received.');
    } catch (error: any) {
      console.error('Error generating response:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate response.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4 shadow-md">Unrestricted AI Accessor</h1>

      <Textarea
        placeholder="Enter your prompt here..."
        className="w-full max-w-2xl mb-4 shadow-lg"
        value={prompt}
        onChange={handlePromptChange}
      />

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Response'}
      </Button>

      {response && (
        <Card className="w-full max-w-2xl mt-4 shadow-xl bg-background text-foreground">
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Response:</h2>
            <p>{response}</p>
          </CardContent>
        </Card>
      )}

      <p className="text-sm mt-8 text-muted-foreground">
        Disclaimer: This application provides unrestricted access to AI. Users
        are responsible for the prompts they enter and the content generated.
      </p>
      <p className="text-xs mt-2 text-muted-foreground">
        Copyright © {new Date().getFullYear()} Begins.site. All rights reserved.
      </p>
    </div>
  );
}
