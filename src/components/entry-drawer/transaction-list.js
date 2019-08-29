import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {List, ListItem, ListItemText, ListSubheader} from '@material-ui/core';
import {formatDate, formatMoney} from '../../utils/format';
import {groupBy} from 'lodash';

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
