const Day = require('../models/day');
const Profile = require('../models/profile');

function addContextTotal(totalContext, newContext) {
  totalContext.totals.sleep += newContext.sleep;
  totalContext.totals.steps += newContext.steps;
  totalContext.count += 1;
}

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

module.exports = { generateContext }