FROM node:15
WORKDIR '/app'
COPY ./package.json ./
RUN yarn 
COPY . .
RUN yarn build
CMD ["yarn","run","start"]
