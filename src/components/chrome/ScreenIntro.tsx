import type { ReactNode } from "react";
import { GlassPanel } from "../glass/GlassPanel.tsx";
import type { IconName } from "../ui/icon-names.ts";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";
import { HeroNumber } from "../ui/HeroNumber.tsx";
import type { Hue } from "../../tokens/tokens.ts";
import { SampleNote } from "../ui/SampleNote.tsx";

type ScreenIntroProps = {
  title: string;
  hero?: string;
  caption?: string;
  lede?: string;
  aside?: string;
  kicker?: string;
  mark?: { hue: Hue; icon: IconName };
  children?: ReactNode;
};

export function ScreenIntro({
  title,
  hero,
  caption,
  lede,
  aside,
  kicker,
  mark,
  children,
}: ScreenIntroProps) {
  const markNode = mark ? (
    <IconWell hue={mark.hue}>
      <Icon name={mark.icon} />
    </IconWell>
  ) : null;

  return (
    <GlassPanel>
      <div className="flex flex-col gap-6">
        <SampleNote />
        {hero !== undefined && caption !== undefined && hero.length > 0 ? (
          <HeroNumber value={hero} caption={caption} />
        ) : null}
        <div className="flex flex-col gap-4">
          {kicker ? (
            <div className="flex items-center gap-4">
              {markNode}
              <p className="text-lg font-bold">{kicker}</p>
            </div>
          ) : null}
          <div className="flex items-center gap-4">
            {kicker ? null : markNode}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight">{title}</h1>
          </div>
          {aside ? <p className="hand">{aside}</p> : null}
          {lede ? <p className="text-lg leading-relaxed">{lede}</p> : null}
          {children}
        </div>
      </div>
    </GlassPanel>
  );
}
