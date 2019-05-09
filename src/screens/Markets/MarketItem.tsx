import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AssetPair, Ticker } from 'src/types';

interface Props {
  assetPair: AssetPair;
  ticker: Ticker | undefined;
}

export default function MarketItem({ assetPair, ticker }: Props) {
  return (
    <View style={styles.container}>
      <Text>{assetPair.title}</Text>
      <Text>{(ticker && ticker.price) || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
