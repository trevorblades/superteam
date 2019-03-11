import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';
import chroma from 'chroma-js';
import deepPurple from '@material-ui/core/colors/deepPurple';
import green from '@material-ui/core/colors/green';

const colors = {
  [blueGrey[500]]: 0,
  [green[500]]: 0.1,
  [blue[500]]: 0.4,
  [deepPurple[500]]: 0.7,
  [amber[500]]: 0.9
};

export const scale = chroma.scale(Object.keys(colors));
export const classes = scale.classes([...Object.values(colors), 1]);
