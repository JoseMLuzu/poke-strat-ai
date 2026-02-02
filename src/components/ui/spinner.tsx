import Pokeball from "../../assets/pokeball_icon_136305.webp";
import { cn } from "@/lib/utils";

type SpinnerProps = React.ComponentProps<"img">;

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <img
      src={Pokeball}
      alt="Loading"
      role="status"
      className={cn("w-10 h-10 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
