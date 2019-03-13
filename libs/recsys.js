const Day = require('../models/day');
const Profile = require('../models/profile');
const EventMeta = require('../models/eventMeta');

function addContextTotal(totalContext, newContext) {
  totalContext.totals.sleep += newContext.sleep;
  totalContext.totals.steps += newContext.steps;
  totalContext.count += 1;
}

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

// Generates typical days
async function generateContext(userId) {
  return Day.find({ userId })
    .then((days) => {
      let context = {}
      for (let i = 0; i <= 6; ++i) {
        let contextObj = {}
        for (const mood of ['SAD', 'HAPPY', 'NEUTRAL']) {
          contextObj[mood] = {
            totals: {
              sleep: 0,
              steps: 0
            },
            count: 0
          }
        }
        context[i] = contextObj;
      }
      for (d of days) {
        addContextTotal(context[d.date.getDay()][d.mood], d.info);
      }
      console.log(context);
      return Profile.findOneAndUpdate({ userId }, { context })
    });
}

async function determineActivitySuggestions(userId, day, latestInfo, mood) {
  if (mood === 'HAPPY') {
    return { suggestions: ["You're happy!"] }
  }
  let profile = await Profile.findOne({ userId });
  let context = profile.context
  if (isEmpty(context)) {
    context = await generateContext(userId)
  }
  const healthInfo = context[day]['HAPPY']
  const stepsDif = latestInfo.steps - (healthInfo.totals.steps / healthInfo.count)
  const sleepDif = latestInfo.sleep - (healthInfo.totals.sleep / healthInfo.count)
  let suggestions = []
  console.log(latestInfo);
  console.log(healthInfo);
  console.log(stepsDif);
  if (stepsDif < 0) {
    suggestions.push(`You should walk more! Maybe ${-stepsDif} more steps.`);
  }
  if (sleepDif < 0) {
    suggestions.push(`You should sleep more! Maybe ${-sleepDif} more hours.`);
  }
  if (suggestions.length === 0) {
    suggestions.push('What would have made your day better? Write about it in an event!');
  }
  return { activitySuggestions: suggestions }
}

async function determineEventSuggestions(userId, mood) {
  const eventMetas = await EventMeta.find({ userId }).sort('-happyScore').limit(5).exec();
  return { eventSuggestions: eventMetas }
}

function morphEventString(name) {
  return name.trim();
}

module.exports = { generateContext, determineActivitySuggestions,
  determineEventSuggestions, morphEventString }
