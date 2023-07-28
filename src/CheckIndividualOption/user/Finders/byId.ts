import Finders from '.'
import { OptionsError } from '../../..'

const byId = async function (
  this: Finders
): Promise<OptionsError<'USER'> | undefined> {
  const { client, userInput, optionIndex, option } = this.checkIndividualOption

  const user = option.fetch
    ? await client.users.fetch(userInput)
    : client.users.cache.get(userInput)

  const commonVerificationResult = this.commomVerification('ID', user)

  if (commonVerificationResult) return commonVerificationResult

  this.checkIndividualOption.optionsCommand.options[optionIndex].value = user
}

export default byId
