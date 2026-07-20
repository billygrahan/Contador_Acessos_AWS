import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// O cliente se conecta automaticamente na região configurada no ambiente pelo CDK, 
// mas deixar explícito "us-east-1" não quebra o código.
const client = new DynamoDBClient({
  region: "us-east-1",
});

const documentClient = DynamoDBDocumentClient.from(client);

export async function handler() {
  try {
    const command = new UpdateCommand({
      // AJUSTE 1: Pega o nome dinâmico injetado pelo CDK
      TableName: process.env.TABLE_NAME,
      Key: {
        id: "counter", // Mantenha a chave que você usou no banco ("counter" ou "hits")
      },
      UpdateExpression: "SET #count = if_not_exists(#count, :zero) + :inc",
      ExpressionAttributeNames: {
        "#count": "count",
      },
      ExpressionAttributeValues: {
        ":zero": 0,
        ":inc": 1,
      },
      ReturnValues: "UPDATED_NEW",
    });

    const response = await documentClient.send(command);
    
    // Captura o número atual retornado pelo DynamoDB
    const totalHits = response.Attributes?.count || 0;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Content-Type": "application/json"
      },
      // AJUSTE 2: Devolve a quantidade de acessos para o React renderizar
      body: JSON.stringify({
        message: "OK",
        hits: totalHits
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Evita travar o CORS mesmo em caso de erro 500
      },
      body: JSON.stringify({
        message: "Erro ao atualizar contador",
        error: error.message,
      }),
    };
  }
}