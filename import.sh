docker compose up -d
docker cp  ./db-dump.gz  db-migration-db-mongo-1:
docker exec db-migration-db-mongo-1 mongorestore  --gzip --archive=db-dump.gz
docker compose down

//docker cp db-dump_withadmin.gz imimap21-db-1:/
//docker exec imimap21-db-1 mongorestore  --gzip --drop --archive=db-dump_withadmin.gz
