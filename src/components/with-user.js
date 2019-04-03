import compose from 'recompose/compose';
import gql from 'graphql-tag';
import identity from 'lodash/identity';
import mapProps from 'recompose/mapProps';
import toRenderProps from 'recompose/toRenderProps';
import {graphql} from 'react-apollo';

export const withUser = compose(
  graphql(gql`
    {
      user @client {
        id
        name
        image
      }
    }
  `),
  mapProps(({data, ...props}) => ({
    ...props,
    user: data.user
  }))
);

export default toRenderProps(withUser, identity);
