FROM node:14.14.0-alpine
WORKDIR "/app"
COPY ./package.json ./
RUN yarn 
COPY . .
RUN yarn build
CMD ["yarn","run","start:prod"]