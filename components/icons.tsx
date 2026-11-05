import { PenLine, BookOpen, Backpack, Laptop, ShoppingBag, PencilRuler, Calculator, LampDesk, Headphones, Shirt, Utensils, Dumbbell, Home, Gift, Smartphone, Notebook, GraduationCap, Tag, Sparkles, Watch, Palette, Music, Gamepad2, Baby } from "lucide-react";

// Icons the admin can pick for a category. Add more here; the key is what gets stored.
const M = {
  "pen-line": PenLine, "book-open": BookOpen, backpack: Backpack, laptop: Laptop, "shopping-bag": ShoppingBag,
  "pencil-ruler": PencilRuler, calculator: Calculator, "lamp-desk": LampDesk, headphones: Headphones, shirt: Shirt,
  utensils: Utensils, dumbbell: Dumbbell, home: Home, gift: Gift, smartphone: Smartphone, notebook: Notebook,
  "graduation-cap": GraduationCap, tag: Tag, sparkles: Sparkles, watch: Watch, palette: Palette, music: Music, gamepad: Gamepad2, baby: Baby,
} as const;
export const ICON_KEYS: string[] = Object.keys(M);
export default function CatIcon({ name, size = 20 }: { name?: string; size?: number }) {
  const I = (M as any)[name || ""] || Tag;
  return <I size={size} aria-hidden />;
}
