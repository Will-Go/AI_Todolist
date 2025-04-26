import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import ChatInput from "./ChatInput";

//UTILS
import removeHTMLTags from "@/lib/utils/removeHTMLTags";

interface ChatInputLayoutProps {
  onSend: (message: string) => Promise<void>;
}

export default function ChatInputLayout({ onSend }: ChatInputLayoutProps) {
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;
    // Handle sending the message here
    try {
      setIsSending(true);

      await onSend(message);
      setMessage(""); // Clear the input after sending
    } catch {
    } finally {
      setIsSending(false);
    }
  };
  const onChange = (value: string) => {
    if (isSending) return;
    setMessage(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !isSending &&
      removeHTMLTags(message).trim()
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex justify-center w-full pb-4 pt-2 rounded-xl ">
      <div className="flex items-center w-full rounded-xl bg-zinc-600/50 border border-zinc-600/70! p-2 ">
        <ChatInput
          value={message}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          onClick={handleSend}
          size="icon"
          disabled={!removeHTMLTags(message).trim() || isSending}
          className="ml-2"
        >
          {isSending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>
    </div>
  );
}
