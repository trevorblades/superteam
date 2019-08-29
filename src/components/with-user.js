import gql from 'graphql-tag';
import {compose, mapProps, toRenderProps} from 'recompose';
import {graphql} from '@apollo/react-hoc';

export const withUser = compose(
  graphql(gql`
    {
      user @client(always: true) {
        id
        name
        image
        following
        tweeted
        entryLimit
      }
    }
  `),
  mapProps(({data, ...props}) => ({
    ...props,
    user: data.user
  }))
);

export default toRenderProps(withUser);
