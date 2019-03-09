import Helmet from 'react-helmet';
import NoSsr from '@material-ui/core/NoSsr';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import withUser from './with-user';
import {Section} from './common';

function AuthRequired(props) {
  return (
    <Fragment>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <NoSsr>
        {props.user ? (
          props.children
        ) : (
          <Section>
            <Typography>No user plz login</Typography>
          </Section>
        )}
      </NoSsr>
    </Fragment>
  );
}

AuthRequired.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node.isRequired
};

export default withUser(AuthRequired);
