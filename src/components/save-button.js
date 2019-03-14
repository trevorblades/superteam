import Button from '@material-ui/core/Button';
import React from 'react';
import {MdCheck} from 'react-icons/md';

export default function SaveButton(props) {
  return (
    <Button variant="contained" color="primary" {...props}>
      <MdCheck size={20} style={{marginRight: 8}} />
      Save team
    </Button>
  );
}
