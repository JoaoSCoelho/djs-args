// In your BaseCommand class

import OptionsCommand, { OptionsCommandProps } from '../../src'
import { Message, Client } from 'discord.js'

interface MyCommandProps {
  // Here you can add your own properties, like "name", "description", etc.
}

export default abstract class BaseCommand extends OptionsCommand {
  constructor(props: MyCommandProps & OptionsCommandProps) {
    super(props)
  }

  abstract run(message: Message, client: Client): void

  // Method that will be directly called by the "messageCreate" event
  async exec(
    message: Message,
    client: Client,
    usedPrefix: string,
    usedCommand: string
  ) {
    // Execute the checkOptions method, which will return a Promise
    this.checkOptions({ message, client, prefix: usedPrefix, usedCommand })
      .then(() => {
        // Here you execute the especific command function, like this:
        this.run(message, client)
      })
      .catch((error) => {
        //   ^^^^^ This error is a "OptionsError"
        // Here you can handle the error, like this:
        console.error(error)
        message.reply(error.message)
      })
  }
}
