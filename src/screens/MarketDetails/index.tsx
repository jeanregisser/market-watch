import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

interface MarketDetailsProps {}

function MarketDetails(props: MarketDetailsProps) {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

MarketDetails.navigationOptions = ({
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState>;
}) => ({
  title: navigation.getParam('title', 'Unknown'),
});

export default MarketDetails;
