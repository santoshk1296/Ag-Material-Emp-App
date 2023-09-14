# Stage 1
FROM node:latest as build
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app
RUN npm install
RUN npm run build --prod
COPY . /app
# Stage 2
FROM nginx:latest
COPY --from=build /app/dist/ag-material-emp-app /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200