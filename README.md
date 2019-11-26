[![Build Status](https://travis-ci.com/sdanyalk/auth-project-two.svg?branch=master)](https://travis-ci.com/sdanyalk/auth-project-two)

# Authentication for Project Two
This project showcases how to add authentication using `passport.js` library. Template for this project is the starter template given for Project Two.

`passport.js` provides many authentication strategies. This project makes use of **local** username and password authentication strategy. More details about this strategy can be found [here](http://www.passportjs.org/packages/passport-local/).

Passport Local strategy expects you to have username and password stored in your database. In this project I'm using email address as a username. The passwords are stored as a hash using **bcrypt**.

---

## Installation

- `git clone git@github.com:sdanyalk/auth-project-two.git`
- `cd auth-project-two`
- `npm i`

---

## NPM Packages

| Package | Description |
| ----------- | ----------- |
| `express` | [Express](https://www.npmjs.com/package/express) |
| `express-handlebars` | [Express Handlebars](https://www.npmjs.com/package/express-handlebars) |
| `mysql2` | [Node MySql 2](https://www.npmjs.com/package/mysql2) |
| `sequelize` | [Sequelize](https://www.npmjs.com/package/sequelize) |
| `passport` | [Passport](https://www.npmjs.com/package/passport) |
| `passport-local` | [Passport Local Strategy](https://www.npmjs.com/package/passport-local) |
| `bcrypt` | [BCrypt](https://www.npmjs.com/package/bcrypt) |
| `connect-flash` | [Connect Flash for Express](https://www.npmjs.com/package/connect-flash) |
| `dotenv` | [Dotenv](https://www.npmjs.com/package/dotenv) |

---

## Heroku Deployment

This project is deployed on Heroku. The link to web app is:

> [Authentication App](https://auth-project-two.herokuapp.com/)
