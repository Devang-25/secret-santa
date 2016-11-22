# Secret Santa as a Service
A simple REST API for the popular gift exchanging game "Secret Santa".

###Features
+ Provide a list of people, and get a list of randomized pairings back.
+ Supports disallowed pairings in order to prevent certain people from getting paired.
+ Can send customizable emails to each person in the list.

###Installation
+ Run `npm install` to install dependencies
+ Enter your MailGun api key and domain in `config.js`. (If you don't have an account, [MailGun](https://mailgun.com) is free and easy to set up!)
+ Start the app on `localhost:3000` by running `npm start`

##Base URL
The base url is the API version, currently `/v1`

**POST: /match**
----
  _Generates and returns a random match result. Does not send emails. This can be used to test your list before calling `/send`._
* **Request parameters**
    + `list`: an array of people
        + `name`: The name of the person. Required.
        + `exclusions`: (Optional) An array of names representing people that should be ignored when assigning a match to this person.
    + `retryCount`: number of times to attempt to match. Defaults to 100. _Note: You should not have to change this unless you have large lists with complex exclusion rules_
* **Example Call:**
    ~~~~
    POST /v1/match
    Content-Type: application/json

    {
    "list": [{
            "name": "Jack",
            "exclusions": ["Jill"],
         }, {
            "name": "Jill",
         }, {
            "name": "Fred",
        }]
    }
    ~~~~
* **Success Response:**
  **Code:** 200 <br />
  **Content:** The response will return the provided list with a new `match` field representing the giftee.
    ~~~~
    [{
        "name": "Jack",
        "exclusions": ["Jill"],
        "match": "Fred"
     }, {
        "name": "Jill",
        "match": "Jack"
     }, {
        "name": "Fred",
        "match": "Jill"
    }]
    ~~~~

* **Error Responses:**

  **Code:** 400  <br />
  **Reason:** Your list is missing, has less than two people, or has duplicate names.

  **Code:** 409  <br />
  **Reason:** Could not generate a match. Try increasing the `retryCount` parameter or removing some exclusion rules.

**POST: /send**
----
  _Generates a random match result and sends emails to each person in the list._
* **Request parameters**
    + `list`: an array of people
        + `name`: The name of the person. Required.
        + `email`: (Optional) The email address for this person. If not provided, an email will not be sent.
        + `exclusions`: (Optional) An array of names representing people that should be ignored when assigning a match to this person.
    + `retryCount`: number of times to attempt to match. Defaults to 100. _Note: You should not have to change this unless you have large lists with complex exclusion rules_
    + `subject`: (Optional) The subject of the email to be sent. Defaults to `Your "Secret Santa" match'` if not provided.
    + `message`: (Optional) The message of the email to be sent. Use `{{name}}` to insert the name of the match into the message. Defaults to `Your Secret Santa match is {{name}}!` if not provided.
* **Example Call:**
    ~~~~
    POST /v1/send
    Content-Type: application/json

    {
    "subject": "Your Secret Santa victim awaits...",
    "message": "Your match is {{name}}! The price limit for gifts is $50.",
    "list": [{
            "name": "Jack",
            "email": "jack@abc123.com"
            "exclusions": ["Jill"],
         }, {
            "name": "Jill",
            "email": "jill@abc123.com"
         }, {
            "name": "Fred",
            "email": "fred@abc123.com"
        }]
    }
    ~~~~
* **Success Response:**
  **Code:** 200 <br />
  **Content:** `Emails sent successfully`.

* **Error Responses:**

  **Code:** 400  <br />
  **Reason:** Your list is missing, has less than two people, or has duplicate names.

  **Code:** 409  <br />
  **Reason:** Could not generate a match. Try increasing the `retryCount` parameter or removing some exclusion rules.

  **Code:** 503  <br />
  **Reason:** An error occurred trying to send the emails. This could be an issue with MailGun configuration.


