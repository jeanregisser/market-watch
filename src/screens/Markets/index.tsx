import _ from 'lodash';
import React, { useMemo } from 'react';
import { RefreshControl, SectionList, StyleSheet } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { connectRequest, querySelectors } from 'redux-query';
import { AssetPair, Ticker } from 'src/types';
import { API_BASE_URL } from '../../env';
import MarketItem from './MarketItem';

interface Props {
  isLoading: boolean;
  forceRequest: () => void;
  assetPairs: Record<string, AssetPair>;
  tickers: Record<string, Ticker>;
  navigation: NavigationScreenProp<NavigationState>;
}

function Markets({
  isLoading,
  forceRequest,
  assetPairs,
  tickers,
  navigation,
}: Props) {
  const section = useMemo(
    () => [{ key: 's0', data: Object.values(assetPairs) }],
    [assetPairs],
  );

  return (
    <SectionList
      style={styles.container}
      sections={section}
      keyExtractor={item => item.id}
      ListFooterComponent={<SafeAreaView forceInset={{ bottom: 'always' }} />}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={forceRequest} />
      }
      renderItem={({ item, index }) => (
        <MarketItem
          assetPair={item}
          ticker={tickers[item.id]}
          alternate={index % 2 === 0}
          onPress={() =>
            navigation.navigate('MarketDetails', {
              pairId: item.id,
              title: item.title,
            })
          }
        />
      )}
      renderSectionHeader={() => <MarketItem.Header />}
    />
  );
}

const styles = StyleSheet.create({
  container: {},
});

const marketsRequest = () => ({
  url: `${API_BASE_URL}/AssetPairs`,
  transform: (response: any) => {
    const items: any[] = _.get(response, ['result'], {});
    const assetPairs = Object.entries(items)
      .map(
        ([key, value]): AssetPair => ({
          id: key,
          title: value.wsname,
          quote: value.quote,
        }),
      )
      // Some pairs don't have a title, leave them out
      .filter(({ title }) => Boolean(title));

    return {
      assetPairs: _.keyBy(assetPairs, 'id'),
    };
  },
  update: {
    assetPairs: (prev: any, next: any) => next,
  },
});

const tickersRequest = (pairs: string[]) => ({
  url: `${API_BASE_URL}/Ticker`,
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
});

const mapStateToProps = (state: any) => ({
  isLoading: querySelectors.isPending(state.queries, marketsRequest()),
  assetPairs: state.entities.assetPairs || {},
  tickers: state.entities.tickers || {},
});

// Map props from `mapStateToProps` to a request query config.
const mapPropsToConfigs = (props: any) => {
  const configs: any[] = [marketsRequest()];

  const pairs = Object.keys(props.assetPairs);
  if (pairs.length > 0) {
    configs.push(tickersRequest(pairs));
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
  headerBackTitle: null,
};

export default MarketsContainer;
