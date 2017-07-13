import * as React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'

import { getDigitAtIndex, setDigitAtIndex } from './utils'

export interface InputState {
  value: number | null
  nextDigitIndex: number
}

export interface Props {
  style?: ViewStyle

  title?: string
  unitString?: string

  inputState?: InputState

  onValueChange?: (value: number, nextDigitIndex?: number) => void
  onClear?: () => void

  numberOfIntegerDigits: number
  numberOfDecimalDigits?: number
}

export type State = InputState

export default class NumberInput extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    style: {},

    title: '',
    unitString: '',

    onValueChange: () => {},
    onClear: () => {},

    numberOfDecimalDigits: 0,
  }

  state = {
    value: null,
    nextDigitIndex: 0,
  }

  private getInputState = () =>
    this.props.inputState ? this.props.inputState : this.state

  private onDigitPress(digit: string) {
    const { value, nextDigitIndex } = this.getInputState()
    let newValue: number

    // typeof value === 'number' is necessary to make TypeScript shut up
    if (typeof value === 'number' && Number.isFinite(value)) {
      if (nextDigitIndex < this.props.numberOfIntegerDigits) {
        newValue = setDigitAtIndex(
          value,
          this.props.numberOfIntegerDigits,
          nextDigitIndex,
          Number(digit),
        )
      } else if (nextDigitIndex === this.props.numberOfIntegerDigits) {
        newValue = Number(`${Math.floor(value)}.${digit}`)
      } else {
        newValue = Number(
          value.toFixed(nextDigitIndex - this.props.numberOfIntegerDigits) +
            digit,
        )
      }
    } else {
      const valueString = [
        digit,
        ...Array(this.props.numberOfIntegerDigits - 1).fill('0'),
      ]
      newValue = Number(valueString.join(''))
    }

    if (this.props.inputState) {
      this.props.onValueChange &&
        this.props.onValueChange(
          newValue,
          this.props.inputState.nextDigitIndex + 1,
        )
    } else {
      this.setState({
        value: newValue,
        nextDigitIndex: this.state.nextDigitIndex + 1,
      })
      this.props.onValueChange && this.props.onValueChange(newValue)
    }

    this.props.onValueChange && this.props.onValueChange(newValue)
  }

  render() {
    const { value, nextDigitIndex } = this.getInputState()
    let valueArray: Array<string | null> = []

    // typeof value === 'number' is necessary to make TypeScript shut up
    if (typeof value === 'number' && Number.isFinite(value)) {
      for (
        let i = 0;
        i <
        this.props.numberOfIntegerDigits + this.props.numberOfDecimalDigits!;
        i++
      ) {
        if (i < nextDigitIndex) {
          valueArray.push(
            getDigitAtIndex(value, this.props.numberOfIntegerDigits, i),
          )
        } else {
          valueArray.push(null)
        }

        if (
          i === this.props.numberOfIntegerDigits - 1 &&
          this.props.numberOfDecimalDigits! > 0
        ) {
          valueArray.push('.')
        }
      }
    } else {
      valueArray = [
        ...Array(this.props.numberOfIntegerDigits).fill(null),
        ...(this.props.numberOfDecimalDigits! > 0
          ? ['.', ...Array(this.props.numberOfDecimalDigits).fill(null)]
          : []),
      ]
    }

    const clearButtonDisabled = nextDigitIndex === 0
    const digitButtonsDisabled =
      nextDigitIndex >=
      this.props.numberOfIntegerDigits + this.props.numberOfDecimalDigits!

    return (
      <View style={[{ height: 140 }, this.props.style]}>
        <View
          style={{
            flex: 0,
            alignItems: 'center',
            flexDirection: 'row',
            height: 40,
          }}
        >
          <Text style={styles.titleText}>
            {this.props.title}:
          </Text>
          <View style={styles.valueContainer}>
            {valueArray.map((c, i) => {
              let isGrayedOut
              if (nextDigitIndex <= this.props.numberOfIntegerDigits) {
                isGrayedOut = i > nextDigitIndex - 1
              } else {
                isGrayedOut = i > nextDigitIndex
              }

              if (c === null) {
                return (
                  <Text
                    key={i}
                    style={[
                      styles.valueCharacter,
                      isGrayedOut ? styles.valueCharacterGray : {},
                    ]}
                  >
                    0
                  </Text>
                )
              }
              return (
                <Text
                  key={i}
                  style={[
                    styles.valueCharacter,
                    isGrayedOut ? styles.valueCharacterGray : {},
                  ]}
                >
                  {c}
                </Text>
              )
            })}
          </View>
          <Text style={styles.unitText}>
            {this.props.unitString}
          </Text>
          <TouchableOpacity
            onPress={this.props.onClear}
            style={[
              styles.clearButton,
              clearButtonDisabled ? styles.clearButtonDisabled : {},
            ]}
            disabled={clearButtonDisabled}
          >
            <Text
              style={[
                clearButtonDisabled ? styles.clearButtonTextDisabled : {},
              ]}
            >
              清除
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {['0', '1', '2', '3', '4'].map((d: string) =>
            <TouchableOpacity
              key={d}
              style={[
                styles.digitButton,
                digitButtonsDisabled ? styles.digitButtonDisabled : {},
                d === '0' ? { marginLeft: 0 } : {},
                d === '4' ? { marginRight: 0 } : {},
              ]}
              onPress={() => this.onDigitPress(d)}
              disabled={digitButtonsDisabled}
            >
              <Text
                style={[
                  styles.digitButtonText,
                  digitButtonsDisabled ? styles.digitButtonTextDisabled : {},
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>,
          )}
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {['5', '6', '7', '8', '9'].map((d: string) =>
            <TouchableOpacity
              key={d}
              style={[
                styles.digitButton,
                digitButtonsDisabled ? styles.digitButtonDisabled : {},
                d === '5' ? { marginLeft: 0 } : {},
                d === '9' ? { marginRight: 0 } : {},
              ]}
              onPress={() => this.onDigitPress(d)}
              disabled={digitButtonsDisabled}
            >
              <Text
                style={[
                  styles.digitButtonText,
                  digitButtonsDisabled ? styles.digitButtonTextDisabled : {},
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>,
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    marginRight: 10,
  } as TextStyle,
  valueContainer: {
    flexDirection: 'row',
    marginRight: 10,
  } as ViewStyle,
  valueCharacter: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Courier New',
  } as TextStyle,
  valueCharacterGray: {
    color: '#ccc',
  } as TextStyle,
  unitText: {
    fontSize: 20,
    flex: 1,
  } as TextStyle,
  clearButton: {
    borderRadius: 4,
    padding: 5,
    margin: 5,
    marginRight: 0,
    borderWidth: 1,
    borderColor: '#aaa',
  } as ViewStyle,
  clearButtonDisabled: {
    borderColor: '#ccc',
  } as ViewStyle,
  clearButtonTextDisabled: {
    color: '#aaa',
  } as TextStyle,
  digitButton: {
    borderRadius: 4,
    padding: 5,
    flex: 1,
    height: 45,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d8d8d8',
  } as ViewStyle,
  digitButtonDisabled: {
    backgroundColor: '#f4f4f4',
  } as ViewStyle,
  digitButtonText: {
    fontSize: 16,
  },
  digitButtonTextDisabled: {
    color: '#aaa',
  } as TextStyle,
})
