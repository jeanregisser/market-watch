import _ from 'lodash';
import moment from 'moment';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { connectRequest, querySelectors } from 'redux-query';
import { AssetPair, Spread, Trade } from 'src/types';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from 'victory-native';
import { API_BASE_URL } from '../../env';
import { formatPrice } from '../../utils/formatPrice';

function formatTimeTick(timestamp: number) {
  return moment(timestamp * 1000).format('LTS');
}

interface MarketDetailsProps {
  assetPair: AssetPair;
  spreads: Spread[];
  recentTrades: Trade[];
}

function MarketDetails({
  assetPair,
  spreads,
  recentTrades,
}: MarketDetailsProps) {
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

  const spreadData = useMemo(
    () =>
      askData.map(({ time, askPrice }, index) => ({
        time,
        spread: askPrice - bidData[index].bidPrice,
      })),
    [askData, bidData],
  );

  const { width } = Dimensions.get('window');
  const theme = VictoryTheme.material;
  const domainPadding = { y: 20 };
  const padding = { bottom: 30 };
  const tickCount = Math.floor(width / 90);
  const timeAxisTickFormat = (y: number) => formatPrice(y, assetPair);
  const axisStyle = { tickLabels: { fill: 'rgb(102,102,102)' } };

  return (
    <View style={styles.container}>
      <VictoryChart
        width={width}
        theme={theme}
        domainPadding={domainPadding}
        padding={padding}
      >
        <VictoryAxis
          style={axisStyle}
          tickCount={tickCount}
          tickFormat={formatTimeTick}
        />
        <VictoryAxis
          dependentAxis
          style={axisStyle}
          orientation="right"
          offsetX={width}
          tickFormat={timeAxisTickFormat}
        />
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
      <VictoryChart
        width={width}
        height={200}
        theme={theme}
        domainPadding={domainPadding}
        padding={padding}
      >
        <VictoryAxis
          style={axisStyle}
          tickCount={tickCount}
          tickFormat={formatTimeTick}
        />
        <VictoryAxis
          dependentAxis
          style={axisStyle}
          orientation="right"
          offsetX={width}
          tickFormat={timeAxisTickFormat}
        />
        <VictoryArea
          style={{ data: { fill: 'rgb(80,110,130)' } }}
          data={spreadData}
          x="time"
          y="spread"
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
