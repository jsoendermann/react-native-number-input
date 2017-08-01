import * as React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import styled from 'styled-components/native'

import { getDigitAtIndex, setDigitAtIndex } from './utils'

export interface InputState {
  value: number | null
  nextDigitIndex: number
}

export interface Props {
  style?: ViewStyle

  titleTextStyle?: TextStyle
  numberTextStyle?: TextStyle
  inactiveNumberTextStyle?: TextStyle
  unitTextStyle?: TextStyle
  clearButtonStyle: ViewStyle
  inactiveClearButtonStyle: ViewStyle
  clearTextStyle?: TextStyle
  inactiveClearTextStyle?: TextStyle

  digitsButtonStyle?: ViewStyle
  inactiveDigitsButtonStyle?: ViewStyle
  digitsTextStyle?: TextStyle
  inactiveDigitsTextStyle?: TextStyle

  title?: string
  unitString?: string
  clearString?: string

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
    titleTextStyle: {},
    numberTextStyle: {},
    clearTextStyle: {},
    digitsTextStyle: {},

    title: '',
    unitString: '',
    clearString: 'Clear',

    onValueChange: () => {},
    onClear: () => {},

    numberOfDecimalDigits: 0,
  }

  state = {
    value: null,
    nextDigitIndex: 0,
  }

  private getInputState = () => (this.props.inputState ? this.props.inputState : this.state)

  private onDigitPress = (digit: string) => {
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
        newValue = Number(value.toFixed(nextDigitIndex - this.props.numberOfIntegerDigits) + digit)
      }
    } else {
      const valueString = [digit, ...Array(this.props.numberOfIntegerDigits - 1).fill('0')]
      newValue = Number(valueString.join(''))
    }

    if (this.props.inputState) {
      this.props.onValueChange &&
        this.props.onValueChange(newValue, this.props.inputState.nextDigitIndex + 1)
    } else {
      this.setState({
        value: newValue,
        nextDigitIndex: this.state.nextDigitIndex + 1,
      })
      this.props.onValueChange!(newValue)
    }

    this.props.onValueChange!(newValue)
  }

  private onClear = () => {
    if (!this.props.inputState) {
      this.setState({
        value: null,
        nextDigitIndex: 0,
      })
    }

    this.props.onClear!()
  }

  render() {
    const { value, nextDigitIndex } = this.getInputState()
    let valueArray: Array<string | null> = []

    // typeof value === 'number' is necessary to make TypeScript shut up
    if (typeof value === 'number' && Number.isFinite(value)) {
      for (
        let i = 0;
        i < this.props.numberOfIntegerDigits + this.props.numberOfDecimalDigits!;
        i++
      ) {
        if (i < nextDigitIndex) {
          valueArray.push(getDigitAtIndex(value, this.props.numberOfIntegerDigits, i))
        } else {
          valueArray.push(null)
        }

        if (i === this.props.numberOfIntegerDigits - 1 && this.props.numberOfDecimalDigits! > 0) {
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
      nextDigitIndex >= this.props.numberOfIntegerDigits + this.props.numberOfDecimalDigits!

    const valueElements = valueArray.map((c, i) => {
      let isGrayedOut
      if (nextDigitIndex <= this.props.numberOfIntegerDigits) {
        isGrayedOut = i > nextDigitIndex - 1
      } else {
        isGrayedOut = i > nextDigitIndex
      }

      if (c === null) {
        return (
          <InactiveValueCharacter
            key={i}
            style={[
              this.props.numberTextStyle,
              isGrayedOut ? this.props.inactiveNumberTextStyle : {},
            ]}
          >
            0
          </InactiveValueCharacter>
        )
      }
      return (
        <ValueCharacter
          key={i}
          style={[
            this.props.numberTextStyle,
            isGrayedOut ? this.props.inactiveNumberTextStyle : {},
          ]}
        >
          {c}
        </ValueCharacter>
      )
    })

    const zeroToFour = ['0', '1', '2', '3', '4']
    const fiveToNine = ['5', '6', '7', '8', '9']

    return (
      <View style={this.props.style}>
        <TopRowContainer>
          <TitleText style={this.props.titleTextStyle}>
            {this.props.title}:
          </TitleText>

          <ValueContainer>
            {valueElements}
          </ValueContainer>

          <UnitText style={this.props.unitTextStyle}>
            {this.props.unitString}
          </UnitText>

          <ClearButton
            onPress={this.onClear}
            style={[
              this.props.clearButtonStyle,
              clearButtonDisabled ? this.props.inactiveClearButtonStyle : {},
            ]}
            disabled={clearButtonDisabled}
          >
            <Text
              style={[
                this.props.clearTextStyle,
                clearButtonDisabled ? this.props.inactiveClearTextStyle : {},
              ]}
            >
              {this.props.clearString!}
            </Text>
          </ClearButton>
        </TopRowContainer>

        <DigitRowContainer>
          {zeroToFour.map((d: string) =>
            <DigitButton
              key={d}
              style={[
                this.props.digitsButtonStyle,
                digitButtonsDisabled ? this.props.inactiveDigitsButtonStyle : {},
                d === '0' ? { marginLeft: 0 } : {},
                d === '4' ? { marginRight: 0 } : {},
              ]}
              onPress={() => this.onDigitPress(d)}
              disabled={digitButtonsDisabled}
            >
              <DigitText
                style={[
                  this.props.digitsTextStyle,
                  digitButtonsDisabled ? this.props.inactiveDigitsTextStyle : {},
                ]}
              >
                {d}
              </DigitText>
            </DigitButton>,
          )}
        </DigitRowContainer>
        <DigitRowContainer>
          {fiveToNine.map((d: string) =>
            <DigitButton
              key={d}
              style={[
                this.props.digitsButtonStyle,
                digitButtonsDisabled ? this.props.inactiveDigitsButtonStyle : {},
                d === '5' ? { marginLeft: 0 } : {},
                d === '9' ? { marginRight: 0 } : {},
              ]}
              onPress={() => this.onDigitPress(d)}
              disabled={digitButtonsDisabled}
            >
              <DigitText
                style={[
                  this.props.digitsTextStyle,
                  digitButtonsDisabled ? this.props.inactiveDigitsTextStyle : {},
                ]}
              >
                {d}
              </DigitText>
            </DigitButton>,
          )}
        </DigitRowContainer>
      </View>
    )
  }
}

const TopRowContainer = styled.View`
  flex-grow: 0;
  flex-direction: row;
  align-items: center;

  height: 40;
`

const TitleText = styled.Text`
  font-size: 20;
  margin-right: 10;
`

const ValueContainer = styled.View`
  flex-direction: row;
  margin-right: auto;
`

const ValueCharacter = styled.Text`
  font-size: 20;
  font-weight: 800;
  font-family: Courier New;
`

const InactiveValueCharacter = ValueCharacter.extend`color: #ccc;`

const UnitText = styled.Text`
  flex: 1;
  font-size: 20;
`

const ClearButton = styled.TouchableOpacity`
  border-radius: 4;
  border-width: 1;
  border-color: #aaa;

  padding: 5px;

  margin: 5px;
  margin-right: 0px;
`

const DigitRowContainer = styled.View`
  flex: 1;
  flex-direction: row;
`

const DigitButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;

  margin: 2px;
  padding: 5px;
  border-radius: 4;

  background-color: #d8d8d8;
`

const DigitText = styled.Text`font-size: 16;`
