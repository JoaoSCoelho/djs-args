import {
  ApplicationCommandNumeralChoiceOption,
  ApplicationCommandNumeralNonChoiceOption,
  OptionsError,
} from '..'
import ErrorFactory from '.'

export default class IntegerErrorFactory extends ErrorFactory<'INTEGER'> {
  constructor(
    readonly userInput: string,
    readonly errorOption: Required<
      Omit<
        | ApplicationCommandNumeralChoiceOption
        | ApplicationCommandNumeralNonChoiceOption,
        'value' | 'choices'
      >
    > & {
      type: 'INTEGER'
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
    return new OptionsError<'INTEGER'>(
      'Argument does not match any of the choices',
      '014',
      this.userInput,
      this.errorOption as any
    )
  }

  integerWasNotProvided() {
    return new OptionsError<'INTEGER'>(
      'The integer was not provided',
      '015',
      this.userInput,
      this.errorOption as any
    )
  }

  valueIsNotAInteger() {
    return new OptionsError<'INTEGER'>(
      'The value is not a integer',
      '016',
      this.userInput,
      this.errorOption as any
    )
  }
}
