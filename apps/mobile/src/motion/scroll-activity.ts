import { makeMutable, useAnimatedScrollHandler } from "react-native-reanimated";

export const scrollActive = makeMutable(0);

export function usePauseWhileScrolling() {
  return useAnimatedScrollHandler({
    onBeginDrag: () => {
      scrollActive.value = 1;
    },
    onScroll: () => {
      scrollActive.value = 1;
    },
    onEndDrag: (event) => {
      if (!event.velocity || event.velocity.y === 0) {
        scrollActive.value = 0;
      }
    },
    onMomentumEnd: () => {
      scrollActive.value = 0;
    },
  });
}
