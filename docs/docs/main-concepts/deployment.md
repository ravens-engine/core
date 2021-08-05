---
id: deployment
title: Deployment
---

A game coded with Ravens can easily be deployed to any cloud providers. This guide will show how to deploy
your game on Heroku.

Note that the resulting deployment will not contain any lobby or authentication system. This type of
deployment is nice when you want to play with your friends, but is not suitable for a public-facing
website.

Once your game is deployed, you can look into integrating with AirMeeple.

## Deploying on Heroku

Deploying on Heroku

* Register on Heroku, and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
* Run `git init` inside the folder that contains your project

Modify the `package.json` file of your project to add those 2 commands in the `scripts` section:

```
  "scripts": {
    "build": "parcel build index.html",
    "start": "node ./src/server.js",
  },
```

`build` is used by Heroku to build the frontend static assets of your game. The resulting static files will
be placed in the folder `dist/`. `start` is used by Heroku to start the game server itself. Ravens will take care
of serving the static assets located in `dist/`.

Follow the normal procedure to [deploy on Heroku with Git](https://devcenter.heroku.com/articles/git).

## Integrating with AirMeeple


