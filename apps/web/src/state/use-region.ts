import { useEffect, useMemo, useState } from "react";
import {
  createStaticTasteSeedProvider,
  groupsForRegion,
  groupsFromProviderSeeds,
  isRegionCode,
  regionFromLocale,
  regionNames,
} from "@long-chair/core";
import type { RegionCode, TasteGroup } from "@long-chair/core";

const REGION_KEY = "long-chair.region";

function storedRegion(): RegionCode | null {
  try {
    const value = localStorage.getItem(REGION_KEY);
    return isRegionCode(value) ? value : null;
  } catch {
    return null;
  }
}

function browserRegion(): RegionCode {
  const locale = navigator.language || Intl.DateTimeFormat().resolvedOptions().locale;
  return storedRegion() ?? regionFromLocale(locale);
}

function rememberRegion(code: RegionCode): void {
  try {
    localStorage.setItem(REGION_KEY, code);
  } catch {
    // Private mode can refuse storage. The choice still lasts for this visit.
  }
}

export function useRegionGroups(): {
  region: RegionCode;
  regionName: string;
  groups: readonly TasteGroup[];
  open: boolean;
  setOpen: (open: boolean) => void;
  choose: (code: RegionCode) => void;
} {
  const [region, setRegion] = useState(browserRegion);
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<readonly TasteGroup[]>(() => groupsForRegion(region));
  const provider = useMemo(() => createStaticTasteSeedProvider(), []);

  useEffect(() => {
    let active = true;
    void provider.seedsFor(region).then((seeds) => {
      if (active) {
        setGroups(groupsFromProviderSeeds(seeds));
      }
    });
    return () => {
      active = false;
    };
  }, [provider, region]);

  function choose(code: RegionCode) {
    setRegion(code);
    rememberRegion(code);
    setOpen(false);
  }

  return { region, regionName: regionNames[region], groups, open, setOpen, choose };
}
