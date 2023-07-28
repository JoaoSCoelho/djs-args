import Finders from '.'
import { GuildChannel } from 'discord.js'
import { OptionsError } from '../../..'

const byMention = function (
  this: Finders
): OptionsError<'CHANNEL'> | undefined {
  const { userInput, optionIndex, message } = this.checkIndividualOption

  const channel = message.mentions.channels.get(
    userInput.replace(/<#/g, '').replace(/>/g, '')
  ) as GuildChannel | undefined

  const commonVerificationResult = this.commomVerification('MENTION', channel)

  if (commonVerificationResult) return commonVerificationResult

  this.checkIndividualOption.optionsCommand.options[optionIndex].value = channel
}

export default byMention
