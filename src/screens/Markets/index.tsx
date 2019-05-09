import _ from 'lodash';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { connectRequest, querySelectors } from 'redux-query';
import { AssetPair, Ticker } from 'src/types';
import MarketItem from './MarketItem';

interface Props {
  assetPairs: Record<string, AssetPair>;
  tickers: Record<string, Ticker>;
}

function Markets({ assetPairs, tickers }: Props) {
  const data = Object.values(assetPairs);

  return (
    <FlatList
      style={styles.container}
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <MarketItem assetPair={item} ticker={tickers[item.id]} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {},
});

// Can you decipher this? :D
const BASE_URL = 'cilbup/0/moc.nekark.ipa//:sptth'
  .split('')
  .reverse()
  .join('');

const marketsRequest = (force = false) => ({
  url: `${BASE_URL}/AssetPairs`,
  transform: (response: any) => {
    const items: any[] = _.get(response, ['result'], {});
    const assetPairs = Object.entries(items)
      .map(([key, value]) => ({
        id: key,
        title: value.wsname,
      }))
      // Some pairs don't have a title, leave them out
      .filter(({ title }) => Boolean(title));

    return {
      assetPairs: _.keyBy(assetPairs, 'id'),
    };
  },
  update: {
    assetPairs: (prev: any, next: any) => next,
  },
  force,
});

const tickersRequest = (pairs: string[], force = false) => ({
  url: `${BASE_URL}/Ticker`,
  body: { pair: pairs.join(',') },
  transform: (response: any) => {
    const items: any[] = _.get(response, ['result'], {});
    const tickers = Object.entries(items).map(([key, value]) => ({
      id: key,
      price: value.p[1],
    }));

    return {
      tickers: _.keyBy(tickers, 'id'),
    };
  },
  update: {
    tickers: (prev: any, next: any) => next,
  },
  force,
});

const mapStateToProps = (state: any) => ({
  isLoading: querySelectors.isPending(state.queries, marketsRequest()),
  assetPairs: state.entities.assetPairs || {},
  tickers: state.entities.tickers || {},
});

// Map props from `mapStateToProps` to a request query config.
const mapPropsToConfigs = (props: any) => {
  const configs: any[] = [marketsRequest(props.force)];

  const pairs = Object.keys(props.assetPairs);
  if (pairs.length > 0) {
    configs.push(tickersRequest(pairs, props.force));
  }

  return configs;
};

const MarketsContainer = compose(
  connect(mapStateToProps),
  connectRequest(mapPropsToConfigs),
  // @ts-ignore
)(Markets);

MarketsContainer.navigationOptions = {
  title: 'Market Watch',
};

export default MarketsContainer;
