FROM node:18.16.0-alpine

WORKDIR /app/test

COPY package*.json ./

RUN npm i 

COPY . .

ENV PORT = 5678

EXPOSE 5678
## run the node 
CMD ["npm","start"]