# backend-server

## Authentication API Details

### `Model schema`

{
name: {
type: String,
required: true,
},
email: {
type: String,
required: true,
unique: true,
},
password: {
type: String,
required: true,
},
date: {
type: Date,
default: Date.now,
},
}

### `Auth API List`

1. Get => /api/auth

Description: validate the user whether logged in or not check and Load user.

2. Post => api/auth

Input: {email, password}
Description: Authenticate user & get token.

3. POST api/users

Input: { name, email, password }

Description: Regiser user

## Post API Details

### `Model schema`

{
user: {
type: Schema.Types.ObjectId,
ref: "users",
},
name: {
type: String,
},
firstName: {
type: String,
required: true,
},
lastName: {
type: String,
required: true,
},
email: {
type: String,
required: true,
},
country: {
type: String,
required: true,
},
phone: {
type: String,
required: true,
},
job: {
type: String,
required: true,
},
gender: {
type: String,
required: true,
},
company: {
type: String,
required: true,
},
salary: {
type: String,
required: true,
},
address: {
type: String,
required: true,
},
city: {
type: String,
required: true,
},
state: {
type: String,
required: true,
},
pin: {
type: String,
required: true,
},
date: {
type: Date,
default: Date.now,
},
}

### `Auth API List`

1. POST api/posts

Description: Create a post

2. GET api/posts

Description: Get all posts

3. PUT api/posts/search/:key

Description: Search key return result

4. GET api/posts/:id

Description: Get all posts

5. DELETE api/posts/:id

Description: Delete post

6. PUT api/posts/:id

Description: update post record
