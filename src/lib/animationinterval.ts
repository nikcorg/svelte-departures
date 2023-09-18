// Original from: https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95

// Timeline.currentTime is typed as CSSNumberish, but the spec(1) says that currentTime will be
// a milliseconds value or null.
// (1) https://developer.mozilla.org/en-US/docs/Web/API/AnimationTimeline/currentTime
type NullableNumber = number | null;

export function animationInterval(ms: number, signal: AbortSignal, callback: (_: number) => void) {
  // Prefer currentTime, as it'll better sync animations queued in the
  // same frame, but if it isn't supported, performance.now() is fine.
  const start = (document?.timeline?.currentTime as NullableNumber) ?? performance.now() ?? 0;

  function frame(time: number) {
    if (signal.aborted) return;
    callback(time);
    scheduleFrame(time);
  }

  function scheduleFrame(time: number) {
    const elapsed = time - start;
    const roundedElapsed = Math.round(elapsed / ms) * ms;
    const targetNext = start + roundedElapsed + ms;
    const delay = targetNext - performance.now();
    setTimeout(() => requestAnimationFrame(frame), delay);
  }

  scheduleFrame(start);
}
