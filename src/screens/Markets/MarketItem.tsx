import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { AssetPair, Ticker } from 'src/types';
import { formatPrice } from '../../utils/formatPrice';

interface Props {
  assetPair: AssetPair;
  ticker: Ticker | undefined;
  alternate: boolean;
  onPress: () => void;
}

function MarketItem({ assetPair, ticker, alternate, onPress }: Props) {
  return (
    <TouchableHighlight underlayColor="rgba(0,0,0,0.1)" onPress={onPress}>
      <View style={[styles.content, alternate && styles.contentAlternate]}>
        <Text style={styles.column}>{assetPair.title}</Text>
        <Text style={styles.column}>
          {(ticker && formatPrice(ticker.price, assetPair)) || '-'}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

function MarketItemHeader() {
  return (
    <View style={[styles.content, styles.contentHeader]}>
      <Text style={[styles.column, styles.columnHeader]}>Pair</Text>
      <Text style={[styles.column, styles.columnHeader]}>Price</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentAlternate: { backgroundColor: 'rgba(0,0,0,0.05)' },
  contentHeader: {
    paddingVertical: undefined,
    backgroundColor: 'rgb(36, 31, 101)',
  },
  column: {
    color: 'black',
  },
  columnHeader: {
    color: 'white',
    fontWeight: 'bold',
  },
});

MarketItem.Header = MarketItemHeader;

export default MarketItem;
