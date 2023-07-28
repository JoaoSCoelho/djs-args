import {
  ApplicationCommandStringChoiceOption,
  ApplicationCommandStringNonChoiceOption,
  OptionsError,
} from '..'
import ErrorFactory from '.'

export default class StringErrorFactory extends ErrorFactory<'STRING'> {
  constructor(
    readonly userInput: string,
    readonly errorOption: Required<
      Omit<
        | ApplicationCommandStringChoiceOption
        | ApplicationCommandStringNonChoiceOption,
        'value' | 'choices'
      >
    > & {
      position: number
      choices?: (
        | ApplicationCommandStringChoiceOption
        | ApplicationCommandStringNonChoiceOption
      )['choices']
      value?: (
        | ApplicationCommandStringChoiceOption
        | ApplicationCommandStringNonChoiceOption
      )['value']
    }
  ) {
    super()
  }

  argumentDoesNotMatchAnyOfTheChoices() {
    return new OptionsError<'STRING'>(
      'Argument does not match any of the choices',
      '009',
      this.userInput,
      this.errorOption as any
    )
  }

  providingAnArgumentIsRequired() {
    return new OptionsError<'STRING'>(
      'Providing an argument is required',
      '010',
      this.userInput,
      this.errorOption as any
    )
  }
}
