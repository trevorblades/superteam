import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PropTypes from 'prop-types';
import React from 'react';
import groupBy from 'lodash/groupBy';
import styled from '@emotion/styled';
import {formatDate, formatMoney} from '../../utils/format';

const StyledList = styled(List)({
  backgroundColor: 'white'
});

export default function TransactionList(props) {
  const groups = groupBy(props.transactions, transaction =>
    formatDate(transaction.date)
  );

  return Object.entries(groups).map(([date, transactions]) => (
    <StyledList key={date} disablePadding>
      <ListSubheader disableGutters>{date}</ListSubheader>
      {transactions.map(transaction => {
        const isSubtraction = transaction.amount > 0;
        return (
          <ListItem disableGutters key={transaction.id}>
            <ListItemText
              secondary={formatMoney(Math.abs(transaction.amount))}
              primaryTypographyProps={{
                color: isSubtraction ? 'error' : 'secondary'
              }}
            >
              {isSubtraction ? '-' : '+'}
              {transaction.player.ign}
            </ListItemText>
          </ListItem>
        );
      })}
    </StyledList>
  ));
}

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired
};
