import { ChannelTypes } from 'discord.js/typings/enums'
import {
  ApplicationCommandChannelOptionNew,
  ChannelMatchBy,
  OptionsError,
} from '..'
import ErrorFactory from '.'

export default class ChannelErrorFactory extends ErrorFactory<'CHANNEL'> {
  constructor(
    readonly userInput: string,
    readonly errorOption: Required<
      Omit<ApplicationCommandChannelOptionNew, 'value'>
    > & {
      position: number
      value?: ApplicationCommandChannelOptionNew['value']
    }
  ) {
    super()
  }

  public channelNotFoundByMention() {
    return this.channelNotFound('MENTION', '002')
  }

  public channelNotFoundById() {
    return this.channelNotFound('ID', '003')
  }

  public channelNotFoundByName() {
    return this.channelNotFound('NAME', '004')
  }

  public channelDoesNotBelongToThisGuild() {
    return new OptionsError<'CHANNEL'>(
      `Channel does not belong to this guild`,
      '005',
      this.userInput,
      this.errorOption
    )
  }

  public invalidChannelType(channelType: keyof typeof ChannelTypes) {
    return new OptionsError<'CHANNEL'>(
      `Invalid channel type: ${channelType}`,
      '006',
      this.userInput,
      this.errorOption
    )
  }

  public channelWasNotProvided() {
    return new OptionsError(
      'The channel was not provided',
      '007',
      this.userInput,
      this.errorOption
    )
  }

  public moreOfOneChannelWasFound() {
    return new OptionsError(
      'More than one matching channel was found',
      '008',
      this.userInput,
      this.errorOption
    )
  }

  public channelNotFoundBy(by: ChannelMatchBy) {
    if (by === 'MENTION') return this.channelNotFoundByMention()
    if (by === 'ID') return this.channelNotFoundById()
    if (by === 'NAME') return this.channelNotFoundByName()
  }

  private channelNotFound(by: ChannelMatchBy, code: `${number}`) {
    return new OptionsError<'CHANNEL'>(
      `Channel not found by ${by}`,
      code,
      this.userInput,
      this.errorOption
    )
  }
}
