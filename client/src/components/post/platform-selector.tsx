import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onChange: (platforms: string[]) => void;
}

interface PlatformOption {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const PlatformSelector = ({
  selectedPlatforms,
  onChange,
}: PlatformSelectorProps) => {
  const platforms: PlatformOption[] = [
    {
      id: "meta",
      name: "Meta",
      icon: "ri-facebook-fill",
      bgColor: "bg-meta",
      borderColor: "border-meta",
      textColor: "text-meta",
    },
    {
      id: "x",
      name: "X",
      icon: "ri-twitter-x-fill",
      bgColor: "bg-twitter",
      borderColor: "border-twitter",
      textColor: "text-twitter",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "ri-linkedin-fill",
      bgColor: "bg-linkedin",
      borderColor: "border-linkedin",
      textColor: "text-linkedin",
    },
    {
      id: "google",
      name: "Google",
      icon: "ri-google-fill",
      bgColor: "bg-google",
      borderColor: "border-google", 
      textColor: "text-google",
    },
  ];

  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onChange(selectedPlatforms.filter(id => id !== platformId));
    } else {
      onChange([...selectedPlatforms, platformId]);
    }
  };

  return (
    <div className="flex space-x-2">
      {platforms.map(platform => {
        const isSelected = selectedPlatforms.includes(platform.id);
        return (
          <button
            key={platform.id}
            type="button"
            className={cn(
              "platform-tab w-8 h-8 rounded-full flex items-center justify-center",
              `${platform.bgColor} bg-opacity-10 ${platform.borderColor}`,
              isSelected ? "active border-2" : "opacity-50 border-0"
            )}
            title={platform.name}
            onClick={() => togglePlatform(platform.id)}
          >
            <i className={`${platform.icon} ${platform.textColor}`}></i>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;
