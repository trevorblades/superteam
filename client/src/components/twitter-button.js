import React from 'react';
import {ColoredButton} from './common';
import {FaTwitter} from 'react-icons/fa';

export default function TwitterButton(props) {
  return (
    <ColoredButton
      fullWidth
      hex="#38a1f3"
      variant="contained"
      size="large"
      {...props}
    >
      <FaTwitter size={20} style={{marginRight: 8}} /> Log in with Twitter
    </ColoredButton>
  );
}
