import styled from '@emotion/styled';
import {withTheme} from '@material-ui/core/styles';

export const sectionPadding = {
  lg: 56,
  md: 48,
  sm: 40,
  xs: 32
};

export function getSectionStyles(padding = sectionPadding) {
  const isNumber = typeof padding === 'number';
  function getPadding(key) {
    return isNumber ? padding : padding[key];
  }

  return function({theme}) {
    return {
      padding: `${getPadding('lg')}px ${sectionPadding.lg}px`,
      [theme.breakpoints.down('md')]: {
        padding: `${getPadding('md')}px ${sectionPadding.md}px`
      },
      [theme.breakpoints.down('sm')]: {
        padding: `${getPadding('sm')}px ${sectionPadding.sm}px`
      },
      [theme.breakpoints.down('xs')]: {
        padding: `${getPadding('xs')}px ${sectionPadding.xs}px`
      }
    };
  };
}

export const Section = withTheme()(styled.section(getSectionStyles()));
export const Hero = withTheme()(
  styled(Section)(
    getSectionStyles({
      lg: 96,
      md: 72,
      sm: 64,
      xs: 56
    })
  )
);

export const PageWrapper = styled.div({
  width: '100%',
  maxWidth: 1280,
  margin: '0 auto'
});
