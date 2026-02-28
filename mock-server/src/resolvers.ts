import { db, TestCase } from './database';
import { generatePairwise } from './pairwise';

export const resolvers = {
  Query: {
    listTestCases: (): TestCase[] => {
      return db.listTestCases();
    },

    getTestCase: (_: any, args: { id: string }): TestCase | null => {
      return db.getTestCase(args.id);
    },
  },

  Mutation: {
    createTestCase: (
      _: any,
      args: {
        title: string;
        description?: string;
        purpose?: string;
        preconditions?: string;
        steps?: string;
        expectedResult?: string;
        assignee?: string;
      }
    ): TestCase => {
      return db.createTestCase(
        args.title,
        args.description,
        args.purpose,
        args.preconditions,
        args.steps,
        args.expectedResult,
        args.assignee
      );
    },

    updateTestCase: (
      _: any,
      args: {
        id: string;
        title?: string;
        description?: string;
        purpose?: string;
        preconditions?: string;
        steps?: string;
        expectedResult?: string;
        status?: 'NOT_EXECUTED' | 'PASSED' | 'FAILED' | 'BLOCKED';
        assignee?: string;
      }
    ): TestCase | null => {
      const updates = Object.fromEntries(
        Object.entries(args).filter(([key, value]) => key !== 'id' && value !== undefined)
      );
      return db.updateTestCase(args.id, updates as any);
    },

    deleteTestCase: (_: any, args: { id: string }): boolean => {
      return db.deleteTestCase(args.id);
    },

    generatePairwise: (
      _: any,
      args: {
        factors: string[][];
      }
    ) => {
      return generatePairwise(args.factors);
    },
  },
};
