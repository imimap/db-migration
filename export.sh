docker compose up -d
npm run migrate
docker exec db-migration-db-mongo-1 mongodump --archive=db-dump.gz --gzip --db=imimap
docker cp  db-migration-db-mongo-1:/db-dump.gz  ./ 
docker compose down