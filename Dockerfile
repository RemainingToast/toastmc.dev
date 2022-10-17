FROM node:16-alpine
WORKDIR /opt/tycrek.com/
COPY ./ ./
RUN npm i && npm run build
CMD npm start