import { Channel, GuildChannel } from 'discord.js'
import CheckIndividualOption from '../..'
import { ChannelMatchBy } from '../../..'
import ChannelErrorFactory from '../../../ErrorFactory/ChannelErrorFactory'
import byId from './byId'
import byMention from './byMention'
import byName from './byName'

export default class Finders {
  constructor(
    protected readonly checkIndividualOption: CheckIndividualOption<'CHANNEL'> & {
      option: Required<
        Omit<CheckIndividualOption<'CHANNEL'>['option'], 'value'>
      > &
        Pick<CheckIndividualOption<'CHANNEL'>['option'], 'value'>
    },
    protected readonly errorFactory: ChannelErrorFactory
  ) {}

  protected commomVerification(matchMethod: ChannelMatchBy, channel?: Channel) {
    if (!channel) {
      return this.errorFactory.channelNotFoundBy(matchMethod)
    }

    if (
      this.checkIndividualOption.option.onlyThisGuild &&
      (channel as GuildChannel).guildId !==
        this.checkIndividualOption.message.guildId
    ) {
      return this.errorFactory.channelDoesNotBelongToThisGuild()
    }

    if (
      !this.checkIndividualOption.option.channelTypes.includes(channel.type)
    ) {
      return this.errorFactory.invalidChannelType(channel.type)
    }
  }

  byId = byId.bind(this)

  byMention = byMention.bind(this)

  byName = byName.bind(this)
}
