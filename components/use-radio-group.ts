import { useCallback, useRef, type KeyboardEvent } from "react";

// Keyboard behaviour for a single-select group built from custom buttons that
// carry role="radio". Gives arrow/Home/End roving where selection follows
// focus, matching the native radiogroup pattern screen-reader and keyboard
// users expect. Pair it with `radioTabIndex` so exactly one option is tabbable.
export function useRadioGroupKeys<T>(
  values: T[],
  currentIndex: number,
  onSelect: (value: T, index: number) => void,
) {
  const containerRef = useRef<HTMLDivElement>(null);

  const focusRadioAt = useCallback((index: number) => {
    const radios =
      containerRef.current?.querySelectorAll<HTMLElement>('[role="radio"]');
    radios?.[index]?.focus();
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const count = values.length;
      if (count === 0) return;

      let nextIndex: number;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % count;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          nextIndex =
            currentIndex < 0 ? count - 1 : (currentIndex - 1 + count) % count;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = count - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      onSelect(values[nextIndex], nextIndex);
      focusRadioAt(nextIndex);
    },
    [values, currentIndex, onSelect, focusRadioAt],
  );

  return { containerRef, onKeyDown };
}

// Roving tabindex: the checked option is the single tab stop; when nothing is
// checked yet, the first option takes the tab stop so the group is reachable.
export function radioTabIndex(
  isChecked: boolean,
  isFirst: boolean,
  anyChecked: boolean,
): 0 | -1 {
  if (anyChecked) return isChecked ? 0 : -1;
  return isFirst ? 0 : -1;
}
