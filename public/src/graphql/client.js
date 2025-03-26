const GRAPHQL_ENDPOINT = "https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql";
import { getCurrentToken } from '../utils/auth.js';

export const client = {
  async query(query, variables = {}) {
    const token = getCurrentToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });
    
    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    return result.data;
  }
};

// Common queries
export const GET_USER_PROFILE = `
  query GetUserProfile {
    user {
      id
      login
      name
      email
      avatar
      bio
    }
  }
`;

export const GET_XP_HISTORY = `
  query GetXpHistory($startDate: timestamptz!, $endDate: timestamptz!) {
    transaction(
      where: {
        createdAt: {_gte: $startDate, _lte: $endDate},
        type: {_eq: "xp"}
      }
    ) {
      amount
      createdAt
      path
    }
  }
`;

export const GET_PROGRESS_STATS = `
  query GetProgressStats {
    progress {
      grade
      createdAt
      object {
        name
        type
      }
    }
  }
`;

export const GET_AUDIT_RATIO = `
  query GetAuditRatio {
    result {
      grade
      object {
        name
      }
    }
    transaction(where: {type: {_eq: "xp"}}) {
      amount
    }
  }
`;
