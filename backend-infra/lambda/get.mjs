import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1",
});

const documentClient = DynamoDBDocumentClient.from(client);

export async function handler() {
  try {
    const command = new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: "counter",
      },
    });
    const response = await documentClient.send(command);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hits: response.Item?.count ?? 0,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Erro ao buscar contador",
        error: error.message,
      }),
    };
  }
}
