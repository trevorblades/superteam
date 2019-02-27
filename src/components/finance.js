import NumberText from './number-text';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import chroma from 'chroma-js';
import styled from '@emotion/styled';
import theme from '@trevorblades/mui-theme';
import {Spring, animated} from 'react-spring/renderprops';
import {TOTAL_BUDGET} from '../util';

const Container = styled.div({
  textAlign: 'center'
});

const StyledNumberText = styled(NumberText)({
  // 2 is the number of other characters ($ and , or .)
  width: `${TOTAL_BUDGET.toString().length + 2}ch`
});

const FinanceText = animated(StyledNumberText);

const scale = chroma.scale([
  theme.palette.error.main,
  theme.palette.common.black
]);

export default function Finance(props) {
  return (
    <Container>
      <Typography>{props.title}</Typography>
      <Spring from={{number: props.from}} to={{number: props.to}}>
        {({number}) => (
          <FinanceText
            variant="h4"
            color={props.colored ? 'inherit' : 'default'}
            style={{
              color: props.colored ? scale(number / TOTAL_BUDGET).hex() : null
            }}
          >
            ${Math.round(number).toLocaleString()}
          </FinanceText>
        )}
      </Spring>
    </Container>
  );
}

Finance.propTypes = {
  title: PropTypes.string.isRequired,
  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
  colored: PropTypes.bool
};
