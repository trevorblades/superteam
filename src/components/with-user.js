import compose from 'recompose/compose';
import gql from 'graphql-tag';
import mapProps from 'recompose/mapProps';
import {graphql} from 'react-apollo';

const withUser = compose(
  graphql(gql`
    {
      user @client {
        id
        username
        displayName
        profileImage
      }
    }
  `),
  mapProps(({data, ...props}) => ({
    ...props,
    user: data.user
  }))
);

export default withUser;
