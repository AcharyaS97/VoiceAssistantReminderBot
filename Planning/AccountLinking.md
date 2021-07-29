# Account Linking

3 different options:

- Streamlined Linking
	- Can allow non Google users to connect their accounts. 
	- If the action targets other platforms as well, apart from Google Assistant
  
- Google Sign In
	- Only if you expect all users to have Google Accounts

- OAuth Linking
  - Recommended if you have an existing implementation of an OAuth 2.0 server, and you cannot extend your token exchange endpoint to add support for Google’s protocols for automatic linking and account creation from an ID token (i.e., add the intent=get and intent=create parameters in requests to this endpoint).

Let's assume that we are going Streamlined Linking, to give us flexibility to deploy this same thing to stuff like Alexa in the future.

# Streamlined Linking Considerations

Do we want to allow account creation on web only or also through voice? Yes

  - Web only if need to display terms of service
  - Web only if need full control of the account creation flow.

Authorization Code Flow or Implicit Flow?

 - Authorization Code flow requires a second endpoint, token exchange endpoint. Uses refresh tokens to generate new, short-lived access tokens without prompting the user to sign in again. More secure, recommended by Google.

- Implicit flow returns a long lived access token to Google that usually doesn't need to be regenerated. Must use this if the service cannot store confidential information (ie a client secret). Must use implicit flow for public clients like a Single Page Application.

Looks like we'd have to use the Implicit flow. 


## How it works

Adds Google Sign In on top of OAuth based account linking. 

From the action:
- begins with google sign in which checks if the user's profile information exists in your system. If not, standard OAuth flow begins. 

- By providing a combination of GSi and OAuth users can link their identity in the Action with a Google or non Google Account. 

## Terms

- Google ID token:
  - Signed assertion of a user's identity that contains their basic Google profile information. A google id token is a JWT (Json Web Token).

- ```user.verificationStatus``` -> Set by the system to indicate the current session has a verified user

- ```user.accountLinkingStatus``` -> Set by the system to indicate if the user in the current session has a linked identity

- Account linking scene -> predefined scene that implements confirmation flow for account linking. Can be customized.

- Authorization Endpoint -> The endpoint that presents the sign in UI to your users that aren't signed in. Records consent to the requested access in the form of a short lived authorization code. 

- Token Exchange endpoint - > Endpoint responsible for:
  - exchanging authorization code for a long lived refresh token and a short lived access token. happens when user goes through account linking flow.

  - exchange long lived refresh token ffor a short lived access token. happens when google needs a new token because previous expired

- Implicit flow -> Requires only an authorization endpoint. In this flow google opens your authorization endpoint in the user's browser. If sign in is successful, you return a long lived access token to Google. this access token is now included in every request sent from Assistant to your action. 

## Authorization Code Flow

- Action asks the user if they want to link their Google profile to this action. 

- User accepts, Assistant sends the user's Google ID Token to the configured token exchange endpoint.

- Token exchange endpoint will decode the Google ID token and decode it to read profile contents.

- Token exchange endpoint will check whether the user's information already exists in customer database.
  
  - If so, user has already signed into our system with their google account previously. The token exchange endpoint will send the user access and refresh tokens.

  - If not, user can create a new account with their google profile information or sign into system with a different account. depends whether or not you allow account creation via voice. 

	- If user consents to linking their Google account with the Actions Project, assistant scene will send a request to the token exchange endpoint to create a new account. Will include the Google ID Token.

	- The token exchange endpoint will use the Google ID Token and insert a new account record into the database. 

	- The token exchange endpoint will create access and refresh tokens and send them back to the assistant.
	- 
	- The scene will transition back to where it was that invoked account linking and go on its way. 

- After user creates the account or signs in, the backend returns an access token to Google. 

## Implicit Code Flow

- Action asks if user wants to link account with their service

- If user agrees, Google opens up the authorization endpoint in the user's browser. 

- User signs in with their Google account and grants Google permission to access their data with my API.

- My backend creates an access code and returns it to Google by redirecting the user's browser back to Google with the access code attached to the request.


- Google sends the access code to my token exchange endpoint which validates the authenticity of the code and returns an access token and a refresh token. 


- After the user has completed the account linking flow, Google calls my service's APIs with the access token attached to each request. Service verifies the access token grants Google the permission to access API and completes that API call.

Do we choose Authorization Code Flow or Implicit Code Flow?

- Implicit Code Flow

## Todo

What do we need to implement the Authorization code flow?

- A way for the user to sign in from the web app
  - Sign in with Google.

- **Authorization Endpoint (Frontend)**
  - Need to request authorization from the user (the resource owner) by building the link the user will click on to go to grant access.

 - Link will have following query parameters:
   - Client_Id
   - Response_Type
   - State
   - Redirect_Uri
   - Scope


  - Will present a sign in ui to the user that Google will link to. 
  - User signs in and grants permission to Google



- **Authorization Endpoint (Backend)** 
  - Will check the Google Id Token and see if we have a user that's associated with it. If so, it will return an authorization token.

  - If not, will return an error.
  
- **Token Exchange Endpoint**
  
  - If presented a valid authorization token, it will return an access and refresh token

  - If presented an expired access token, it will return a refresh token