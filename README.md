# BigMoodApi

JSON lol

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

## Events
`Event` Object
```
{
    name: String,
    desc: String,
    mood: String ("SAD", "NEUTRAL", "HAPPY),
    startDate: String (format: YYYY-MM-DDTHH:MM:SSZ ex: 2015-03-25T12:00:00Z)
}
```

`GET /events`\
Returns a list of all events. MUST add `email` query parameter. Can add optional `mood` parameter to filter moods.\
Response:
```
{
    events: [ Event ],
}
```

`POST /events/create`\
Creates a new event, returns the created event if successful. MUST add an extra email property to the request `Event` body\
Request: `Event`\
Response: `Event`

## Days
`Day` Object
```
{
    mood: String ("SAD", "NEUTRAL", "HAPPY),
    date: String (format: YYYY-MM-DDTHH:MM:SSZ ex: 2015-03-25T12:00:00Z)
}
```

`GET /days`\
Returns a list of all days. MUST add `email` query parameter. Can add optional `mood` parameter to filter moods.\
Response:
```
{
    days: [ Day ],
}
```

`POST /days/create`\
Creates a new day, returns the created day if successful. MUST add an extra email property to the request `Day` body\
Request: `Day`\
Response: `Day`
