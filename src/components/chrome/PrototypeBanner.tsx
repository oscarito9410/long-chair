import { Specular } from "../glass/Specular.tsx";

export function PrototypeBanner() {
  return (
    <p className="glass relative mb-8 overflow-hidden rounded-full px-4 py-2 text-center text-lg font-bold">
      <Specular />
      <span className="relative">Fictional sample · nothing is sent</span>
    </p>
  );
}
