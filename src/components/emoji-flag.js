import PropTypes from 'prop-types';
import React from 'react';
import emojiFlags from 'emoji-flags';

export default function EmojiFlag(props) {
  return (
    <span title={props.country.name}>
      {emojiFlags.countryCode(props.country.code).emoji}
    </span>
  );
}

EmojiFlag.propTypes = {
  country: PropTypes.object.isRequired
};
