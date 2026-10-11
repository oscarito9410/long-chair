import type { ReactNode } from "react";
import { GlassPanel } from "../glass/GlassPanel.tsx";
import type { IconName } from "../ui/icon-names.ts";
import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";
import { HeroNumber } from "../ui/HeroNumber.tsx";
import type { Hue } from "../../tokens/tokens.ts";

type ScreenIntroProps = {
  hero: string;
  caption: string;
  title: string;
  lede?: string;
  aside?: string;
  mark?: { hue: Hue; icon: IconName };
  children?: ReactNode;
};

export function ScreenIntro({
  hero,
  caption,
  title,
  lede,
  aside,
  mark,
  children,
}: ScreenIntroProps) {
  return (
    <GlassPanel>
      <div className="flex flex-col gap-6">
        <HeroNumber value={hero} caption={caption} />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {mark ? (
              <IconWell hue={mark.hue}>
                <Icon name={mark.icon} />
              </IconWell>
            ) : null}
            <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
          </div>
          {aside ? <p className="hand">{aside}</p> : null}
          {lede ? <p className="text-lg leading-relaxed">{lede}</p> : null}
          {children}
        </div>
      </div>
    </GlassPanel>
  );
}
