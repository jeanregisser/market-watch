import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AssetPair, Trade } from 'src/types';
import { formatPrice } from '../../utils/formatPrice';

interface Props {
  assetPair: AssetPair;
  trade: Trade;
  alternate: boolean;
}

function TradeItem({ assetPair, trade, alternate }: Props) {
  const isBuy = trade.order === 'b';
  return (
    <View style={[styles.container, alternate && styles.containerAlternate]}>
      <Text style={styles.column}>
        {moment(trade.time * 1000).format('LTS')}
      </Text>
      <Text
        style={[
          styles.column,
          styles.order,
          isBuy ? styles.orderBuy : styles.orderSell,
        ]}
      >
        {isBuy ? 'buy' : 'sell'}
      </Text>
      <Text style={styles.column}>{formatPrice(trade.price, assetPair)}</Text>
      <Text style={[styles.column, styles.volume]}>{trade.volume}</Text>
    </View>
  );
}

function TradeItemHeader() {
  return (
    <View style={[styles.container, styles.containerHeader]}>
      <Text style={[styles.column, styles.columnHeader]}>Time</Text>
      <Text style={[styles.column, styles.order, styles.columnHeader]}>
        Order
      </Text>
      <Text style={[styles.column, styles.columnHeader]}>Price</Text>
      <Text style={[styles.column, styles.volume, styles.columnHeader]}>
        Volume
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  containerAlternate: { backgroundColor: 'rgba(0,0,0,0.05)' },
  containerHeader: {
    backgroundColor: 'rgb(36, 31, 101)',
  },
  column: {
    flex: 1,
    color: 'black',
  },
  columnHeader: {
    color: 'white',
    fontWeight: 'bold',
  },
  order: {
    flex: 0.5,
  },
  orderBuy: {
    color: 'green',
  },
  orderSell: {
    color: 'red',
  },
  volume: {
    textAlign: 'right',
  },
});

TradeItem.Header = TradeItemHeader;

export default TradeItem;
