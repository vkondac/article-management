# What is nedded:
mysql local
node

# How to start the app
The connection string in nedded in the env here is the sample, it is set in `schema.prisma`:
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DBNAME"

The database (schema) need to be created mannualy,
then run all of the migrations using prism CLI,
Here are the docs: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-node-mysql

start the server with `node server.js` the server is on port 5000
start the client with `npm run start` the client is on port 3000