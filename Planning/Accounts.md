Goal: To give a Client limited access to an a Resource server on behalf of the Resource Owner

Resource Owner - The person who's data you want

Resource Server - The API that you're trying to access

Client - You. Your application






Auth
3rd party application (your webapp, your action fullfillment webhook)

How do you get token from the authorization server, to the 3rd party application?

First, you need to register your application with the server that you want to access (Ie Google).

ClientId - Uniquely Identifies your client to Resource Server when you try to connect to it.

Client Secret - Given to you by the Resource Server to identify you, only if you are confidential (can hide it).

Eg. You want access to Google Drive Api. How?

You have a sign in with Google button. You redirect the browser to 

Google's Authorization Server

- Redirect URL
- Scope -> What permissions you need
- State
- PKCS

Your application sends the user to an endpoint that Google owns itself. 

The user puts their credentials into the authorization endpoint (logs in)

The authorization endpoint asks the user if they consent to providing the information that the client application is wanting.

If the user consents, the resource server redirects the user to a redirect_uri belonging to the client that the client registered beforehand

when redirecting the user to the redirect url, the Resource Server gives the client
an access code
a state

as query parameters

The client then submits a post request to the Resource Server's Authorization Server

The authorization server sends the client application back an access token and a refresh token
