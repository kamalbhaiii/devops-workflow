FROM node:23-alpine AS builder
 
WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV VITE_BACKENDURL=http://localhost:5000

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

