import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import {MdShare} from 'react-icons/md';
import {stringify} from 'querystring';

export default class ShareButton extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  };

  onClick = () => {
    const width = 555;
    const height = 420;
    const options = {
      width,
      height,
      top: window.screenY + (window.innerHeight - height) / 2,
      left: window.screenX + (window.innerWidth - width) / 2
    };

    const query = stringify({
      text: this.props.text,
      url: 'https://superteam.gg',
      related: 'superteamgg'
    });

    window.open(
      `https://twitter.com/intent/tweet?${query}`,
      'share',
      stringify(options, ',')
    );
  };

  render() {
    return (
      <Tooltip title="Share on Twitter">
        <IconButton onClick={this.onClick}>
          <MdShare size={24} />
        </IconButton>
      </Tooltip>
    );
  }
}