# tenent :
## create tenent 
    url: /tenent
    method: POST 
    body: {
        // TO-DO
    }
    header: {
        Auth: JWT "the admin credintials"
    }
    response: []
## delete tenent
    url: /tenent/:tenentId
    method: DELETE
    header: {
        Auth: JWT "the admin credintials"
    }
    response: []
## get tenents
    url: /tenent
    method: GET
    query: {
        limit: number
        offset: number
        [field: string]: boolean
    }
    header: {
        Auth: JWT "the admin credintials"
    }
    response: []
## get tenent
    url: /tenent/:tenentId
    method: GET
    query: {
        [field: string]: boolean
    }
    header: {
        Auth: JWT "the admin credintials"
    }
    response: []
## update tenent
    url: /tenent/:tenentId
    method: PATCH
    body:{
        // TO-DO
    }
    header: {
        Auth: JWT "the admin credintials"
    }
    response: []
# client:
## create client
    url: /client/:tenentId
    method: POST
    body: {
        // TO-DO
    }
    header: {
        Auth: JWT "the admin credintials"
    }
    response: []
## delete client
    url: /client/:tenentId/:clientId
    method: DELETE
    header: {
        Auth: JWT "the admin credintials"
    }
    response: []
## get clients
    url: /client/:tenentId
    method: GET
    query: {
        limit: number
        offset: number
        [field: string]: boolean
    }
    header: {
        Auth: JWT "the admin credintials"
    }
    response: []
## get client
    url: /client/:tenentId/:clientId
    method: GET
    query: {
        [field: string]: boolean
    }
    header: {
        Auth: JWT "the admin credintials"
    }
    response: []
## update client
    url: /client/:tenentId/:clientId
    method: PATCH
    body: {
        // TO-DO
    }
    header: {
        Auth: JWT "the admin credintials"
    }
    response: []
# subject :
## delete subject
    url: /subject/:tenentId/:clientId/:subjectId
    method: DELETE
    header: {
        Auth: string "client secret"
    }
    response: []
## get subjects
    url: /subject/:tenentId/:clientId
    method: GET
    query: {
        limit: number
        offset: number
        [field: string]: boolean
    }
    header: {
        Auth: string "client secret"
    }
    response: []
## get subject
    url: /subject/:tenentId/:clientId/:subjectId
    method: GET
    query: {
        [field: string]: boolean
    }
    header: {
        Auth: string "client secret"
    }
    response: []
## update subject
    url: /subject/:tenentId/:clientId/:subjectId
    method: PATCH
    body: {
        // TO-DO
    }
    header: {
        Auth: string "client secret"
    }
    response: []
## create subject
    url: /subject/:tenentId/:clientId
    method: POST
    body: {
        // TO-DO
    }
    header: {
        Auth: string "client secret"
    }
    response: []
# log
## get logins
    url: /log/:tenentId/:clientId
    method: GET
    query: {
        limit: number
        offset: number
        [field: string]: boolean
    }
    header: {
        Auth: string "client secret"
    }
    response: []
# auth:
## decrypt code
    url: /auth/:tenentId/:clientId/code
    method: GET
    query: {
        code: string "string"
    }
    header: {
        Auth: string "client secret"
    }
    response:[
        status(200):{
            token: JWT
        }
    ]
## request password reset token
    url: /auth/:tenentId/:clientId/password
    method: POST
    body: {
        account: string
    }
    response: []
## request password reset page
    url: /auth/:tenentId/:clientId/password
    method: GET
    query: {
        token: string "JWT"
    }
    header: null
    response: "a rendered HTML page that'll use the token to reset the PW"
## reset password 
    url: /auth/:tenentId/:clientId/password
    method: PATCH
    body: {
        newPassword: string
    }
    header: {
        auth: JWT
    }
    response: []
## verify login
    url: /auth/:tenentId/:clientId/verify
    method: GET
    query:{
        token : string "verification code"
    }
    header: null
    response: []
## sign out 
    url: /auth/:tenentId/:clientId
    method: PUT
    header: {
        Auth: string "client secret"
    }
    response: []
## request sign-in page
    url: /auth/:tenentId/:clientId
    method: GET
    query:{
        redirectURI: string
        responseType: ResponseType "I'm only supporting `code` "
    }
    response: "a rendered HTML page"
## sign in
    url: /auth/:tenentId/:clientId
    method: POST
    body: {
        account: string
        password: string
    }
    header: null
    response: [
        status(200){ // this response will also store the http-only coockie
            token: JWT 
        }
    ]