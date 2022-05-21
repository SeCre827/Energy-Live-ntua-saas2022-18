# User management microservice

This microservice handles login with google.
If the user has never signed in before, it creates an account.
If he has, it logs him in.
It returns a jwt of the format:
{
email: user.email,
name: user.first_name,
last_login: last_login_buffer,
licence_expiration: user.licence_expiration,
exp: exp,
}

Based on this jwt info all the other microservices implement the login.
