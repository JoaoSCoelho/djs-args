import Finders from '.'
import { OptionsError } from '../../..'

const byMention = function (this: Finders): OptionsError<'USER'> | undefined {
  const { userInput, optionIndex, message } = this.checkIndividualOption

  const user = message.mentions.users.get(
    userInput.replace(/<@!?/g, '').replace(/>/g, '')
  )

  const commonVerificationResult = this.commomVerification('MENTION', user)

  if (commonVerificationResult) return commonVerificationResult

  this.checkIndividualOption.optionsCommand.options[optionIndex].value = user
}

export default byMention
