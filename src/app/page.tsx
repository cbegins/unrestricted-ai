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
      setResponse(result.response);
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
      <h1 className="text-2xl font-bold mb-4">Unrestricted AI Accessor</h1>

      <Textarea
        placeholder="Enter your prompt here..."
        className="w-full max-w-2xl mb-4"
        value={prompt}
        onChange={handlePromptChange}
      />

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Response'}
      </Button>

      {response && (
        <Card className="w-full max-w-2xl mt-4 bg-background text-foreground">
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
    </div>
  );
}
