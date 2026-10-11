import { useMemo } from "react";
import {
  createFixtureTasteSearch,
  foldTasteText,
  quickStartTastes,
  sampleShelfNote,
  TASTE_MAX,
  tasteById,
  tastePickLabel,
  tasteSearchPlaceholder,
} from "@long-chair/core";
import type { Hue, TasteEntity } from "@long-chair/core";
import { Icon } from "../ui/Icon.tsx";
import { cn } from "../../lib/cn.ts";
import { useTasteQuery } from "./use-taste-query.ts";

const CHIP_HUES = ["honey", "apricot", "seaglass", "wisteria"] as const;

type Toggle = (id: string) => void;

function hueAt(index: number): Hue {
  return CHIP_HUES[index % CHIP_HUES.length] ?? "honey";
}

function tasteName(id: string): string {
  return tasteById(id)?.name ?? id;
}

function TasteResults({
  results,
  selectedIds,
  full,
  onToggle,
}: {
  results: readonly TasteEntity[];
  selectedIds: readonly string[];
  full: boolean;
  onToggle: Toggle;
}) {
  if (results.length === 0) {
    return <p className="text-base">Nothing matches that yet.</p>;
  }
  return (
    <ul className="taste-results">
      {results.map((taste) => {
        const selected = selectedIds.includes(taste.id);
        return (
          <li key={taste.id}>
            <button
              type="button"
              className="taste-result"
              aria-pressed={selected}
              disabled={!selected && full}
              onClick={() => {
                onToggle(taste.id);
              }}
            >
              <Icon name={taste.icon} />
              <span className="min-w-0">
                <span className="block text-lg font-bold">{taste.name}</span>
                <span className="block text-base text-ink-soft">{taste.detail}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function QuickStarts({
  selectedIds,
  full,
  onToggle,
}: {
  selectedIds: readonly string[];
  full: boolean;
  onToggle: Toggle;
}) {
  return (
    <div className="taste-wrap" role="group" aria-label="Quick starts">
      {quickStartTastes.map((taste, index) => {
        const selected = selectedIds.includes(taste.id);
        return (
          <button
            key={taste.id}
            type="button"
            className={cn("taste-chip", `taste-${hueAt(index)}`, selected && "is-selected")}
            aria-pressed={selected}
            disabled={!selected && full}
            onClick={() => {
              onToggle(taste.id);
            }}
          >
            <Icon name={taste.icon} />
            {taste.name}
            {selected ? (
              <span className="taste-check">
                <Icon name="check" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function SelectedPills({ selectedIds, onToggle }: { selectedIds: readonly string[]; onToggle: Toggle }) {
  if (selectedIds.length === 0) {
    return null;
  }
  return (
    <ul className="taste-wrap" aria-label="Selected tastes">
      {selectedIds.map((id) => (
        <li key={id}>
          <button
            type="button"
            className="taste-pill"
            aria-label={`Remove ${tasteName(id)}`}
            onClick={() => {
              onToggle(id);
            }}
          >
            {tasteName(id)}
            <Icon name="x" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function TastePicker({
  selectedIds,
  onToggle,
}: {
  selectedIds: readonly string[];
  onToggle: Toggle;
}) {
  const port = useMemo(() => createFixtureTasteSearch(), []);
  const { query, setQuery, results, source, error } = useTasteQuery(port);
  const full = selectedIds.length >= TASTE_MAX;
  const searching = foldTasteText(query).length >= 2;

  return (
    <div className="taste-picker">
      {source === "live" ? null : <p className="sample-tag text-base font-bold">{sampleShelfNote}</p>}
      <label className="taste-search">
        <span className="visually-hidden">Search tastes</span>
        <input
          className="taste-field"
          value={query}
          placeholder={tasteSearchPlaceholder}
          spellCheck={false}
          enterKeyHint="search"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
      </label>
      {error ? (
        <p className="text-base" role="alert">
          {error}
        </p>
      ) : null}
      {searching && !error ? (
        <TasteResults results={results} selectedIds={selectedIds} full={full} onToggle={onToggle} />
      ) : null}
      <p className="text-base font-bold">Or start here</p>
      <QuickStarts selectedIds={selectedIds} full={full} onToggle={onToggle} />
      <SelectedPills selectedIds={selectedIds} onToggle={onToggle} />
      <p className="text-base font-bold" role="status">
        {tastePickLabel(selectedIds.length)}
      </p>
    </div>
  );
}
