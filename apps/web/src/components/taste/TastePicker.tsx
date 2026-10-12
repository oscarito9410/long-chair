import { useMemo, useState } from "react";
import {
  commitTypedTaste,
  createFixtureTasteSearch,
  emptyPickCount,
  foldTasteText,
  groupForTaste,
  groupMoreCount,
  previewGroupTastes,
  tasteDisplayName,
  tasteGroups,
  tasteSearchPlaceholder,
  TASTE_MAX,
  toggleTaste,
} from "@long-chair/core";
import type { Hue, TasteEntity, TasteGroup } from "@long-chair/core";
import { Icon } from "../ui/Icon.tsx";
import type { IconName } from "../ui/icon-names.ts";
import { cn } from "../../lib/cn.ts";
import { useTasteQuery } from "./use-taste-query.ts";

type Apply = (ids: readonly string[]) => void;

function chipIcon(taste: TasteEntity): IconName {
  return groupForTaste(taste.id)?.icon ?? taste.icon;
}

function TasteChip({
  label,
  icon,
  hue,
  selected,
  disabled,
  onPress,
}: {
  label: string;
  icon: IconName | null;
  hue: Hue;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      className={cn("taste-chip", `taste-${hue}`, selected && "is-selected")}
      aria-selected={selected}
      disabled={disabled}
      onClick={onPress}
    >
      {selected ? <Icon name="check" /> : icon ? <Icon name={icon} /> : null}
      {label}
    </button>
  );
}

function PickNotes({ ids, onRemove }: { ids: readonly string[]; onRemove: (id: string) => void }) {
  const blanks = emptyPickCount(ids.length);
  return (
    <ul className="taste-picks" aria-label="Your picks">
      {ids.map((id) => {
        const name = tasteDisplayName(id);
        return (
          <li key={id} className="taste-note">
            <span>{name}</span>
            <button
              type="button"
              className="taste-remove"
              aria-label={`Remove ${name}`}
              onClick={() => {
                onRemove(id);
              }}
            >
              <Icon name="x" />
            </button>
          </li>
        );
      })}
      {Array.from({ length: blanks }, (_, index) => (
        <li key={`slot-${index}`} className="taste-slot" aria-hidden="true" />
      ))}
    </ul>
  );
}

function GroupBlock({
  group,
  expanded,
  selectedIds,
  full,
  onToggle,
  onExpand,
}: {
  group: TasteGroup;
  expanded: boolean;
  selectedIds: readonly string[];
  full: boolean;
  onToggle: (id: string) => void;
  onExpand: () => void;
}) {
  const tastes = previewGroupTastes(group, expanded);
  const more = expanded ? 0 : groupMoreCount(group);
  return (
    <section className="taste-group">
      <p className={cn("taste-group-note", `taste-${group.hue}`)}>{group.label}</p>
      <div className="taste-wrap">
        {tastes.map((taste) => {
          const selected = selectedIds.includes(taste.id);
          return (
            <TasteChip
              key={taste.id}
              label={taste.name}
              icon={group.icon}
              hue={group.hue}
              selected={selected}
              disabled={!selected && full}
              onPress={() => {
                onToggle(taste.id);
              }}
            />
          );
        })}
        {more > 0 ? (
          <TasteChip
            label={`+${more} more`}
            icon={null}
            hue={group.hue}
            selected={false}
            disabled={false}
            onPress={onExpand}
          />
        ) : null}
      </div>
    </section>
  );
}

function Suggestions({
  results,
  selectedIds,
  full,
  onToggle,
}: {
  results: readonly TasteEntity[];
  selectedIds: readonly string[];
  full: boolean;
  onToggle: (id: string) => void;
}) {
  if (results.length === 0) {
    return <p className="taste-empty">Nothing matches that yet.</p>;
  }
  return (
    <div className="taste-wrap">
      {results.map((taste) => {
        const selected = selectedIds.includes(taste.id);
        const group = groupForTaste(taste.id);
        const hue: Hue = group?.hue ?? "seaglass";
        return (
          <TasteChip
            key={taste.id}
            label={taste.name}
            icon={chipIcon(taste)}
            hue={hue}
            selected={selected}
            disabled={!selected && full}
            onPress={() => {
              onToggle(taste.id);
            }}
          />
        );
      })}
    </div>
  );
}

function SearchField({
  query,
  onQuery,
  onSubmit,
}: {
  query: string;
  onQuery: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label>
        <span className="visually-hidden">Search tastes</span>
        <input
          className="taste-field"
          value={query}
          placeholder={tasteSearchPlaceholder}
          spellCheck={false}
          enterKeyHint="done"
          onChange={(event) => {
            onQuery(event.target.value);
          }}
        />
      </label>
    </form>
  );
}

export function TastePicker({
  selectedIds,
  footerClearance,
  onApply,
}: {
  selectedIds: readonly string[];
  footerClearance: number;
  onApply: Apply;
}) {
  const port = useMemo(() => createFixtureTasteSearch(), []);
  const { query, setQuery, results, error } = useTasteQuery(port);
  const [open, setOpen] = useState<readonly string[]>([]);
  const full = selectedIds.length >= TASTE_MAX;
  const searching = foldTasteText(query).length >= 2;

  function apply(next: readonly string[]) {
    onApply(next);
  }

  function submit() {
    apply(commitTypedTaste(selectedIds, query));
    setQuery("");
  }

  return (
    <div className="taste-picker">
      <SearchField query={query} onQuery={setQuery} onSubmit={submit} />
      <PickNotes
        ids={selectedIds}
        onRemove={(id) => {
          apply(toggleTaste(selectedIds, id));
        }}
      />
      <div className="love-groups" style={{ paddingBottom: footerClearance }}>
        {error ? (
          <p className="taste-empty" role="alert">
            {error}
          </p>
        ) : null}
        {searching && !error ? (
          <Suggestions
            results={results}
            selectedIds={selectedIds}
            full={full}
            onToggle={(id) => {
              apply(toggleTaste(selectedIds, id));
            }}
          />
        ) : null}
        {searching ? null : (
          <div>
            {tasteGroups.map((group) => (
              <GroupBlock
                key={group.id}
                group={group}
                expanded={open.includes(group.id)}
                selectedIds={selectedIds}
                full={full}
                onToggle={(id) => {
                  apply(toggleTaste(selectedIds, id));
                }}
                onExpand={() => {
                  setOpen((current) => (current.includes(group.id) ? current : [...current, group.id]));
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
