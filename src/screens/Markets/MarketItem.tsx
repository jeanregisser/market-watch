import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { AssetPair, Ticker } from 'src/types';
import { formatPrice } from '../../utils/formatPrice';

interface Props {
  assetPair: AssetPair;
  ticker: Ticker | undefined;
  onPress: () => void;
}

export default function MarketItem({ assetPair, ticker, onPress }: Props) {
  return (
    <TouchableHighlight underlayColor="rgba(0,0,0,0.1)" onPress={onPress}>
      <View style={styles.content}>
        <Text>{assetPair.title}</Text>
        <Text>{(ticker && formatPrice(ticker.price, assetPair)) || '-'}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
