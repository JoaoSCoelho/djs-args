import Finders from '.'
import { OptionsError } from '../../..'

const byId = function (this: Finders): OptionsError<'CHANNEL'> | undefined {
  const { client, userInput, optionIndex } = this.checkIndividualOption

  const channel = client.channels.cache.get(userInput)

  const commonVerificationResult = this.commomVerification('ID', channel)

  if (commonVerificationResult) return commonVerificationResult

  this.checkIndividualOption.optionsCommand.options[optionIndex].value = channel
}

export default byId
