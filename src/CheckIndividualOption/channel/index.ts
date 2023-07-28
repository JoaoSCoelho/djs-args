import { Channel } from 'discord.js'
import CheckIndividualOption, { CheckIndividualOptionFunc } from '..'
import { OptionsError } from '../..'
import ErrorFactory from '../../ErrorFactory'
import Finders from './Finders'

const checkChannelOption: CheckIndividualOptionFunc<'CHANNEL'> = function (
  this: CheckIndividualOption<'CHANNEL'>
) {
  const {
    optionIndex,
    userInput,
    option: {
      matchBy = ['NAME', 'ID', 'MENTION'],
      onlyThisGuild = false,
      caseSensitive = false,
      channelTypes = [
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
      matchIncluding = false,
      required = false,
    },
    option,
  } = this

  const errorOption = {
    caseSensitive,
    channelTypes,
    matchBy,
    matchIncluding,
    onlyThisGuild,
    required,
    ...option,
    position: optionIndex,
  }

  const errorFactory = new ErrorFactory.Channel(userInput, errorOption)
  const finders = new Finders(
    { ...this, option: errorOption, check: this.check },
    errorFactory
  )

  return new Promise(
    (resolve, reject: (reason: OptionsError<'CHANNEL'>) => void) => {
      // Se for menção
      if (matchBy.includes('MENTION') && /^<#\d{17,19}>$/g.test(userInput)) {
        const byMentionError = finders.byMention()

        if (byMentionError) return reject(byMentionError)
      }
      // Se for ID
      else if (matchBy.includes('ID') && /^\d{17,19}$/g.test(userInput)) {
        const byIdError = finders.byId()

        if (byIdError) return reject(byIdError)
      }
      // Se for nome
      else if (matchBy.includes('NAME') && userInput) {
        const byNameError = finders.byName()

        if (byNameError) return reject(byNameError)
      }
      // Se for obrigatório e o usuário não digitar nada
      else if (!userInput && required) {
        return reject(errorFactory.channelWasNotProvided())
      }

      return resolve(this.optionsCommand.options[optionIndex].value as Channel)
    }
  )
}

export default checkChannelOption
