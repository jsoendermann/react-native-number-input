/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View } from 'react-native'

import NumberInput from 'react-native-number-input'

export default class App extends Component {
  state = { value: 12 }
  render() {
    return (
      <View style={styles.container}>
        <NumberInput
          style={{ width: 300 }}
          title="Haluo"
          onValueChange={console.log}
          onClear={() => console.log('CLEAR')}
          numberOfIntegerDigits={4}
          numberOfDecimalDigits={2}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
})
