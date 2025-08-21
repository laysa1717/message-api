# Message API



## Prerequisites

- **Node.js**: Ensure you have Node.js version 19 or above installed.
- **NestJS**: Use the version specified in the project's `package.json`.
- **Docker**: Make sure Docker is installed and running on your machine.
- **AWS CLI**: Install AWS CLI and configure it for local use with LocalStack.

## Architecture

The project follows the principles of **Clean Architecture**, which emphasizes separation of concerns and independence of frameworks, UI, and databases. This architecture helps in maintaining a scalable and testable codebase.

## Setup

1. **Install Dependencies**

   Run the following command to install the project dependencies:

   ```bash
   npm install
   ```

2. **Run the Project**

   Start the project using the following command:

   ```bash
   npm run start
   ```

3. **Run Docker Compose**

   Ensure Docker is running and execute the following command to start the services defined in `docker-compose.yaml`:

   ```bash
   docker-compose up
   ```

4. **Setup AWS DynamoDB Table**

   After starting Docker, run the following AWS CLI commands to create the DynamoDB table:

   ```bash
   aws dynamodb create-table \
       --table-name MESSAGES \
       --attribute-definitions \
           AttributeName=id,AttributeType=S \
           AttributeName=sender,AttributeType=S \
           AttributeName=createdAt,AttributeType=S \
           AttributeName=somePartitionKey,AttributeType=S \
       --key-schema AttributeName=id,KeyType=HASH \
       --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
       --global-secondary-indexes \
           "[
               {
                   \"IndexName\": \"sender-index\",
                   \"KeySchema\": [{\"AttributeName\":\"sender\",\"KeyType\":\"HASH\"}],
                   \"Projection\": {\"ProjectionType\":\"ALL\"},
                   \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
               },
               {
                   \"IndexName\": \"createdAt-index\",
                   \"KeySchema\": [
                       {\"AttributeName\":\"somePartitionKey\",\"KeyType\":\"HASH\"},
                       {\"AttributeName\":\"createdAt\",\"KeyType\":\"RANGE\"}
                   ],
                   \"Projection\": {\"ProjectionType\":\"ALL\"},
                   \"ProvisionedThroughput\": {\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
               }
           ]" \
       --endpoint-url http://localhost:4566/ \
       --profile localstack
   ```

5. **Confirm Table Creation**

   Use the following command to confirm that the table was created successfully:

   ```bash
   aws dynamodb scan --table-name MESSAGES --endpoint-url http://localhost:4566/ --profile localstack
   ```

This will scan the `MESSAGES` table and confirm its existence.