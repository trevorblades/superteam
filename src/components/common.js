import styled from '@emotion/styled';

export const sectionPadding = 56;
export const Section = styled.section({
  padding: sectionPadding
});

const heroPadding = 96;
export const Hero = styled(Section)({
  paddingTop: heroPadding,
  paddingBottom: heroPadding
});

export const PageWrapper = styled.div({
  width: '100%',
  maxWidth: 1280,
  margin: '0 auto'
});
