// requirementIcon.js
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
