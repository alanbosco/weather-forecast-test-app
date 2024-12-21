# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

ARG VUE_APP_BACKEND_API_URL
ARG VUE_APP_GOOGLE_MAPS_API_KEY

ENV VUE_APP_BACKEND_API_URL=${VUE_APP_BACKEND_API_URL}
ENV VUE_APP_GOOGLE_MAPS_API_KEY=${VUE_APP_GOOGLE_MAPS_API_KEY}

RUN yarn build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
