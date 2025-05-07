import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Link, Image, Video, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "What would you like to share?",
  className,
}: RichTextEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };
  
  const handleFormat = (format: string) => {
    executeCommand(format);
  };
  
  const handleLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      // Allow shift+enter for new line
      e.preventDefault();
      executeCommand("insertLineBreak");
    }
  };
  
  return (
    <div className={cn("border rounded-md overflow-hidden", isFocused && "ring-2 ring-primary", className)}>
      <div className="border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
        <ToggleGroup type="multiple" className="justify-start">
          <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => handleFormat("bold")}>
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => handleFormat("italic")}>
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="link" aria-label="Add link" onClick={handleLink}>
            <Link className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <div className="flex items-center space-x-1 ml-auto">
          <Button variant="ghost" size="icon" onClick={() => alert("Insert emoji")}>
            <Smile className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => alert("Upload image")}>
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => alert("Upload video")}>
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div
        className="p-4 min-h-[150px] outline-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        data-placeholder={placeholder}
        style={{ 
          WebkitUserModify: "read-write",
          overflowWrap: "break-word"
        }}
      />
    </div>
  );
};

export default RichTextEditor;
