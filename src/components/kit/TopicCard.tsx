import { Icon } from "../ui/Icon.tsx";
import { IconWell } from "../ui/IconWell.tsx";

export function TopicCard({ title, prompt }: { title: string; prompt: string }) {
  return (
    <article className="pastel-card flex flex-col gap-4 rounded-card p-6 wash-seaglass">
      <IconWell hue="seaglass">
        <Icon name="chat" />
      </IconWell>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-lg leading-relaxed">{prompt}</p>
    </article>
  );
}
