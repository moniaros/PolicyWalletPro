// Touch and gesture handling utilities for mobile
export interface TouchGesture {
  type: "tap" | "long-press" | "swipe-left" | "swipe-right" | "swipe-up" | "swipe-down" | "pinch";
  element: HTMLElement;
  distance?: number;
  angle?: number;
}

const LONG_PRESS_DURATION = 500;
const SWIPE_THRESHOLD = 50;
const PINCH_THRESHOLD = 0.1;

export function enableSwipeGesture(
  element: HTMLElement,
  onSwipe: (direction: "left" | "right" | "up" | "down") => void
) {
  let startX = 0;
  let startY = 0;

  element.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  element.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > SWIPE_THRESHOLD) {
        onSwipe("left");
      } else if (diffX < -SWIPE_THRESHOLD) {
        onSwipe("right");
      }
    } else {
      if (diffY > SWIPE_THRESHOLD) {
        onSwipe("up");
      } else if (diffY < -SWIPE_THRESHOLD) {
        onSwipe("down");
      }
    }
  });
}

export function enableLongPress(element: HTMLElement, onLongPress: () => void) {
  let pressTimer: NodeJS.Timeout;

  element.addEventListener("touchstart", () => {
    pressTimer = setTimeout(() => {
      onLongPress();
    }, LONG_PRESS_DURATION);
  });

  element.addEventListener("touchend", () => {
    clearTimeout(pressTimer);
  });

  element.addEventListener("touchmove", () => {
    clearTimeout(pressTimer);
  });
}

export function enablePinchZoom(
  element: HTMLElement,
  onPinch: (scale: number) => void
) {
  let initialDistance = 0;

  element.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );

      if (initialDistance === 0) {
        initialDistance = distance;
      } else {
        const scale = distance / initialDistance;
        if (Math.abs(scale - 1) > PINCH_THRESHOLD) {
          onPinch(scale);
        }
      }
    }
  });

  element.addEventListener("touchend", () => {
    initialDistance = 0;
  });
}

// Vibration feedback for mobile interactions
export function vibrate(pattern: number | number[] = 50) {
  if ("vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn("Vibration API not supported");
    }
  }
}

// Haptic feedback for iOS
export function hapticFeedback(intensity: "light" | "medium" | "heavy" = "medium") {
  if ("HapticFeedback" in window) {
    try {
      (window as any).HapticFeedback.perform(intensity);
    } catch (error) {
      console.warn("Haptic feedback not available");
    }
  }
}
