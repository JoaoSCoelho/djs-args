# djs-args
Uma biblioteca que permite que você exiga aos usuários por argumentos/parâmetros específicos quando ele executa um comando, baseado nas `opções` do discord para `comandos de barra`, mas adaptado para funcionar em comandos de mensagem.

[English README](/README.md)

## Instalação

```bash
$ npm install djs-args
```
ou
```bash
$ yarn add djs-args
```

## Começando

### Para Comandos de Classe

```ts
// Na sua classe BaseCommand

import OptionsCommand, { OptionsCommandProps } from 'djs-args';
import { Message, Client } from 'discord.js'

interface MyCommandProps {
  // Aqui você pode colocar suas próprias propriedades, como "name", "description", etc.
}

export default class BaseCommand extends OptionsCommand {
  run!: (message: Message, client: Client) => void

  constructor(props: MyCommandProps & OptionsCommandProps) {
    super(props)
  }

  // Método que será chamado diretamente pelo evento "messageCreate"
  async exec(
    message: Message,
    client: Client,
    usedPrefix: string,
    usedCommand: string
  ) {
    // Executa o método checkOptions, que retornará uma Promise
    this.checkOptions({ message, client, prefix: usedPrefix, usedCommand })
      .then(() => {
        // Aqui você executa a função específica do comando, como isso:
        this.run(message, client)
      })
      .catch((error) => {
        //    ^^^^^ Este erro é um "OptionsError"
        // Aqui você pode tratar o erro, como isso:
        console.error(error)
        message.reply(error.message)
      })
  }
}
```

