docker compose up -d
//unter UNIX
cat .\init\dump_09-06-2023_09_12_46.sql | docker exec -i db-migration-db-postgres-1  psql -U postgres
//unter Windows gibt das cat probleme mit UTF-8, hier bin ich in die Console auf postgres gegangen und 
cat docker-entrypoint-initdb.d/dump_09-06-2023_09_12_46.sql | psql -U postgres

npm run migrate
docker exec db-migration-db-mongo-1 mongodump --archive=db-dump2.gz --gzip --db=imimap
docker cp  db-migration-db-mongo-1:/db-dump2.gz  ./ 
docker compose down