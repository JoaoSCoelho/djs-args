import CheckIndividualOption, { CheckIndividualOptionFunc } from '..'
import { OptionsError } from '../..'
import ErrorFactory from '../../ErrorFactory'

const checkStringOption: CheckIndividualOptionFunc<'STRING'> = function (
  this: CheckIndividualOption<'STRING'>
) {
  const {
    optionIndex,
    userInput,
    option: {
      choices,
      required = false,
      caseSensitive = false,
      resolver = (value) => value,
    },
    option,
  } = this

  const errorOption = {
    caseSensitive,
    required,
    choices,
    resolver,
    ...option,
    position: optionIndex,
  }

  const errorFactory = new ErrorFactory.String(userInput, errorOption)

  return new Promise(
    (resolve, reject: (reason: OptionsError<'STRING'>) => void) => {
      if (choices) {
        const selectedChoice = choices.find((choice) =>
          caseSensitive
            ? choice.name === userInput || choice.value === userInput
            : choice.name.toLowerCase() === userInput ||
              choice.value.toLowerCase() === userInput
        )

        if (!selectedChoice) {
          return reject(errorFactory.argumentDoesNotMatchAnyOfTheChoices())
        } else {
          this.optionsCommand.options[optionIndex].value = resolver(
            selectedChoice.value
          )
        }
      }

      if (!userInput && required) {
        return reject(errorFactory.providingAnArgumentIsRequired())
      }

      this.optionsCommand.options[optionIndex].value = resolver(userInput)
      return resolve(this.optionsCommand.options[optionIndex].value as string)
    }
  )
}

export default checkStringOption
