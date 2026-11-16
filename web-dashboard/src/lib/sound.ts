const KEY = "order-sound";
let audioContext: AudioContext | null = null;

export function readSoundPreference(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function saveSoundPreference(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // the preference is optional
  }
}

export function playNotification() {
  try {
    const ctx = (audioContext ??= new AudioContext());
    void ctx.resume();
    const now = ctx.currentTime;

    [880, 1175].forEach((frequency, index) => {
      const start = now + index * 0.18;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);

      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.32);
    });
  } catch {
    // sound is optional
  }
}