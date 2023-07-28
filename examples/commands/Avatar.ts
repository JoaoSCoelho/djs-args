// In your command file

import Discord, { Message } from 'discord.js'
import OptionsCommand, { User, Role, GuildMember } from '../../src'
import BaseCommand from '../classes/BaseCommand'

export default class AvatarCommand extends BaseCommand {
  constructor() {
    super({
      optionsSplit: null,
      // ^^^^^^^^^
      // Arguments divider by default is "/ +/g" (no quotes), which means that all user message content after the prefix and command name will be separated by each one or more spaces.
      // Ex: message.content = '!avatar josh sacary';
      // The array of options values will look like this:
      // ['josh', 'sacary']
      // You can change this value or make it null if you don't want to separate (in which case your command may only require one option)

      options: [
        {
          type: 'BOOLEAN',
          description: "Whether or not to include the user's discriminator",
          name: 'discriminator',
          caseSensitive: false,
          falsyAliases: [...OptionsCommand.defaultFalsyAliases],
          truthyAliases: [...OptionsCommand.defaultTruthyAliases],
          required: false,
          value: true,
        },
        {
          type: 'CHANNEL',
          description: 'The channel to send the avatar to',
          name: 'channel',
          caseSensitive: false,
          channelTypes: [
            'DM',
            'GROUP_DM',
            'GUILD_CATEGORY',
            'GUILD_NEWS',
            'GUILD_NEWS_THREAD',
            'GUILD_PRIVATE_THREAD',
            'GUILD_PUBLIC_THREAD',
            'GUILD_STAGE_VOICE',
            'GUILD_STORE',
            'GUILD_TEXT',
            'GUILD_VOICE',
            'UNKNOWN',
          ],
          matchBy: ['NAME', 'ID', 'MENTION'],
          matchIncluding: true,
          onlyThisGuild: false,
          required: true,
          value: undefined,
        },
        {
          type: 'INTEGER',
          description: 'The size of the avatar',
          name: 'size',
          caseSensitive: false,
          choices: [
            {
              name: 'valor 1',
              value: 3,
            },
          ],
          required: false,
          resolver: (value: number) => {
            return value * 3
          },
        },
        {
          type: 'MENTIONABLE',
          description: 'The user to get the avatar of',
          name: 'user',
          canBe: [User, Role, GuildMember],
          required: false,
          value: undefined,
        },
        {
          type: 'NUMBER',
          description: 'The number of times to repeat the avatar',
          name: 'repeat',
          caseSensitive: false,
          choices: [
            {
              name: 'valor 1',
              value: 3,
            },
          ],
          required: false,
          resolver: (value: number) => {
            return Number(value.toFixed(2))
          },
          value: undefined,
        },
        {
          type: 'ROLE',
          description: 'The role to get the avatar of',
          name: 'role',
          caseSensitive: false,
          matchBy: ['NAME', 'ID'],
          matchIncluding: true,
          required: false,
          value: undefined,
        },
        {
          type: 'STRING',
          description: 'The string to repeat the avatar',
          name: 'string',
          caseSensitive: false,
          choices: [
            {
              name: 'Valor 1',
              value: 'valor 1',
            },
          ],
          required: false,
          resolver: (value: string) => {
            return value.toUpperCase()
          },
          value: 'DEFAULT',
        },
        {
          type: 'USER',
          description: 'The user to get the avatar of',
          name: 'user',
          caseSensitive: false,
          fetch: true,
          matchBy: ['TAG', 'ID', 'MENTION'],
          matchIncluding: true,
          onlyThisGuild: false,
          required: false,
          value: undefined,
        },
      ],
    })
  }

  async run(message: Message) {
    const user =
      (this.options[0].value as Discord.User | undefined) || message.author

    message.reply(
      `The avatar of ${user.username} is: ${user.displayAvatarURL({
        size: 2048,
        dynamic: true,
      })}`
    )
  }
}
