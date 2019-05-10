import _ from 'lodash';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { connectRequest, querySelectors } from 'redux-query';
import { Spread, Trade } from 'src/types';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';
import { API_BASE_URL } from '../../env';

interface MarketDetailsProps {
  spreads: Spread[];
  recentTrades: Trade[];
}

function MarketDetails({ spreads, recentTrades }: MarketDetailsProps) {
  const askData = useMemo(
    () =>
      spreads.map(({ time, askPrice }) => ({
        time,
        askPrice: parseFloat(askPrice),
      })),
    [spreads],
  );

  const bidData = useMemo(
    () =>
      spreads.map(({ time, bidPrice }) => ({
        time,
        bidPrice: parseFloat(bidPrice),
      })),
    [spreads],
  );

  return (
    <View style={styles.container}>
      <VictoryChart
        width={Dimensions.get('window').width}
        theme={VictoryTheme.material}
        domainPadding={{ x: 10 }}
      >
        <VictoryLine data={askData} x="time" y="askPrice" />
        <VictoryLine
          data={bidData}
          x="time"
          y="bidPrice"
          style={{
            data: { stroke: '#c43a31' },
          }}
        />
      </VictoryChart>
    </View>
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

  const { spreads, recentTrades } = state.entities;

  return {
    isLoading: querySelectors.isPending(
      state.queries,
      recentTradesRequest(pairId),
    ),
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
