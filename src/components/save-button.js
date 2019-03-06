import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import TwitterLogin from './twitter-login';
import styled from '@emotion/styled';
import {FaTwitter} from 'react-icons/fa';
import {MdCheck} from 'react-icons/md';
import {TWITTER_BLUE} from '../utils/constants';
import {withTheme} from '@material-ui/core/styles';

const StyledButton = withTheme()(
  styled(Button)(({theme}) => {
    const {main, dark} = theme.palette.augmentColor({main: TWITTER_BLUE});
    return {
      color: 'white',
      backgroundColor: main,
      ':hover': {
        backgroundColor: dark
      }
    };
  })
);

export default function SaveButton(props) {
  if (props.user) {
    return (
      <Button
        variant="contained"
        color="primary"
        disabled={props.disabled}
        className={props.className}
        type="submit"
      >
        <MdCheck size={20} style={{marginRight: 8}} />
        Save team
      </Button>
    );
  }

  return (
    <TwitterLogin>
      {({pending, startAuth}) => (
        <StyledButton
          variant="contained"
          disabled={pending}
          onClick={startAuth}
          className={props.className}
        >
          <FaTwitter size={20} style={{marginRight: 8}} />
          Log in to save
        </StyledButton>
      )}
    </TwitterLogin>
  );
}

SaveButton.propTypes = {
  user: PropTypes.object,
  disabled: PropTypes.bool,
  className: PropTypes.string
};
