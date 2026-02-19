// Icons for evolution requirements and formatting functions for displaying them
import {
  ArrowUp,
  Heart,
  Sparkles,
  Gem,
  Repeat,
  Clock,
  User,
  Sword,
  MapPin,
} from "lucide-react";

// Returns the icon for a specific evolution requirement
export const getRequirementIcon = (type) => {
  switch (type) {
    case "level":
      return <ArrowUp className="w-3 h-3 mr-1" />;
    case "friendship":
      return <Heart className="w-3 h-3 mr-1" />;
    case "affection":
      return <Sparkles className="w-3 h-3 mr-1" />;
    case "beauty":
      return <Gem className="w-3 h-3 mr-1" />;
    case "trade":
      return <Repeat className="w-3 h-3 mr-1" />;
    case "time":
      return <Clock className="w-3 h-3 mr-1" />;
    case "gender":
      return <User className="w-3 h-3 mr-1" />;
    case "move":
    case "move-type":
      return <Sword className="w-3 h-3 mr-1" />;
    case "location":
      return <MapPin className="w-3 h-3 mr-1" />;
    default:
      return null;
  }
};

// Formats the requirement into a readable string
export const formatRequirement = (req) => {
  switch (req.type) {
    case "level":
      return `Level ${req.value}`;
    case "friendship":
      return "High Friendship";
    case "affection":
      return "High Affection";
    case "beauty":
      return "High Beauty";
    case "item":
      return `Use ${req.value}`;
    case "held-item":
      return `Holding ${req.value}`;
    case "trade":
      return "Trade";
    case "time":
      return req.value === "night" ? "Nighttime" : "Daytime";
    case "gender":
      return req.value === "female" ? "Female Only" : "Male Only";
    case "move":
      return `Knows ${req.value}`;
    case "move-type":
      return `Knows ${req.value}-type move`;
    case "location":
      return `At ${req.value}`;
    default:
      return "";
  }
};
