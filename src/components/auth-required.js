import Footer from './footer';
import LoginButton from './login-button';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import {PageWrapper, Section} from './common';
import {withUser} from './with-user';

function AuthRequired(props) {
  if (props.user) {
    return props.children;
  }

  return (
    <Fragment>
      <Section>
        <PageWrapper>
          <Typography gutterBottom variant="h3">
            Login required
          </Typography>
          <Typography paragraph variant="body1">
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
  children: PropTypes.node.isRequired
};

export default withUser(AuthRequired);
