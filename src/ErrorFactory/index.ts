import {
  ApplicationCommandOptionNew,
  ApplicationCommandTypeValue,
  OptionTypeBase,
} from '..'
import BooleanErrorFactory from './BooleanErrorFactory'
import ChannelErrorFactory from './ChannelErrorFactory'
import IntegerErrorFactory from './IntegerErrorFactory'
import NumberErrorFactory from './NumberErrorFactory'
import StringErrorFactory from './StringErrorFactory'
import UserErrorFactory from './UserErrorFactory'

export default abstract class ErrorFactory<OptionType extends OptionTypeBase> {
  abstract readonly userInput: string
  abstract readonly errorOption: Required<
    Omit<ApplicationCommandOptionNew, 'value'>
  > & {
    position: number
    type: OptionType
    value?: ApplicationCommandTypeValue[OptionType]
  }

  static Boolean = BooleanErrorFactory
  static Channel = ChannelErrorFactory
  static String = StringErrorFactory
  static Number = NumberErrorFactory
  static Integer = IntegerErrorFactory
  static User = UserErrorFactory
}
