import Footer from './footer';
import LoginButton from './login-button';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {PageWrapper, Section} from './common';
import {Typography} from '@material-ui/core';
import {withUser} from './with-user';

function AuthRequired(props) {
  if (props.user) {
    return typeof props.children === 'function'
      ? props.children(props.user)
      : props.children;
  }

  return (
    <Fragment>
      <Section>
        <PageWrapper>
          <Typography gutterBottom variant="h3">
            Login required
          </Typography>
          <Typography paragraph>
            You need to be logged in to see this page
          </Typography>
          <LoginButton
            variant="outlined"
            size="large"
            text="Click here to log in"
          />
        </PageWrapper>
      </Section>
      <Footer />
    </Fragment>
  );
}

AuthRequired.propTypes = {
  user: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
};

export default withUser(AuthRequired);
