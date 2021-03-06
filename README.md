# Secret Santa as a Service
A simple REST API for the popular gift exchanging game "Secret Santa".

**Live Demo**: [secretsanta.mattgmade.me](http://secretsanta.mattgmade.me)

###Features
+ Provide a list of people, and get a list of randomized pairings back.
+ Supports disallowed pairings in order to prevent certain people from getting paired.
+ Can send customizable emails to each person in the list announcing their Secret Santa pairing.
+ You can also randomize partial lists by preselecting certain pairings, if that's something you're in to.

###Installation
+ Run `npm install` to install dependencies
+ Enter your MailGun api key and domain in `config.js`. (If you don't have an account, [MailGun](https://mailgun.com) is free and easy to set up)
+ Start the app on `localhost:3000` by running `npm start`

##Base URL
The base url is the API version, currently `/v1`

**OPTIONS**
----
An OPTIONS request can be sent to **all endpoints** for detailed documentation of the endpoint in JSON.

**POST: /match**
----
  Generates and returns a random match result. Does not send emails. This can be used to test your list before calling `/send`.
* **Request parameters**
    + `list`: an array of people
        + `name`: The name of the person. Required.
        + `email`: (Optional) The email address for this person.
        + `exclusions`: (Optional) An array of names representing people that should be ignored when assigning a match to this person.
        + `match`: (Optional) A name representing a preselected match for this person.
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
    {
        list: [{
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
    }
    ~~~~

* **Error Responses:**

  **Code:** 400  <br />
  **Reason:** Your request is malformed, or your list is missing, or has less than two people, or has duplicate names.

  **Code:** 409  <br />
  **Reason:** Could not generate a match. Try increasing the `retryCount` parameter or removing some exclusion rules.

**POST: /send**
----
  Sends emails to each person in the list, generating a random match if one is not provided.

  _**Note:** a `/match` response can be fed into the `list` of this request, but it is not necessary to call `/match` first if you don't want to see the result before sending._
* **Request parameters**
    + `list`: an array of people _Note: the response of a `/match` call will be a valid value for this parameter._
        + `name`: The name of the person. Required.
        + `email`: (Optional) The email address for this person. If not provided, an email will not be sent.
        + `exclusions`: (Optional) An array of names representing people that should be ignored when assigning a match to this person.
        + `match`: (Optional) A preselected match for this person, e.g. from the response of a `/match` call. **If not provided the match will be randomly selected.**
    + `retryCount`: number of times to attempt to match. Defaults to 100. _Note: You should not have to change this unless you have large lists with complex exclusion rules_
    + `subject`: (Optional) The subject of the email to be sent. Defaults to `Your "Secret Santa" match'` if not provided.
    + `message`: (Optional) The message of the email to be sent. Use `{{name}}` to insert the name of the match into the message. Defaults to `Your Secret Santa match is {{name}}!` if not provided.
* **Example Call:**
    ~~~~
    POST /v1/send
    Content-Type: application/json

    {
    "subject": "Your Secret Santa victim awaits...",
    "message": "Your match is {{name}}! \r\n\r\n The price limit for gifts is $50.",
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
  **Reason:** Your request is malformed, or your list is missing, or has less than two people, or has duplicate names.

  **Code:** 409  <br />
  **Reason:** Could not generate a match. Try increasing the `retryCount` parameter or removing some exclusion rules.

  **Code:** 503  <br />
  **Reason:** An error occurred trying to send the emails. This could be an issue with MailGun configuration.


