import checkBooleanOption from './boolean'
import { Client, Message } from 'discord.js'
import OptionsCommand, {
  ApplicationCommandOptionNew,
  ApplicationCommandTypeValue,
  OptionTypeBase,
} from '..'
import checkChannelOption from './channel'
import checkStringOption from './string'
import checkNumberOption from './number'
import checkIntegerOption from './integer'

export default class CheckIndividualOption<OptionType extends OptionTypeBase> {
  constructor(
    readonly optionsCommand: OptionsCommand,
    readonly option: ApplicationCommandOptionNew & {
      type: OptionType
    },
    readonly userInput: string,
    readonly optionIndex: number,
    readonly message: Message,
    readonly client: Client
  ) {}

  public check(): Promise<ApplicationCommandTypeValue[OptionType] | undefined> {
    if (this.option.type === 'BOOLEAN') {
      return checkBooleanOption.call(this as CheckIndividualOption<'BOOLEAN'>)
    }
    if (this.option.type === 'CHANNEL') {
      return checkChannelOption.call(this as CheckIndividualOption<'CHANNEL'>)
    }
    if (this.option.type === 'STRING') {
      return checkStringOption.call(this as CheckIndividualOption<'STRING'>)
    }
    if (this.option.type === 'NUMBER') {
      return checkNumberOption.call(this as CheckIndividualOption<'NUMBER'>)
    }
    if (this.option.type === 'INTEGER') {
      return checkIntegerOption.call(this as CheckIndividualOption<'INTEGER'>)
    }
    if (this.option.type === 'USER') {
      return checkUserOption.call(this as CheckIndividualOption<'USER'>)
    }
    if (this.option.type === 'ROLE') {
      return checkRoleOption.call(this as CheckIndividualOption<'ROLE'>)
    }
    if (this.option.type === 'MENTIONABLE') {
      return checkMentionableOption.call(
        this as CheckIndividualOption<'MENTIONABLE'>
      )
    }

    return new Promise((resolve) => resolve(undefined))
  }
}

export type CheckIndividualOptionFunc<OptionType extends OptionTypeBase> = (
  this: CheckIndividualOption<OptionType>
) => Promise<ApplicationCommandTypeValue[OptionType] | undefined>
