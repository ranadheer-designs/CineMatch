import { useState } from "react";

interface ColorSwatch {
  hex: string;
  label: string;
  description?: string;
}

interface ColorSwatchesProps {
  colors?: ColorSwatch[];
  title?: string;
}

const DEFAULT_COLORS: ColorSwatch[] = [
  { hex: "#14b8a6", label: "Teal", description: "Primary accent" },
  { hex: "#06b6d4", label: "Cyan", description: "Secondary accent" },
  { hex: "#1e293b", label: "Dark Slate", description: "Deep shadows" },
  { hex: "#64748b", label: "Slate", description: "Mid-tones" },
  { hex: "#f5f5f5", label: "Off-white", description: "Highlights" },
];

export default function ColorSwatches({
  colors = DEFAULT_COLORS,
  title = "Color Palette",
}: ColorSwatchesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <div
            key={index}
            className="group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="w-full aspect-square rounded-lg border border-primary/20 shadow-lg transition-all duration-200 cursor-pointer hover:shadow-xl hover:shadow-primary/30"
              style={{ backgroundColor: color.hex }}
              title={color.label}
            />
            {hoveredIndex === index && (
              <div className="mt-2 p-2 rounded-lg bg-card border border-primary/20 text-center animate-fade-in">
                <p className="text-sm font-semibold text-foreground">
                  {color.label}
                </p>
                {color.description && (
                  <p className="text-xs text-muted-foreground">
                    {color.description}
                  </p>
                )}
                <p className="text-xs text-primary font-mono mt-1">
                  {color.hex}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
