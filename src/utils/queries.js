import gql from 'graphql-tag';

export const GET_USER = gql`
  {
    user @client {
      id
      username
      displayName
      profileImage
    }
  }
`;

export const CREATE_ENTRY = gql`
  mutation CreateEntry($name: String!, $playerIds: [String]!) {
    createEntry(name: $name, playerIds: $playerIds) {
      id
      name
      players {
        id
        name
        ign
      }
    }
  }
`;
