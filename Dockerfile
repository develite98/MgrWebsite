FROM node:18 AS build
WORKDIR /dist/src/app

RUN npm cache clean --force
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build:bo


FROM nginx:latest AS ngi
COPY --from=build /dist/src/app/dist/apps/mix-cms /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80
