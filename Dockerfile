# Stage 1
FROM node:latest as build
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod
# Stage 2
FROM nginx:latest
COPY --from=build /app/dist/ag-material-emp-app /usr/share/nginx/html
EXPOSE 4200