```ts
// No seu arquivo do comando

import { Message, User } from 'discord.js'

export default class AvatarCommand extends BaseCommand {
  constructor() {
    super({
      optionsSplit: null,
      // ^^^^^^^^^
      // O divisor de argumentos padrão é "/ +/g" (sem as aspas), que significa que todo o conteúdo da mensagem do usuário depois do prefixo e nome do comando será dividido a cada um ou mais espaços em branco.
      // Ex: message.content = '!avatar josh sacary';
      // O array de valores das opções se parecerá com isso:
      // ['josh', 'sacary']
      // Você pode modificar este valor ou deixá-lo null se você não quiser dividir os argumentos (neste caso, seu comando só poderá pedir uma única opção).
      
      options: [
        {
          name: 'user',
          description: 'The user to get the avatar from',
          type: 'USER', // Define o tipo do argumento
          required: false, 
          caseSensitive: false, // Define se deve ser diferenciado maiúsculas de minúsculas
          fetch: true, // Define se no caso do usuário enviar um ID, o bot deverá dar fetch desse ID em todo o Discord ou buscar esse ID apenas nos usuários que o bot tem acesso
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

## Tipos das opções

### tipo BOOLEAN

| Propriedade   | Tipo        | Padrão                                                     | Opcional | Descrição                                                                                                                                                                                                                                                                                                                                                                                                |
|---------------|-------------|------------------------------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type          | `'BOOLEAN'` |                                                            | &times;  | O tipo da opção que você deseja que o usuário digite                                                                                                                                                                                                                                                                                                                                                     |
| description   | `string`    |                                                            | &times;  | Descrição do que a opção significa                                                                                                                                                                                                                                                                                                                                                                       |
| name          | `string`    |                                                            | &times;  | O nome da opção                                                                                                                                                                                                                                                                                                                                                                                          |
| caseSensitive | `boolean`   | `false`                                                    | &check;  | Define se o que o usuário digitar deve diferenciar maiúsculas de minúsculas.<br>Se definido como `caseSensitive: false`, o argumento `True` será considerado um argumento válido e de valor verdadeiro.<br>Se definido como `caseSensitive: true`, o argumento `True` será considerado um argumento inválido (a não ser que exista um aliase igual a `True`) e retornará um erro que poderá ser tratado. |
| falsyAliases  | `string[]`  | `['false', 'f', '0', 'n', 'no', 'nao', 'não', 'falso']`    | &check;  | Define os valores que serão considerados como `false` se o usuário os digitar.<br>Talvez você não queira deixar os valores padrão para trás, então você pode adicionar novos sem perder os padrões assim:<br><br>`falsyAliases: [...OptionsCommand.defaultFalsyAliases, ...newFalsyAliases]`                                                                                                             |
| truthyAliases | `string[]`  | `['true', 't', '1', 'y', 'yes', 'sim', 's', 'verdadeiro']` | &check;  | Define os valores que serão considerados como `true` se o usuário os digitar.<br>Talvez você não queira deixar os valores padrão para trás, então você pode adicionar novos sem perder os padrões assim:<br>`truthyAliases: [...OptionsCommand.defaultTruthyAliases, ...newTruthyAliases]`                                                                                                               |
| required      | `boolean`   | `false`                                                    | &check;  | Define se o usuário precisa colocar algum valor para essa opção.                                                                                                                                                                                                                                                                                                                                         |
| value         | `boolean`   | `undefined`                                                | &check;  | Define um valor default para a opção.<br>É por meio dessa propriedade que você buscará o valor que o usuário digitou.<br>OBS: Não funciona se `required: true`                                                                                                                                                                                                                                           |

### tipo CHANNEL

| Propriedade    | Tipo                                                                                                                                                                                                                         | Padrão                                                                                                                                                                                               | Opcional | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type           | `'CHANNEL'`                                                                                                                                                                                                                  |                                                                                                                                                                                                      | &times;  | O tipo da opção que você deseja que o usuário digite                                                                                                                                                                                                                                                                                                                                                                                                                           |
| description    | `string`                                                                                                                                                                                                                     |                                                                                                                                                                                                      | &times;  | Descrição do que a opção significa                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| name           | `string`                                                                                                                                                                                                                     |                                                                                                                                                                                                      | &times;  | O nome da opção                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| caseSensitive  | `boolean`                                                                                                                                                                                                                    | `false`                                                                                                                                                                                              | &check;  | Define se o que o usuário digitar deve diferenciar maiúsculas de minúsculas quando seu input for considerado o nome de um canal.<br>Se definido como `caseSensitive: false`, o argumento `GENERAL` pode ser considerado igual ao nome de algum canal que seja `general`, `General`, etc...<br>Se definido como `caseSensitive: true`, o argumento `GENERAL` só irá dar "match" com algum canal que se chame exatamente `GENERAL` (ou que o inclua, se `matchIncluding: true`). |
| channelTypes   | `('GUILD_TEXT' \| 'DM' \| 'GUILD_VOICE' \| 'GROUP_DM' \| 'GUILD_CATEGORY' \| 'GUILD_NEWS' \| 'GUILD_STORE' \| 'UNKNOWN' \| 'GUILD_NEWS_THREAD' \| 'GUILD_PUBLIC_THREAD' \| 'GUILD_PRIVATE_THREAD' \| 'GUILD_STAGE_VOICE')[]` | `['DM', 'GROUP_DM', 'GUILD_CATEGORY', 'GUILD_NEWS', 'GUILD_NEWS_THREAD', 'GUILD_PRIVATE_THREAD', 'GUILD_PUBLIC_THREAD', 'GUILD_STAGE_VOICE', 'GUILD_STORE', 'GUILD_TEXT', 'GUILD_VOICE', 'UNKNOWN']` | &check;  | Array com os tipos de canal que o comando deve aceitar.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| matchBy        | `("MENTION" \| "NAME" \| "ID")[]`                                                                                                                                                                                            | `['NAME', 'ID', 'MENTION']`                                                                                                                                                                          | &check;  | Array com os métodos que o comando usará para encontrar o canal digitado pelo usuário.<br>Exemplo, se nesse array não estiver incluso o nome `'ID'`, e o usuário digitar o ID de um canal, ele não será encontrado pelo bot.                                                                                                                                                                                                                                                   |
| matchIncluding | `boolean`                                                                                                                                                                                                                    | `false`                                                                                                                                                                                              | &check;  | Define se o bot deve considerar uma correspondência válida caso o input do usuário esteja contido no nome de um canal.<br>Exemplo, o input do usuário foi `general`, mas o nome do canal é `💬 general`, caso `matchIncluding: true`, o bot retornará o canal `💬 general`, mas se `matchIncluding: false`, o bot não retornará canal algum.                                                                                                                                   |