import gql from 'graphql-tag';

export const EntryFragment = gql`
  fragment EntryFragment on Entry {
    id
    name
    primary
    createdAt
    selections {
      id
      createdAt
      deletedAt
      player {
        id
        ign
        name
        image
        team {
          name
          logo
        }
        statistics {
          percentile
          week
          year
        }
      }
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
    entriesLimit
    entries {
      ...EntryFragment
    }
  }
  ${EntryFragment}
`;

export const GET_ENTRY = gql`
  query GetQuery($id: ID!) {
    entry(id: $id) {
      ...EntryFragment
    }
  }
  ${EntryFragment}
`;

export const UPDATE_ENTRY = gql`
  mutation UpdateEntry($id: ID!, $playerIds: [String]!) {
    updateEntry(id: $id, playerIds: $playerIds) {
      ...EntryFragment
    }
  }
  ${EntryFragment}
`;

export const SET_PRIMARY_ENTRY = gql`
  mutation SetPrimaryEntry($id: ID!) {
    setPrimaryEntry(id: $id) {
      ...EntryFragment
    }
  }
  ${EntryFragment}
`;
