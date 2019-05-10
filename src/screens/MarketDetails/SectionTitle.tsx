import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface Props {
  title: string;
}

export default function SectionTitle({ title }: Props) {
  return <Text style={styles.container}>{title}</Text>;
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    fontWeight: 'bold',
    fontSize: 17,
    color: 'rgb(65, 48, 158)',
  },
});
