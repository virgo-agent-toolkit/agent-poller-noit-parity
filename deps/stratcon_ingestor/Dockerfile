FROM ubuntu:14.04

RUN apt-get update && apt-get install -y nodejs npm git

# Define working directory.
WORKDIR /data

ADD stratcon_ingestor.js /data/stratcon_ingestor.js

RUN npm install redis

# Define default command.
CMD node stratcon_ingestor.js

