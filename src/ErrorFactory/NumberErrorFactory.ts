import {
  ApplicationCommandNumeralChoiceOption,
  ApplicationCommandNumeralNonChoiceOption,
  OptionsError,
} from '..'
import ErrorFactory from '.'

export default class NumberErrorFactory extends ErrorFactory<'NUMBER'> {
  constructor(
    readonly userInput: string,
    readonly errorOption: Required<
      Omit<
        | ApplicationCommandNumeralChoiceOption
        | ApplicationCommandNumeralNonChoiceOption,
        'value' | 'choices'
      >
    > & {
      type: 'NUMBER'
      position: number
      choices?: (
        | ApplicationCommandNumeralChoiceOption
        | ApplicationCommandNumeralNonChoiceOption
      )['choices']
      value?: (
        | ApplicationCommandNumeralChoiceOption
        | ApplicationCommandNumeralNonChoiceOption
      )['value']
    }
  ) {
    super()
  }

  argumentDoesNotMatchAnyOfTheChoices() {
    return new OptionsError<'NUMBER'>(
      'Argument does not match any of the choices',
      '011',
      this.userInput,
      this.errorOption as any
    )
  }

  numberWasNotProvided() {
    return new OptionsError<'NUMBER'>(
      'The number was not provided',
      '012',
      this.userInput,
      this.errorOption as any
    )
  }

  valueIsNotANumber() {
    return new OptionsError<'NUMBER'>(
      'The value is not a number',
      '013',
      this.userInput,
      this.errorOption as any
    )
  }
}
