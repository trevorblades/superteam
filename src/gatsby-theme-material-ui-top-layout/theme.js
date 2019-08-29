import {createMuiTheme} from '@material-ui/core';

const headingStyles = {
  fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
  fontWeight: 700
};

const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      overline: {
        fontWeight: 700
      }
    }
  },
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
  },
  typography: {
    useNextVariants: true,
    fontSize: 16,
    fontFamily: 'Inconsolata, monospace',
    fontWeightMedium: 700,
    h1: headingStyles,
    h2: headingStyles,
    h3: headingStyles,
    h4: headingStyles,
    h5: headingStyles,
    h6: headingStyles
  }
});

export default theme;
