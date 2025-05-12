FROM node:23-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

ENV PORT=5000
ENV TOKEN_SECRET=
ENV PGUSER=
ENV PGPASSWORD=
ENV PGHOST=host.docker.internal
ENV PGPORT=5432
ENV PGDATABASE=fit_factory


CMD [ "npm" , "start"]