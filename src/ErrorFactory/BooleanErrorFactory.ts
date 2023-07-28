import { ApplicationCommandBooleanOption, OptionsError } from '..'
import ErrorFactory from '.'

export default class BooleanErrorFactory extends ErrorFactory<'BOOLEAN'> {
  constructor(
    readonly userInput: string,
    readonly errorOption: Required<
      Omit<ApplicationCommandBooleanOption, 'value'>
    > & {
      position: number
      value?: ApplicationCommandBooleanOption['value']
    }
  ) {
    super()
  }

  public invalidValue() {
    return new OptionsError<'BOOLEAN'>(
      'Invalid value. Does not match any of the aliases',
      '001',
      this.userInput,
      this.errorOption
    )
  }
}
