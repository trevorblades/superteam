import {createMuiTheme} from '@material-ui/core';
import {themeOptions} from '@trevorblades/mui-theme';

const theme = createMuiTheme({
  ...themeOptions,
  palette: {
    primary: {
      main: '#0000ff'
    },
    secondary: {
      main: '#00be00',
      contrastText: '#fff'
    },
    error: {
      main: '#ff0000'
    }
  }
});

export default theme;
