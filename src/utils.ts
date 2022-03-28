const rtf = new Intl.RelativeTimeFormat("en", { style: "narrow" });

export const timeSince = (when: Date | null): string | null => {
  if (when == null) {
    return null;
  }

  let now = Math.floor(Date.now() / 1000);
  let then = Math.floor(when.getTime() / 1000);
  let secs = now - then;
  let mins = Math.floor(secs / 60);

  if (mins < 1) {
    return rtf.format(-secs, "second");
  }

  return rtf.format(-mins, "minute");
};
