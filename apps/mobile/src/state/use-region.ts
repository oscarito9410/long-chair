import { useEffect, useMemo, useState } from "react";
import { getLocales } from "expo-localization";
import * as SecureStore from "expo-secure-store";
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

function deviceRegion(): RegionCode {
  try {
    const locales = getLocales();
    const tag = locales.length > 0 ? locales[0].languageTag : undefined;
    return regionFromLocale(tag);
  } catch {
    return "GLOBAL";
  }
}

async function storedRegion(): Promise<RegionCode | null> {
  try {
    const value = await SecureStore.getItemAsync(REGION_KEY);
    return isRegionCode(value) ? value : null;
  } catch {
    return null;
  }
}

async function rememberRegion(code: RegionCode): Promise<void> {
  try {
    await SecureStore.setItemAsync(REGION_KEY, code);
  } catch {
    // The native store can be missing in a browser preview. The choice stays in memory.
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
  const [region, setRegion] = useState(deviceRegion);
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<readonly TasteGroup[]>(() => groupsForRegion(region));
  const provider = useMemo(() => createStaticTasteSeedProvider(), []);

  useEffect(() => {
    let active = true;
    void storedRegion().then((saved) => {
      if (active && saved) {
        setRegion(saved);
      }
    });
    return () => {
      active = false;
    };
  }, []);

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
    void rememberRegion(code);
    setOpen(false);
  }

  return { region, regionName: regionNames[region], groups, open, setOpen, choose };
}
