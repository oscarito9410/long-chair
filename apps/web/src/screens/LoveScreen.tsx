import { useCallback, useEffect, useRef, useState } from "react";
import {
  canContinueTastes,
  loveFooterMeta,
  loveLede,
  regionCodes,
  regionMenuLabel,
  regionNames,
  sampleKitInstead,
  tasteContinueLabel,
  tasteDisplayName,
  tasteNeedMore,
} from "@long-chair/core";
import { TastePicker } from "../components/taste/TastePicker.tsx";
import { Icon } from "../components/ui/Icon.tsx";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";
import { useRegionGroups } from "../state/use-region.ts";

const FOOTER_FALLBACK = 180;
const LOVE_STEP = "1 of 4";
const LOVE_DOTS = [0, 1, 2, 3] as const;

function pickNotice(ids: readonly string[]): string {
  const names = ids.map((id) => tasteDisplayName(id));
  const list = names.length > 0 ? names.join(", ") : "No tastes yet";
  return `${list}. ${tasteContinueLabel(ids.length)}.`;
}

function bumped(previous: string, message: string): string {
  return previous.endsWith("\u200b") ? message : `${message}\u200b`;
}

function sameIds(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

function useBoxHeight(fallback: number) {
  const [height, setHeight] = useState(fallback);
  const observer = useRef<ResizeObserver | null>(null);

  const setNode = useCallback((node: HTMLElement | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!node) {
      return;
    }
    const measure = () => {
      const next = Math.ceil(node.getBoundingClientRect().height);
      setHeight((current) => (current === next ? current : next));
    };
    measure();
    const nextObserver = new ResizeObserver(measure);
    nextObserver.observe(node);
    observer.current = nextObserver;
  }, []);

  useEffect(() => {
    return () => {
      observer.current?.disconnect();
    };
  }, []);

  return [height, setNode] as const;
}

function LoveMark() {
  return (
    <span className="love-mark">
      love
      <svg className="love-underline" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M2 8 C 18 3, 36 11, 58 6 C 78 2, 96 10, 118 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function LoveHeader() {
  return (
    <header className="love-header">
      <div className="love-nav">
        <a className="love-back" href={paths.welcome} aria-label="Back">
          <Icon name="arrow" />
        </a>
        <ol className="step-dots" aria-label={LOVE_STEP}>
          {LOVE_DOTS.map((dot) => (
            <li key={dot}>
              <span className={dot === 0 ? "step-dot is-current" : "step-dot"} />
            </li>
          ))}
        </ol>
        <span className="love-back" aria-hidden="true" />
      </div>
      <h1 className="love-title">
        What do you <LoveMark />?
      </h1>
      <p className="love-lede">{loveLede}</p>
    </header>
  );
}

function LoveFooter({
  label,
  ready,
  onContinue,
  onSample,
  setNode,
}: {
  label: string;
  ready: boolean;
  onContinue: () => void;
  onSample: () => void;
  setNode: (node: HTMLElement | null) => void;
}) {
  return (
    <div className="love-footer" ref={setNode}>
      <div className="love-fade" aria-hidden="true" />
      <div className="love-bar">
        <button
          type="button"
          className={ready ? "love-continue is-ready" : "love-continue is-waiting"}
          aria-disabled={ready ? undefined : true}
          onClick={onContinue}
        >
          {label}
        </button>
        <button type="button" className="love-sample" onClick={onSample}>
          {sampleKitInstead}
        </button>
        <p className="love-meta">{loveFooterMeta}</p>
      </div>
    </div>
  );
}

export function LoveScreen() {
  const { draft, setSeeds, reset } = useSession();
  const region = useRegionGroups();
  const [footerHeight, setFooterNode] = useBoxHeight(FOOTER_FALLBACK);
  const [notice, setNotice] = useState("");
  const count = draft.seedIds.length;
  const ready = canContinueTastes(count);

  function apply(next: readonly string[]) {
    if (sameIds(next, draft.seedIds)) {
      return;
    }
    setSeeds(next);
    setNotice(pickNotice(next));
  }

  return (
    <div className="love-step" data-screen="love">
      <LoveHeader />
      <TastePicker
        selectedIds={draft.seedIds}
        footerClearance={footerHeight}
        onApply={apply}
        groups={region.groups}
        regionName={region.regionName}
        onOpenRegion={() => {
          region.setOpen(true);
        }}
      />
      {region.open ? (
        <div className="region-sheet" role="dialog" aria-label={regionMenuLabel}>
          <ul className="region-list">
            {regionCodes.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  className="region-option"
                  aria-pressed={code === region.region}
                  onClick={() => {
                    region.choose(code);
                  }}
                >
                  {regionNames[code]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <LoveFooter
        label={tasteContinueLabel(count)}
        ready={ready}
        setNode={setFooterNode}
        onSample={() => {
          reset();
          window.location.hash = paths.kit;
        }}
        onContinue={() => {
          if (!ready) {
            setNotice((current) => bumped(current, tasteNeedMore(count)));
            return;
          }
          window.location.hash = paths.chair;
        }}
      />
      <p className="visually-hidden" role="status">
        {notice}
      </p>
    </div>
  );
}
