# Reddit clone

Reddit clone made with nextjs, nestjs, nginx and docker compose. This app is made with docker containers, so no other dependencies needed to be installed other than docker. Both the frontend and backend routing is handled by an nginx container. Use the travis.yml file as a template for ci/cd into dockerhub.

![reddit-demo](https://github.com/RoseNeezar/reddit-clone/blob/master/reddit-demo.gif)

## Features

### Frontend
- Nextjs
- typescript
- tailwind css
- swr

### Backend
- Nestjs
- typescript
- postgressql

### Devops
- nginx
- Travis ci
- Docker
- Docker compose


## Installation

To start run

```bash
cp .env.example .env
```

```bash
yarn start
```
App runs by default at http://localhost:3011

## Helpers
Install lazydocker on your system. This tool can help visualise container logs.

## License
[MIT](https://choosealicense.com/licenses/mit/)
