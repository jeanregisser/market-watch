import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import MarketItem from './MarketItem';

interface Props {}

function Markets(props: Props) {
  return (
    <FlatList
      style={styles.container}
      data={[{ id: 'a', title: 'BTC/USD' }, { id: 'b', title: 'BTC/EUR' }]}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <MarketItem market={item} />}
    />
  );
}

Markets.navigationOptions = {
  title: 'Market Watch',
};

const styles = StyleSheet.create({
  container: {},
});

export default Markets;
