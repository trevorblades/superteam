import Footer from './footer';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import TwitterLogin from './twitter-login';
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
          <TwitterLogin />
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
