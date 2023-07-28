import { Channel, Collection } from 'discord.js'
import Finders from '.'
import { OptionsError } from '../../..'
import Filters from '../utils/Filters'

const byName = function (this: Finders): OptionsError<'CHANNEL'> | undefined {
  const {
    client,
    option: { caseSensitive, matchIncluding },
    userInput,
    optionIndex,
  } = this.checkIndividualOption

  const { nameEquality, nameInclusion, hasOnlyOne, isEmpty } = new Filters(
    caseSensitive,
    userInput
  )

  const equalName = client.channels.cache.filter(nameEquality)
  const includedName = matchIncluding
    ? client.channels.cache.filter(nameInclusion)
    : new Collection<string, Channel>()

  const channel = client.channels.cache.find((_, key) => {
    if (hasOnlyOne(equalName) && equalName.has(key)) return true

    if (
      isEmpty(equalName) &&
      hasOnlyOne(includedName) &&
      includedName.has(key)
    ) {
      return true
    }

    return false
  })

  const commonVerificationResult = this.commomVerification('NAME', channel)

  if (commonVerificationResult) return commonVerificationResult

  if (
    [equalName, includedName].some((channels) => channels && channels.size > 1)
  ) {
    return this.errorFactory.moreOfOneChannelWasFound()
  }

  this.checkIndividualOption.optionsCommand.options[optionIndex].value = channel
}

export default byName
