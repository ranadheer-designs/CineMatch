import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  title: string;
  content: string;
  icon?: string;
}

interface GuideAccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
}

export default function GuideAccordion({
  items,
  defaultOpen = 0,
}: GuideAccordionProps) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border border-primary/20 bg-card/40 backdrop-blur-sm overflow-hidden hover:border-primary/40 transition-colors duration-200"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-card/60 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              {item.icon && <span className="text-2xl">{item.icon}</span>}
              <h3 className="font-semibold text-foreground text-left">
                {item.title}
              </h3>
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-primary transition-transform duration-300",
                openIndex === index && "rotate-180",
              )}
            />
          </button>

          {openIndex === index && (
            <div className="px-6 py-4 border-t border-primary/20 bg-card/20 text-foreground/90 animate-fade-in">
              <div className="prose prose-invert max-w-none space-y-3">
                {item.content.split("\n").map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
