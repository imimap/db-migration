# IMI-Map Database Migration Tool
A tool for migrating the Postgres database of the old IMI-Map to a MongoDB 
for the [imimap21](https://github.com/imimap/imimap21/)

## Usage

### Prerequisites
First you'll have to decide how you want to use the resulting MongoDB. There are three options:

- Mount a local directory as volume for the MongoDB to write the database files to
- Export the database from the service when the conversion is done
- Reuse the volume used in the migration for the actual IMI-Map

#### Option 1: Directory mounting
Edit the docker-compose.yml and change the mapping for the volume `mongo-data` to your preferred directory.
After migrating the database you can use the directory as a mounted volume for the database container of the new IMI-Map.

#### Option 2: Exporting the resulting database
1. Run the migration (see next section)
2. Connect to the Docker container using `docker exec -it <container-name> bash`
3. Run `mongodump --archive=db-dump.gz --gzip --db=imimap` inside the container to dump the database to `/db-dump.gz`
4. Exit the Docker container using `exit`
5. Fetch the archive from the Docker container using `docker cp <container-name>:/db-dump.gz <local destination path>`

#### Option 3: Reuse the volume
If you want to reuse the volume created by the migration for the new MongoDB,
you can simply mount the volume `mongo-data` in the new IMI-Map's docker-compose.yml.

### Run the migration
1. Put an SQL dump file of the old database into the `init/` directory and start the 
   Docker-Compose-Project using `docker-compose up -d`
2. Run the migration using `npm run migrate`
3. The Docker service `db-mongo` now contains the migrated database.

## Project structure
The project consists of 5 different parts:
- The old Postgres-Models (`src/pgModels`)
- The new Mongoose-Models (`src/mongooseModels`), the new IMI-Map uses the same models
- Loaders for loading the Postgres entities from the old database (`src/loaders`)
- Converters for converting the Postgres entities to the new MongoDB entities (`src/converters`)
- Some helper functions and utility classes (`src/helpers`)

The `index.ts` executes the migration by loading the old models using the provided loaders and converting them
to the new models using the converters. 
