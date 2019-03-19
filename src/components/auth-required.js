import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Section} from './common';
import {withUser} from './with-user';

function AuthRequired(props) {
  if (props.user) {
    return props.children;
  }

  return (
    <Section>
      <Typography>No user plz login</Typography>
    </Section>
  );
}

AuthRequired.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node.isRequired
};

export default withUser(AuthRequired);
