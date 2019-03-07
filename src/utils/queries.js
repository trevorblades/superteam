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

const EntryFragment = gql`
  fragment EntryFragment on Entry {
    id
    slug
    name
    players {
      id
      name
      ign
    }
  }
`;

export const CREATE_ENTRY = gql`
  mutation CreateEntry($name: String!, $playerIds: [String]!) {
    createEntry(name: $name, playerIds: $playerIds) {
      ...EntryFragment
    }
  }
  ${EntryFragment}
`;

export const LIST_ENTRIES = gql`
  {
    entries {
      ...EntryFragment
    }
  }
  ${EntryFragment}
`;
