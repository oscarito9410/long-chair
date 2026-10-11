import type { ReactNode } from "react";
import { HeroNumber } from "../ui/HeroNumber.tsx";
import { SampleNote } from "../ui/SampleNote.tsx";

type ScreenIntroProps = {
  title: string;
  hero?: string;
  caption?: string;
  lede?: string;
  children?: ReactNode;
};

export function ScreenIntro({ title, hero, caption, lede, children }: ScreenIntroProps) {
  return (
    <header className="flex flex-col gap-6">
      <SampleNote />
      {hero !== undefined && caption !== undefined && hero.length > 0 ? (
        <HeroNumber value={hero} caption={caption} />
      ) : null}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight">{title}</h1>
        {lede ? <p className="text-lg leading-relaxed">{lede}</p> : null}
        {children}
      </div>
    </header>
  );
}
