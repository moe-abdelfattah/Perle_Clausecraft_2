/**
 * Plays a futuristic click sound effect for UI interactions.
 * Finds the pre-loaded audio element and plays it.
 * Resets the sound's current time to allow for rapid, successive clicks.
 */
export const playClickSound = () => {
  const sound = document.getElementById('click-sound') as HTMLAudioElement;
  if (sound) {
    sound.volume = 0.25;
    sound.currentTime = 0; // Allows the sound to be re-triggered quickly
    const playPromise = sound.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // This is common if the user hasn't interacted with the page recently.
        // We log a warning instead of a breaking error.
        console.warn("Click sound playback failed:", error);
      });
    }
  }
};