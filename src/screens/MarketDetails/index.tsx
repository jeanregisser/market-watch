import _ from 'lodash';
import moment from 'moment';
import React, { useMemo } from 'react';
import { RefreshControl, SectionList, StyleSheet, View } from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
} from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { connectRequest, querySelectors } from 'redux-query';
import { AssetPair, Spread, Trade } from 'src/types';
import { API_BASE_URL } from '../../env';
import { formatPrice } from '../../utils/formatPrice';
import Charts from './Charts';
import SectionTitle from './SectionTitle';
import TradeItem from './TradeItem';

function formatTimeTick(timestamp: number) {
  return moment(timestamp * 1000).format('LTS');
}

interface MarketDetailsProps {
  isLoading: boolean;
  forceRequest: () => void;
  assetPair: AssetPair;
  spreads: Spread[];
  recentTrades: Trade[];
}

function MarketDetails({
  isLoading,
  forceRequest,
  assetPair,
  spreads,
  recentTrades,
}: MarketDetailsProps) {
  const sections = useMemo(
    () => [
      {
        key: 's0',
        data: recentTrades.slice().reverse(),
      },
    ],
    [recentTrades],
  );

  return (
    <SectionList
      style={styles.container}
      sections={sections}
      keyExtractor={(item, index) => item + index}
      ListHeaderComponent={<Charts assetPair={assetPair} spreads={spreads} />}
      ListFooterComponent={<SafeAreaView forceInset={{ bottom: 'always' }} />}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={forceRequest} />
      }
      renderItem={({ item, index, section }) => (
        <TradeItem
          assetPair={assetPair}
          trade={item}
          alternate={index % 2 === 0}
        />
      )}
      renderSectionHeader={() => (
        <View>
          <SectionTitle title="Recent Trades" />
          <TradeItem.Header />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const recentTradesRequest = (pairId: string, force = false) => ({
  url: `${API_BASE_URL}/Trades`,
  body: { pair: pairId },
  transform: (response: any) => {
    const items: any[] = _.get(response, ['result', pairId], []);
    const trades = items.map(
      (item: any[]): Trade => ({
        price: item[0],
        volume: item[1],
        time: item[2],
        order: item[3],
      }),
    );

    return {
      recentTrades: { [pairId]: trades },
    };
  },
  update: {
    recentTrades: (prev: any, next: any) => ({ ...prev, ...next }),
  },
  force,
});

const spreadRequest = (pairId: string, force = false) => ({
  url: `${API_BASE_URL}/Spread`,
  body: { pair: pairId },
  transform: (response: any) => {
    const items: any[] = _.get(response, ['result', pairId], []);
    const spreads = items.map(
      (item: any[]): Spread => ({
        time: item[0],
        bidPrice: item[1],
        askPrice: item[2],
      }),
    );

    return {
      spreads: { [pairId]: spreads },
    };
  },
  update: {
    spreads: (prev: any, next: any) => ({ ...prev, ...next }),
  },
  force,
});

interface OwnProps {
  force: boolean;
  navigation: NavigationScreenProp<NavigationState>;
}

const mapStateToProps = (state: any, { navigation }: OwnProps) => {
  const pairId = navigation.getParam('pairId');

  const { assetPairs, spreads, recentTrades } = state.entities;

  return {
    isLoading: querySelectors.isPending(
      state.queries,
      recentTradesRequest(pairId),
    ),
    assetPair: _.get(assetPairs, pairId, {}),
    spreads: _.get(spreads, pairId, []),
    recentTrades: _.get(recentTrades, pairId, []),
  };
};

// Map props from `mapStateToProps` to a request query config.
const mapPropsToConfigs = ({ navigation, force }: OwnProps) => {
  const pairId = navigation.getParam('pairId');
  return [spreadRequest(pairId, force), recentTradesRequest(pairId, force)];
};

const MarketDetailsContainer = compose(
  connect(mapStateToProps),
  connectRequest(mapPropsToConfigs),
  // @ts-ignore
)(MarketDetails);

MarketDetailsContainer.navigationOptions = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => ({
  title: navigation.getParam('title', 'Unknown'),
});

export default MarketDetailsContainer;
