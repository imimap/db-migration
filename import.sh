docker compose up -d
docker cp  ./db-dump.gz  db-migration-db-mongo-1:
docker exec db-migration-db-mongo-1 mongorestore  --gzip --archive=db-dump.gz
docker compose down