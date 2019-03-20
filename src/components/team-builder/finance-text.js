import NumberText from './number-text';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import chroma from 'chroma-js';
import styled from '@emotion/styled';
import {Spring, animated} from 'react-spring/renderprops';
import {TOTAL_BUDGET} from '../../utils/constants';
import {formatMoney} from '../../utils/format';

const Container = styled.div({
  textAlign: 'center'
});

const AnimatedNumberText = animated(
  styled(NumberText)({
    // 2 is the number of other characters ($ and , or .)
    width: `${TOTAL_BUDGET.toString().length + 2}ch`
  })
);

const scale = chroma.scale(['red', 'black']);
export default function FinanceText(props) {
  return (
    <Container>
      <Typography>{props.title}</Typography>
      <Spring from={{number: props.from}} to={{number: props.to}}>
        {({number}) => (
          <AnimatedNumberText
            variant="h4"
            color={props.colored ? 'inherit' : 'default'}
            style={{
              color: props.colored ? scale(number / TOTAL_BUDGET).hex() : null
            }}
          >
            {formatMoney(Math.round(number))}
          </AnimatedNumberText>
        )}
      </Spring>
    </Container>
  );
}

FinanceText.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
  colored: PropTypes.bool
};
