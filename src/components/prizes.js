import Grid from '@material-ui/core/Grid';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import headset from '../assets/images/headset.png';
import mousepad from '../assets/images/mousepad.png';
import stickers from '../assets/images/stickers.png';
import styled from '@emotion/styled';
import {Link} from 'gatsby';
import {PageWrapper, Section} from './common';
import {epic, legendary, rare} from '../utils/scale';
import {withTheme} from '@material-ui/core/styles';

const StyledImage = styled.img({
  display: 'block',
  width: 200,
  margin: `${16}px auto`
});

const StyledPageWrapper = styled(PageWrapper)({
  paddingTop: 16
});

const PrizeWrapper = withTheme(
  styled.div(({theme}) => ({
    height: '100%',
    padding: 32,
    borderWidth: 1,
    borderStyle: 'solid',
    textAlign: 'center',
    backgroundColor: theme.palette.grey[100]
  }))
);

const prizes = {
  10: {
    name: 'Superteam',
    type: 'sticker pack',
    image: stickers,
    note: 'Five 3-inch stickers',
    color: rare
  },
  5: {
    name: 'SteelSeries QcK Edge',
    type: 'mousepad',
    image: mousepad,
    note: 'Large size',
    color: epic
  },
  1: {
    name: 'HyperX Cloud Stinger',
    type: 'headset',
    image: headset,
    color: legendary
  }
};

const prizeKeys = Object.keys(prizes).sort((a, b) => b - a);

export default function Prizes() {
  return (
    <Fragment>
      <a name="prizes" />
      <Section>
        <PageWrapper mini>
          <Typography variant="h3" gutterBottom>
            Earn prizes
          </Typography>
          <Typography variant="body1" paragraph>
            At the end of each quarter, the 20 players who have seen the highest
            gains in their team&apos;s value will be rewared with awesome
            prizes. You can check on the current status of the top 20 and your
            place within it <Link to="/standings">here</Link>. Take a look at
            this quarter&apos;s prizes! 👀
          </Typography>
        </PageWrapper>
        <StyledPageWrapper>
          <Grid container justify="center" spacing={4}>
            {prizeKeys.map((key, index, array) => {
              const prize = prizes[key];
              return (
                <Grid item key={key} xs={12} sm={6} md={4}>
                  <PrizeWrapper style={{borderColor: prize.color}}>
                    <Typography variant="h5" gutterBottom>
                      {key === '1' ? 'First place' : `Top ${key}`}
                    </Typography>
                    <Typography>
                      {prize.name} {prize.type}
                    </Typography>

                    <Typography
                      paragraph
                      variant="caption"
                      color="textSecondary"
                    >
                      {prize.note ? prize.note : <span>&nbsp;</span>}
                    </Typography>
                    <StyledImage src={prize.image} />
                    {index > 0 && (
                      <Typography variant="overline">
                        +{' '}
                        {array
                          .slice(0, index)
                          .map(key => prizes[key].type)
                          .join(' & ')}
                      </Typography>
                    )}
                  </PrizeWrapper>
                </Grid>
              );
            })}
          </Grid>
        </StyledPageWrapper>
      </Section>
    </Fragment>
  );
}
