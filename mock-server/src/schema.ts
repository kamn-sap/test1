import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  enum TestCaseStatus {
    NOT_EXECUTED
    PASSED
    FAILED
    BLOCKED
  }

  type TestCase {
    id: String!
    title: String!
    description: String
    purpose: String
    preconditions: String
    steps: String
    expectedResult: String
    status: TestCaseStatus!
    assignee: String
    createdAt: String!
    updatedAt: String!
  }

  type PairwiseResult {
    combinations: [[String!]!]!
    pairsCovered: Int!
    totalPairs: Int!
  }

  type Query {
    listTestCases: [TestCase!]!
    getTestCase(id: String!): TestCase
  }

  type Mutation {
    createTestCase(
      title: String!
      description: String
      purpose: String
      preconditions: String
      steps: String
      expectedResult: String
      assignee: String
    ): TestCase!

    updateTestCase(
      id: String!
      title: String
      description: String
      purpose: String
      preconditions: String
      steps: String
      expectedResult: String
      status: TestCaseStatus
      assignee: String
    ): TestCase!

    deleteTestCase(id: String!): Boolean!

    generatePairwise(factors: [[String!]!]!): PairwiseResult!
  }
`;
