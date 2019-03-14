import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import SaveButton from '../save-button';
import TwitterLogin from '../twitter-login';
import styled from '@emotion/styled';
import {FaTwitter} from 'react-icons/fa';
import {TWITTER_BLUE} from '../../utils/constants';
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

export default function LoginSaveButton(props) {
  if (props.user) {
    return (
      <SaveButton
        disabled={props.disabled}
        className={props.className}
        type="submit"
      />
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

LoginSaveButton.propTypes = {
  user: PropTypes.object,
  disabled: PropTypes.bool,
  className: PropTypes.string
};
