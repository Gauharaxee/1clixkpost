import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Link, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  onImageRequest?: () => void;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your post here...",
  className,
  error,
  onImageRequest,
}: RichTextEditorProps) {
  const [text, setText] = useState(value);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    onChange(newValue);
    setSelectionStart(e.target.selectionStart);
    setSelectionEnd(e.target.selectionEnd);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectionStart(target.selectionStart);
    setSelectionEnd(target.selectionEnd);
  };

  const wrapText = (before: string, after: string = before) => {
    const newText =
      text.substring(0, selectionStart) +
      before +
      text.substring(selectionStart, selectionEnd) +
      after +
      text.substring(selectionEnd);

    setText(newText);
    onChange(newText);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      const selectedText = text.substring(selectionStart, selectionEnd);
      const linkText = selectedText || "link text";
      const newText =
        text.substring(0, selectionStart) +
        `[${linkText}](${url})` +
        text.substring(selectionEnd);

      setText(newText);
      onChange(newText);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="bg-gray-50 border border-gray-200 rounded-t-md p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => wrapText('**', '**')}
          className="h-8 px-2 text-gray-600"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => wrapText('*', '*')}
          className="h-8 px-2 text-gray-600"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="border-r border-gray-300 mx-1 h-6 my-auto"></div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          className="h-8 px-2 text-gray-600"
        >
          <Link className="h-4 w-4" />
        </Button>
        {onImageRequest && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onImageRequest}
            className="h-8 px-2 text-gray-600"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Textarea
        value={text}
        onChange={handleChange}
        onSelect={handleSelect}
        placeholder={placeholder}
        className={cn(
          "min-h-[200px] resize-y rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0",
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        )}
        rows={8}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div className="mt-1 text-xs text-gray-500 flex justify-between">
        <span>{text.length} characters</span>
        <span>{280 - text.length} characters left for Twitter</span>
      </div>
    </div>
  );
}
