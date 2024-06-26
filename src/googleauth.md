# Google Auth Procedure

## Signup
1. Google auth button in signup links to google auth url
2. Google auth page asks for permission to access user's openid and full profile
3. User grants permission
    - If user rejects permission, google sends user back to redirect uri with error message
    - 
4. Google sends user back redirect uri (/api/auth/googleRedirect) with code
5. Server sends code to google to get user info
6. If user exists with same google connection id, server sends user info back to client in JWT
   - If no user exists with same google connection id, server checks if user exists with same email
     - If user exists with same email, server sends error message to client
     - If no user exists with same email, server creates user and sends user info back to client in JWT
7. If user does not exist, server creates user and sends user info back to client in JWT
8. Client stores JWT in local storage and redirects to dashboard 

## Login
- If user tries to login with google email, show error message "Please login with google using this email" - since they have not defined password
- Users can always update their password 
