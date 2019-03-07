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

export const CREATE_TEAM = gql`
  mutation CreateTeam($name: String, $playerIds: [String]!) {
    createTeam(name: $name, playerIds: $playerIds) {
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
