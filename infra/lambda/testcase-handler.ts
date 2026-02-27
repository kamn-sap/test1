import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient({
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined
});

const TABLE_NAME = process.env.TABLE_NAME || 'TestCasesTable';

export interface TestCase {
  id: string;
  title: string;
  description?: string;
  purpose?: string;
  preconditions?: string;
  steps?: string;
  expectedResult?: string;
  status: 'NOT_EXECUTED' | 'PASSED' | 'FAILED' | 'BLOCKED';
  assignee?: string;
  evidence?: string[];
  createdAt: string;
  updatedAt: string;
}

export async function createTestCase(input: any): Promise<TestCase> {
  const id = generateId();
  const now = new Date().toISOString();
  
  const testCase: TestCase = {
    id,
    ...input,
    status: input.status || 'NOT_EXECUTED',
    evidence: [],
    createdAt: now,
    updatedAt: now
  };

  await dynamodb.put({
    TableName: TABLE_NAME,
    Item: testCase
  }).promise();

  return testCase;
}

export async function getTestCase(id: string): Promise<TestCase | null> {
  const result = await dynamodb.get({
    TableName: TABLE_NAME,
    Key: { id }
  }).promise();

  return (result.Item as TestCase) || null;
}

export async function listTestCases(status?: string): Promise<TestCase[]> {
  let params: any = { TableName: TABLE_NAME };

  if (status) {
    params.FilterExpression = '#status = :status';
    params.ExpressionAttributeNames = { '#status': 'status' };
    params.ExpressionAttributeValues = { ':status': status };
  }

  const result = await dynamodb.scan(params).promise();
  return (result.Items as TestCase[]) || [];
}

export async function updateTestCase(id: string, updates: any): Promise<TestCase> {
  const now = new Date().toISOString();
  const updateExpression = Object.keys(updates)
    .map((key, idx) => `${key} = :val${idx}`)
    .join(', ') + `, updatedAt = :updatedAt`;

  const expressionValues: any = {};
  Object.entries(updates).forEach(([key, val], idx) => {
    expressionValues[`:val${idx}`] = val;
  });
  expressionValues[':updatedAt'] = now;

  const result = await dynamodb.update({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: `SET ${updateExpression}`,
    ExpressionAttributeValues: expressionValues,
    ReturnValues: 'ALL_NEW'
  }).promise();

  return result.Attributes as TestCase;
}

export async function deleteTestCase(id: string): Promise<boolean> {
  await dynamodb.delete({
    TableName: TABLE_NAME,
    Key: { id }
  }).promise();
  return true;
}

function generateId(): string {
  return `tc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
