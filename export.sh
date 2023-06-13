docker compose up -d
cat .\init\dump_09-06-2023_09_12_46.sql | docker exec -i db-migration-db-postgres-1  psql -U postgres
npm run migrate
docker exec db-migration-db-mongo-1 mongodump --archive=db-dump.gz --gzip --db=imimap
docker cp  db-migration-db-mongo-1:/db-dump.gz  ./ 
docker compose down