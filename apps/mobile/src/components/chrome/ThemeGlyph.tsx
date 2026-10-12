import Svg, { Circle, G, Path, Rect } from "react-native-svg";

import { palette } from "../../theme/palette";

export type ThemeGlyphName =
  "thermometer" | "hospital" | "ribbon" | "flower" | "wreath" | "door" | "slip";

const INK = palette.ink;

export function ThemeGlyph({ name, size = 22 }: { name: ThemeGlyphName; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Glyph name={name} />
    </Svg>
  );
}

function Glyph({ name }: { name: ThemeGlyphName }) {
  switch (name) {
    case "thermometer":
      return (
        <>
          <Path d="M12 3v11" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <Circle cx={12} cy={17.5} r={3.2} fill={INK} />
        </>
      );
    case "hospital":
      return (
        <>
          <Path d="M5 20V8l7-4 7 4v12H5z" fill="none" stroke={INK} strokeWidth={1.8} />
          <Path d="M12 10v6M9 13h6" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        </>
      );
    case "ribbon":
      return (
        <Path
          d="M8 4c2 3 2 5 0 7 2 0 4 0 6 0-2-2-2-4 0-7-2 2-4 2-6 0zM8 11l-2 9 4-3 2 3 2-3 4 3-2-9"
          fill={INK}
        />
      );
    case "flower":
      return (
        <>
          <Circle cx={12} cy={9} r={2} fill={INK} />
          <Circle cx={8} cy={11} r={2} fill={INK} />
          <Circle cx={16} cy={11} r={2} fill={INK} />
          <Circle cx={10} cy={14} r={2} fill={INK} />
          <Circle cx={14} cy={14} r={2} fill={INK} />
          <Path d="M12 16v5" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </>
      );
    case "wreath":
      return (
        <>
          <Circle cx={12} cy={11} r={5} fill="none" stroke={INK} strokeWidth={1.8} />
          <Path d="M10 16l2 4 2-4" fill={INK} />
        </>
      );
    case "door":
      return (
        <>
          <G transform="translate(6 3)">
            <Rect width={12} height={18} rx={1.5} fill="none" stroke={INK} strokeWidth={1.8} />
          </G>
          <Circle cx={15} cy={12} r={1.1} fill={INK} />
        </>
      );
    case "slip":
      return <Path d="M7 3h7l3 3v15H7V3zm7 0v3h3" fill="none" stroke={INK} strokeWidth={1.8} />;
  }
}
