## configure the server

1. Create a postgres DB
2. Open the .env file in the server directory and set "PGDATABASE" with the name of the newly created db
3. In the same .env file set your postgre USERNAME and PASSWORD
4. run "npm run create_database" to build your db
5. run "npm run start"

## configure the client

1. In the client directroy update the .env file with the url of the server via "VITE_API_BASEURL"