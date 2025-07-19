FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN apt-get update && apt-get install -y postgresql-client
EXPOSE 5000
CMD ["npm", "start"]