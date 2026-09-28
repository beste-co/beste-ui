import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "reaction-rating",
  title: "Reaction Rating",
  description:
    "A star rating for reviews, feedback and track ratings: stars fill up to the pointer as a preview (by halves, with `allowHalf`), a click sets the rating and gives the star it lands on a small pop, and clicking the same rating again clears it. The keyboard gets a native range under the stars: arrows, Home and End step through it, number keys jump straight to a rating and Backspace clears. As a read-only display it fills fractionally, so 4.3 fills 30% of the fifth star, and it can write the value and the number of ratings beside the stars (\"4.3 (1,284)\"). Any icon can replace the star, in amber, the primary color or the foreground.",
  category: "Reaction",
  usage: `import { ReactionRating } from "@/components/beste/component/reaction-rating";

const [rating, setRating] = useState(0);
<ReactionRating value={rating} onValueChange={setRating} allowHalf label="Rate this album" />

// A review summary: read-only, fractional fill, value and count
<ReactionRating readOnly defaultValue={4.3} showValue count={1284} size="sm" />

// Hearts in the primary color, ten of them
import { Heart } from "lucide-react";
<ReactionRating icon={Heart} max={10} color="primary" tone="outline" />`,
};
