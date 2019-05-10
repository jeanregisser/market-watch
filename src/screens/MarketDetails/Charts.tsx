import moment from 'moment';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { AssetPair, Spread } from 'src/types';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from 'victory-native';
import { formatPrice } from '../../utils/formatPrice';
import SectionTitle from './SectionTitle';

function formatTimeTick(timestamp: number) {
  return moment(timestamp * 1000).format('LTS');
}

interface Props {
  assetPair: AssetPair;
  spreads: Spread[];
}

export default function Charts({ assetPair, spreads }: Props) {
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
      <SectionTitle title="Bids/Asks" />
      <VictoryChart
        width={width}
        height={250}
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
      <SectionTitle title="Spread" />
      <VictoryChart
        width={width}
        height={150}
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
