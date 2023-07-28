import { Channel, Collection, GuildChannel } from 'discord.js'

export default class Filters {
  constructor(
    private readonly caseSensitive: boolean,
    private readonly value: string
  ) {}

  nameEquality(channel: Channel): boolean {
    return (
      channel instanceof GuildChannel &&
      (this.caseSensitive
        ? channel.name === this.value
        : channel.name.toLowerCase() === this.value.toLowerCase())
    )
  }

  nameInclusion(channel: Channel): boolean {
    return (
      channel instanceof GuildChannel &&
      (this.caseSensitive
        ? channel.name.includes(this.value) && channel.name !== this.value
        : channel.name.toLowerCase().includes(this.value.toLowerCase()) &&
          channel.name.toLowerCase() !== this.value.toLowerCase())
    )
  }

  hasOnlyOne(channels?: Collection<string, Channel>): boolean {
    return channels?.size === 1 || false
  }

  isEmpty(channels?: Collection<string, Channel>): boolean {
    return channels?.size === 0 || false
  }
}
