const MOODS = new Set(['SAD', 'NEUTRAL', 'HAPPY']);

module.exports = {
  isValidMood: function (mood) {
    return MOODS.has(mood);
  }
}