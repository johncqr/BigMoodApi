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
