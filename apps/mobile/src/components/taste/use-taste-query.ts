import { useEffect, useState } from "react";
import { foldTasteText, TASTE_SEARCH_DEBOUNCE_MS } from "@long-chair/core";
import type { PlanSource, TasteEntity, TasteSearchPort } from "@long-chair/core";

const SEARCH_FAILED = "Search is unavailable. The chips below still work.";

export function useTasteQuery(port: TasteSearchPort) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<readonly TasteEntity[]>([]);
  const [source, setSource] = useState<PlanSource>("fixture");
  const [error, setError] = useState<string | null>(null);

  function updateQuery(value: string) {
    setQuery(value);
    if (foldTasteText(value).length < 2) {
      setResults([]);
      setError(null);
    }
  }

  useEffect(() => {
    if (foldTasteText(query).length < 2) {
      return;
    }
    let active = true;
    const handle = setTimeout(() => {
      void port.search(query).then(
        (found) => {
          if (!active) {
            return;
          }
          setResults(found.tastes);
          setSource(found.source);
          setError(null);
        },
        () => {
          if (!active) {
            return;
          }
          setResults([]);
          setError(SEARCH_FAILED);
        },
      );
    }, TASTE_SEARCH_DEBOUNCE_MS);
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [port, query]);

  return { query, setQuery: updateQuery, results, source, error };
}
