
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

interface MessageInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
}

const MessageInput = ({ onSend, isLoading }: MessageInputProps) => {
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;
    
    onSend(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
      <Textarea
        placeholder="Tell me what kind of restaurant you're looking for..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="resize-none flex-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading && input.trim()) {
              handleSend(e);
            }
          }
        }}
      />
      <Button type="submit" disabled={isLoading || input.trim() === ''}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </form>
  );
};

export default MessageInput;
