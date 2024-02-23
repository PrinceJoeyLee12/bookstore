// __________________________________________________________________

export const listBooksCustom = /* GraphQL */ `
  query ListBooks($filter: ModelBookFilterInput, $limit: Int, $nextToken: String) {
    listBooks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        type
        summary
        image {
          url
          title
          __typename
        }
        authorId
        author {
          id
          name
          firstName
          lastName
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const listAuthorsCustom = /* GraphQL */ `
  query ListAuthors($filter: ModelAuthorFilterInput, $limit: Int, $nextToken: String) {
    listAuthors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        firstName
        lastName
        age
        image {
          url
          title
          __typename
        }
        books(limit: 300) {
          items {
            id
            title
            type
            image {
              url
              title
              __typename
            }
          }
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
