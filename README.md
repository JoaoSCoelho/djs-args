# djs-args
A library that allows you to ask the user for specific arguments/parameters when executing some command, based on discord `options` for slash commands, but adapted and improved for message commands

[README em Português](/README.pt.md)

## Installation

```bash
$ npm install djs-args
```
or
```bash
$ yarn add djs-args
```

## Getting Started

### For Class commands

```ts
// In your BaseCommand class

import OptionsCommand, { OptionsCommandProps } from 'djs-args';
import { Message, Client } from 'discord.js'

interface MyCommandProps {
  // Here you can add your own properties, like "name", "description", etc.
}

export default class BaseCommand extends OptionsCommand {
  run!: (message: Message, client: Client) => void

  constructor(props: MyCommandProps & OptionsCommandProps) {
    super(props)
  }

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
```

```ts
// In your command file

import { Message, User } from 'discord.js'

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
          name: 'user',
          description: 'The user to get the avatar from',
          type: 'USER', // Define the type of value
          required: false, 
          caseSensitive: false, // Define if the value is case sensitive or not
          fetch: true, // Defines whether, in case the user sends an ID, it will fetch the entire Discord or fetch only the bot users
          matchBy: ['ID', 'MENTION', 'NICKNAME', 'TAG', 'USERNAME'],
          matchIncluding: true,
          onlyThisGuild: false,
        },
      ],
    })
  }

  run = async (message: Message) => {
    const user = (this.options[0].value as User | undefined) || message.author

    message.reply(
      `The avatar of ${user.username} is: ${user.displayAvatarURL({
        size: 2048,
        dynamic: true,
      })}`
    )
  }
}
```

## Options types

### BOOLEAN type

| Property      | Type        | Default                                                    | Optional | Description                                                                                                                                                                                                                                                                                                                                                                               |
|---------------|-------------|------------------------------------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type          | `'BOOLEAN'` |                                                            | &times;  | The type of option you want the user to input                                                                                                                                                                                                                                                                                                                                             |
| description   | `string`    |                                                            | &times;  | Description of what the option means                                                                                                                                                                                                                                                                                                                                                      |
| name          | `string`    |                                                            | &times;  | The name of the option                                                                                                                                                                                                                                                                                                                                                                    |
| caseSensitive | `boolean`   | `false`                                                    | &check;  | Defines whether what the user enters should also be compared in relation to the case of letters.<br>If set to `caseSensitive: false`, the input `True` will be considered a valid input of true value.<br>If set to `caseSensitive: true`, the input `True` will be considered an invalid input (unless there is one aliase equals `True`) and will return an error which may be treated. |
| falsyAliases  | `string[]`  | `['false', 'f', '0', 'n', 'no', 'nao', 'não', 'falso']`    | &check;  | Defines the values that will be considered and treated as `false` if the user types it.<br>Maybe you don't want to leave the default values behind, so you can add new ones without losing the defaults like this:<br>`falsyAliases: [...OptionsCommand.defaultFalsyAliases, ...newFalsyAliases]`                                                                                         |
| truthyAliases | `string[]`  | `['true', 't', '1', 'y', 'yes', 'sim', 's', 'verdadeiro']` | &check;  | Set the values that will be considered and treated as `true` if the user types it.<br>Maybe you don't want to leave the default values behind, so you can add new ones without losing the defaults like this:<br>`truthyAliases: [...OptionsCommand.defaultTruthyAliases, ...newTruthyAliases]`                                                                                           |
| required      | `boolean`   | `false`                                                    | &check;  | Defines if the user needs to put any value for this option.                                                                                                                                                                                                                                                                                                                         |
| value         | `boolean`   | `undefined`                                                | &check;  | Sets a default value for the option.<br>It is through this property that you will look for the value that the user typed.<br>NOTE: Does not work if `required: true`                                                                                                                                 |