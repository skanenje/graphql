// Example GraphQL queries
export const GET_USER_PROFILE = `
  query {
    user {
      id
      login
    }
  }
`;

export const GET_XP_BY_PROJECT = `
  query {
    transaction(where: { type: { _eq: "xp" } }) {
      amount
      path
      createdAt
    }
  }
`;

export const GET_GRADES = `
  query {
    result {
      id
      grade
      user {
        login
      }
    }
  }
`;
