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
    date: String (format: YYYY-MM-DD ex: 2015-03-25)
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
    date: String (format: YYYY-MM-DD 2015-03-25)
}
```

`GET /days`\
Returns a list of all days. MUST add `email: String` query parameter. Can add optional `mood: String` parameter to filter moods. Can add optional `month: Integer` AND `year: Integer` parameters to filter specific month.\
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
