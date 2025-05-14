// src/lib/ai/callSageMaker.ts

import AWS from "aws-sdk";

const sagemaker = new AWS.SageMakerRuntime({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function callSageMaker(inputVector: number[]) {
  const payload = inputVector.join(",");

  const endpointName = process.env.SAGEMAKER_ENDPOINT_NAME;
  if (!endpointName) throw new Error("Missing SageMaker endpoint name");

  const response = await sagemaker
    .invokeEndpoint({
      EndpointName: endpointName,
      Body: payload,
      ContentType: "text/csv",
    })
    .promise();

  return parseFloat((response.Body as Buffer).toString("utf-8"));
}
