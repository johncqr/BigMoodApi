# BigMoodApi

This is the backend API for Big Mood. See [frontend here](https://github.com/NeilTCox/BigMood "BigMood Github Repo").

# File Explanations

* `libs/` : Helper functions.
    - `enums.js` : Defines moods.
    - `recsys.js` : Functions that generate user models / context and recommendations.
* `models/` : MongoDB database models.
    - `day.js` : Day and health information associated.
    - `event.js` : Lists of logged events per day.
    - `eventMeta.js` : Event scoring information.
    - `profile.js` : User goal info and overall mood.
    - `user.js` : User authentication information.
* `routes/` : Defines API routes for the app. See `API Docs` section for detailed usage information.
    - `day.js` : Logging, editing days.
    - `events.js` : Logging, editing events.
    - `users.js` : Creating, authenticating users.
    - `index.js` : Boilerplate code. Unused.
* `package.json` : List of packages used in project. Required for setup.

* `bin/` : Boilerplate code to run app.
* `views/` : Boilerplate code. Unused since frontend is separate.
* `public/` : Boilerplate code. Unused since frontend is separate.


# Project Setup
1. Setup MongoDB on your local machine.
2. Run `yarn install` in the root of the project directory.
3. Run `mongod` in a command prompt (run a local MongoDB server).
4. Open another command prompt and run `yarn start` in the root of the project directory. By default, the server runs on `localhost:3000`.

# API Docs (for developers)

All requests and responses are in JSON format.

## Users
`User` Object
```
{
    email: String,
    password: String,
    firstName: String,
    lastName: String
}
```

`GET /users`\
Returns a list of all users.\
Response:
```
{
    users: [ User ],
}
```

`POST /users/create`\
Creates a new user, returns the created user if successful.\
Request: `User`\
Response: `User`

`POST /users/login`\
Authenticates a user, returns the user if successful.\
Request:
```
{
    email: String,
    password: String,
}
```
Response: `User`

`POST /users/onboard`\
Onboards a user, returns a user profile if successful.\
Request:
```
{
    mood: String ("SAD", "NEUTRAL", "HAPPY"),
    goal: String,
    events: String (comma seperated),
    email: String
}
```
Response:
```
{
    mood: String ("SAD", "NEUTRAL", "HAPPY"),
    goal: String,
}
```

## Events
`GET /events/suggestions`\
Returns a list of ranked events events. MUST add `email: String` query parameter.\
Params: `email: String`\
Response:
```
{
    eventSuggestions: [ { name: String, happyScore: Int } ],
}
```

`POST /events/create`\
Creates a new event, returns the current events of the day if successful.\
Request:\
```
{
    email: String,
    mood: String,
    name: String,
    date: Date

}
```
Response:
```
{
    logs: [ { name: String, mood: String } ],
    date: Date
}
```

## Days
`Health` Object
```
{
    steps: Int,
    sleep: Int
}
```

`Day` Object
```
{
    mood: String ("SAD", "NEUTRAL", "HAPPY"),
    date: String (format: YYYY-MM-DD 2015-03-25)
    info: Health
}
```

`GET /days`\
Returns a list of all days. MUST add `email: String` query parameter. Can add optional `mood: String` parameter to filter moods. Can add optional `month: Integer` AND `year: Integer` parameters to filter specific month.\
Params: `email: String`\
Response:
```
{
    days: [ Day ],
}
```

`GET /days/log`\
Returns health data and events that happened on a specific date. MUST add `date: String (2019-03-23)` param.
Response:
```
{
    log: Health,
    events: [ Event ]
}
```

`POST /days/create`\
Creates a new day, returns the created day if successful. MUST add an extra email property to the request `Day` body\
Request: `Day + email: String`\
Response: `Day`

`POST /days/health`\
Updates the health of an existing day, returns the updated day.\
Request:
```
{
    date: String,
    info: Health
}
```
Response: `Day`

## Testing Routes

`POST /fluke`\
Clears and fills database with dummy data.\
Request:
```
{}
```
Response:
```
{}
```
