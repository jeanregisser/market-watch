import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Market } from 'src/types';

interface Props {
  market: Market;
}

export default function MarketItem({ market }: Props) {
  return (
    <View style={styles.container}>
      <Text>{market.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
