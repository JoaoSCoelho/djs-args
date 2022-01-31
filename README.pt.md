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

import OptionsCommand, { OptionsCommandProps } from 'djs-args'
import { Message, Client } from 'discord.js'

interface MyCommandProps {
  // Aqui você pode colocar suas próprias propriedades, como "name", "description", etc.
}

export default abstract class BaseCommand extends OptionsCommand {
  constructor(props: MyCommandProps & OptionsCommandProps) {
    super(props)
  }

  abstract run(message: Message, client: Client): void

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

  async run(message: Message) {
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
| ------------- | ----------- | ---------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type          | `'BOOLEAN'` |                                                            | &times;  | O tipo da opção que você deseja que o usuário digite                                                                                                                                                                                                                                                                                                                                                     |
| description   | `string`    |                                                            | &times;  | Descrição do que a opção significa                                                                                                                                                                                                                                                                                                                                                                       |
| name          | `string`    |                                                            | &times;  | O nome da opção                                                                                                                                                                                                                                                                                                                                                                                          |
| caseSensitive | `boolean`   | `false`                                                    | &check;  | Define se o que o usuário digitar deve diferenciar maiúsculas de minúsculas.<br>Se definido como `caseSensitive: false`, o argumento `True` será considerado um argumento válido e de valor verdadeiro.<br>Se definido como `caseSensitive: true`, o argumento `True` será considerado um argumento inválido (a não ser que exista um aliase igual a `True`) e retornará um erro que poderá ser tratado. |
| falsyAliases  | `string[]`  | <code>[defaultFalsyAliases](#defaultFalsyAliases)</code>   | &check;  | Define os valores que serão considerados como `false` se o usuário os digitar.<br>Talvez você não queira deixar os valores padrão para trás, então você pode adicionar novos sem perder os padrões assim:<br>`falsyAliases: [...OptionsCommand.defaultFalsyAliases, ...newFalsyAliases]`                                                                                                                 |
| truthyAliases | `string[]`  | <code>[defaultTruthyAliases](#defaultTruthyAliases)</code> | &check;  | Define os valores que serão considerados como `true` se o usuário os digitar.<br>Talvez você não queira deixar os valores padrão para trás, então você pode adicionar novos sem perder os padrões assim:<br>`truthyAliases: [...OptionsCommand.defaultTruthyAliases, ...newTruthyAliases]`                                                                                                               |
| required      | `boolean`   | `false`                                                    | &check;  | Define se o usuário precisa colocar algum valor para essa opção.                                                                                                                                                                                                                                                                                                                                         |
| value         | `boolean`   | `undefined`                                                | &check;  | Define um valor default para a opção.<br>É por meio dessa propriedade que você buscará o valor que o usuário digitou.<br>OBS: Não funciona se `required: true`                                                                                                                                                                                                                                           |

### tipo CHANNEL

| Propriedade    | Tipo                                             | Padrão                                                       | Opcional | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------ | ------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type           | `'CHANNEL'`                                      |                                                              | &times;  | O tipo da opção que você deseja que o usuário digite                                                                                                                                                                                                                                                                                                                                                                                                                           |
| description    | `string`                                         |                                                              | &times;  | Descrição do que a opção significa                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| name           | `string`                                         |                                                              | &times;  | O nome da opção                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| caseSensitive  | `boolean`                                        | `false`                                                      | &check;  | Define se o que o usuário digitar deve diferenciar maiúsculas de minúsculas quando seu input for considerado o nome de um canal.<br>Se definido como `caseSensitive: false`, o argumento `GENERAL` pode ser considerado igual ao nome de algum canal que seja `general`, `General`, etc...<br>Se definido como `caseSensitive: true`, o argumento `GENERAL` só irá dar "match" com algum canal que se chame exatamente `GENERAL` (ou que o inclua, se `matchIncluding: true`). |
| channelTypes   | <code>[ChannelType](#ChannelType)[]</code>       | <code>[defaultChannelTypes](#defaultChannelTypes)</code>     | &check;  | Array com os tipos de canal que o bot deve aceitar.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| matchBy        | <code>[ChannelMatchBy](#ChannelMatchBy)[]</code> | <code>[defaultChannelMatchBy](#defaultChannelMatchBy)</code> | &check;  | Array com os métodos que o bot usará para encontrar o canal digitado pelo usuário.<br>Exemplo, se nesse array não estiver incluso o nome `'ID'`, e o usuário digitar o ID de um canal, ele não será encontrado pelo bot.                                                                                                                                                                                                                                                       |
| matchIncluding | `boolean`                                        | `false`                                                      | &check;  | Define se o bot deve considerar uma correspondência válida caso o input do usuário esteja contido no nome de um canal.<br>Exemplo, o input do usuário foi `general`, mas o nome do canal é `general-conversation`, caso `matchIncluding: true`, o bot retornará o canal `general-conversation`, mas se `matchIncluding: false`, o bot não retornará canal algum.                                                                                                               |
| onlyThisGuild  | `boolean`                                        | `false`                                                      | &check;  | Define se o bot deve buscar correspondência apenas em canais do próprio servidor em que o comando foi utilizado.<br>Caso seja definido como `onlyThisGuild: false` o bot buscará por uma correspondência em qualquer servidor que ele estiver.                                                                                                                                                                                                                                 |
| required       | `boolean`                                        | `false`                                                      | &check;  | Define se o usuário precisa colocar algum valor para essa opção.                                                                                                                                                                                                                                                                                                                                                                                                               |
| value          | `Channel`                                        | `undefined`                                                  | &check;  | Define um valor default para a opção.<br>É por meio dessa propriedade que você buscará o valor que o usuário digitou.<br>OBS: Não funciona se `required: true`                                                                                                                                                                                                                                                                                                                 |

### tipo INTEGER

| Propriedade   | Tipo                                                                                           | Padrão             | Opcional | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------- | ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type          | `'INTEGER'`                                                                                    |                    | &times;  | O tipo da opção que você deseja que o usuário digite                                                                                                                                                                                                                                                                                                                                                                                          |
| description   | `string`                                                                                       |                    | &times;  | Descrição do que a opção significa                                                                                                                                                                                                                                                                                                                                                                                                            |
| name          | `string`                                                                                       |                    | &times;  | O nome da opção                                                                                                                                                                                                                                                                                                                                                                                                                               |
| caseSensitive | `boolean`                                                                                      | `false`            | &check;  | Define se o que o usuário digitar deve diferenciar maiúsculas de minúsculas.<br>**OBS: _Válido apenas para quando_** `choices !== undefined`.                                                                                                                                                                                                                                                                                                 |
| choices       | <code>[ApplicationCommandOptionNumeralChoice](#ApplicationCommandOptionNumeralChoice)[]</code> | `undefined`        | &check;  | Um array de alternativas que o usuário pode escolher.<br>Caso alguma alternativa seja definida, só será aceito o input do usuário caso ele corresponda com o `name` ou `value` da alternativa.                                                                                                                                                                                                                                                |
| required      | `boolean`                                                                                      | `false`            | &check;  | Define se o usuário precisa colocar algum valor para essa opção.                                                                                                                                                                                                                                                                                                                                                                              |
| resolver      | `(value: number) => any`                                                                       | `(value) => value` | &check;  | Função que recebe como parâmetro o argumento do usuário já formatado para número inteiro e deve retornar qualquer coisa.<br>Essa função só será executada ao fim da validação do argumento do usuário, ou seja, quando ele for garantidamente um número e inteiro.<br>O valor retornado por essa função será setado na propriedade `value` da opção, caso não seja definida uma função `resolver`, será setado o valor que o usuário digitou. |
| value         | `number`                                                                                       | `undefined`        | &check;  | Define um valor default para a opção.<br>É por meio dessa propriedade que você buscará o valor que o usuário digitou.<br>OBS: Não funciona se `required: true`                                                                                                                                                                                                                                                                                |

### tipo MENTIONABLE

| Propriedade | Tipo                                                 | Padrão                                                           | Opcional | Descrição                                                                                                                                                      |
| ----------- | ---------------------------------------------------- | ---------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type        | `'MENTIONABLE'`                                      |                                                                  | &times;  | O tipo da opção que você deseja que o usuário digite                                                                                                           |
| description | `string`                                             |                                                                  | &times;  | Descrição do que a opção significa                                                                                                                             |
| name        | `string`                                             |                                                                  | &times;  | O nome da opção                                                                                                                                                |
| canBe       | <code>[MentionableCanBe](#MentionableCanBe)[]</code> | <code>[defaultMentionableCanBe](#defaultMentionableCanBe)</code> | &check;  | Um array com as classes que serão aceitas como mencionável.<br>Essas classes podem ser importadas diretamente de `'djs-args'`.                                 |
| required    | `boolean`                                            | `false`                                                          | &check;  | Define se o usuário precisa colocar algum valor para essa opção.                                                                                               |
| value       | <code>[MentionableValue](#MentionableValue)</code>   | `undefined`                                                      | &check;  | Define um valor default para a opção.<br>É por meio dessa propriedade que você buscará o valor que o usuário digitou.<br>OBS: Não funciona se `required: true` |

### tipo NUMBER
*<span class="important-obs-text">OBS: O tipo NUMBER aceita números positivos e negativos de até 10 dígitos antes da vírgula/ponto e até 5 dígitos depois da vírgula/ponto. Se precisa que o usuário digite um valor maior que este, talvez deva escolher o tipo INTEGER ([ver OBSERVAÇÕES do tipo INTEGER](#tipo-INTEGER))</span>*
| Propriedade   | Tipo                                                                                           | Padrão             | Opcional | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------- | ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type          | `'NUMBER'`                                                                                     |                    | &times;  | O tipo da opção que você deseja que o usuário digite                                                                                                                                                                                                                                                                                                                                                                        |
| description   | `string`                                                                                       |                    | &times;  | Descrição do que a opção significa                                                                                                                                                                                                                                                                                                                                                                                          |
| name          | `string`                                                                                       |                    | &times;  | O nome da opção                                                                                                                                                                                                                                                                                                                                                                                                             |
| caseSensitive | `boolean`                                                                                      | `false`            | &check;  | Define se o que o usuário digitar deve diferenciar maiúsculas de minúsculas.<br>**OBS: _Válido apenas para quando_** `choices !== undefined`.                                                                                                                                                                                                                                                                               |
| choices       | <code>[ApplicationCommandOptionNumeralChoice](#ApplicationCommandOptionNumeralChoice)[]</code> | `undefined`        | &check;  | Um array de alternativas que o usuário pode escolher.<br>Caso alguma alternativa seja definida, só será aceito o input do usuário caso ele corresponda com o `name` ou `value` da alternativa.                                                                                                                                                                                                                              |
| required      | `boolean`                                                                                      | `false`            | &check;  | Define se o usuário precisa colocar algum valor para essa opção.                                                                                                                                                                                                                                                                                                                                                            |
| resolver      | `(value: number) => any`                                                                       | `(value) => value` | &check;  | Função que recebe como parâmetro o argumento do usuário já formatado para número e deve retornar qualquer coisa.<br>Essa função só será executada ao fim da validação do argumento do usuário, ou seja, quando ele for garantidamente um número.<br>O valor retornado por essa função será setado na propriedade `value` da opção, caso não seja definida uma função `resolver`, será setado o valor que o usuário digitou. |
| value         | `number`                                                                                       | `undefined`        | &check;  | Define um valor default para a opção.<br>É por meio dessa propriedade que você buscará o valor que o usuário digitou.<br>OBS: Não funciona se `required: true`                                                                                                                                                                                                                                                              |

### tipo ROLE

| Propriedade    | Tipo                                       | Padrão                                                 | Opcional | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------- | ------------------------------------------ | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | `'ROLE'`                                   |                                                        | &times;  | O tipo da opção que você deseja que o usuário digite                                                                                                                                                                                                                                                                                                                                                                                                                      |
| description    | `string`                                   |                                                        | &times;  | Descrição do que a opção significa                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| name           | `string`                                   |                                                        | &times;  | O nome da opção                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| caseSensitive  | `boolean`                                  | `false`                                                | &check;  | Define se o que o usuário digitar deve diferenciar maiúsculas de minúsculas quando seu input for considerado o nome de um cargo.<br>Se definido como `caseSensitive: false`, o argumento `MEMBRO` pode ser considerado igual ao nome de algum cargo que seja `membro`, `Membro`, etc...<br>Se definido como `caseSensitive: true`, o argumento `MEMBRO` só irá dar "match" com algum cargo que se chame exatamente `MEMBRO` (ou que o inclua, se `matchIncluding: true`). |
| matchBy        | <code>[RoleMatchBy](#RoleMatchBy)[]</code> | <code>[defaultRoleMatchBy](#defaultRoleMatchBy)</code> | &check;  | Array com os métodos que o bot usará para encontrar o cargo digitado pelo usuário.<br>Exemplo, se nesse array não estiver incluso o nome `'ID'`, e o usuário digitar o ID de um cargo, ele não será encontrado pelo bot.                                                                                                                                                                                                                                                  |
| matchIncluding | `boolean`                                  | `false`                                                | &check;  | Define se o bot deve considerar uma correspondência válida caso o input do usuário esteja contido no nome de um cargo.<br>Exemplo, o input do usuário foi `membro`, mas o nome do cargo é `membros`, caso `matchIncluding: true`, o bot retornará o cargo `membros`, mas se `matchIncluding: false`, o bot não retornará cargo algum.                                                                                                                                     |
| required       | `boolean`                                  | `false`                                                | &check;  | Define se o usuário precisa colocar algum valor para essa opção.                                                                                                                                                                                                                                                                                                                                                                                                          |
| value          | `Role`                                     | `undefined`                                            | &check;  | Define um valor default para a opção.<br>É por meio dessa propriedade que você buscará o valor que o usuário digitou.<br>OBS: Não funciona se `required: true`                                                                                                                                                                                                                                                                                                            |

### tipo STRING

| Propriedade   | Tipo                                                                                         | Padrão             | Opcional | Descrição                                                                                                                                                                                                                                                                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------- | ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type          | `'STRING'`                                                                                   |                    | &times;  | O tipo da opção que você deseja que o usuário digite                                                                                                                                                                                                                                                                                             |
| description   | `string`                                                                                     |                    | &times;  | Descrição do que a opção significa                                                                                                                                                                                                                                                                                                               |
| name          | `string`                                                                                     |                    | &times;  | O nome da opção                                                                                                                                                                                                                                                                                                                                  |
| caseSensitive | `boolean`                                                                                    | `false`            | &check;  | Define se o que o usuário digitar deve diferenciar maiúsculas de minúsculas.<br>**OBS: _Válido apenas para quando_** `choices !== undefined`.                                                                                                                                                                                                    |
| choices       | <code>[ApplicationCommandOptionStringChoice](#ApplicationCommandOptionStringChoice)[]</code> | `undefined`        | &check;  | Um array de alternativas que o usuário pode escolher.<br>Caso alguma alternativa seja definida, só será aceito o input do usuário caso ele corresponda com o `name` ou `value` da alternativa.                                                                                                                                                   |
| required      | `boolean`                                                                                    | `false`            | &check;  | Define se o usuário precisa colocar algum valor para essa opção.                                                                                                                                                                                                                                                                                 |
| resolver      | `(value: string) => any`                                                                     | `(value) => value` | &check;  | Função que recebe como parâmetro o argumento do usuário e deve retornar qualquer coisa.<br>Essa função só será executada ao fim da validação do argumento do usuário.<br>O valor retornado por essa função será setado na propriedade `value` da opção, caso não seja definida uma função `resolver`, será setado o valor que o usuário digitou. |
| value         | `string`                                                                                     | `undefined`        | &check;  | Define um valor default para a opção.<br>É por meio dessa propriedade que você buscará o valor que o usuário digitou.<br>OBS: Não funciona se `required: true`                                                                                                                                                                                   |

### tipo USER

| Propriedade    | Tipo                                       | Padrão                                                 | Opcional | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------ | ------------------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | `'USER'`                                   |                                                        | &times;  | O tipo da opção que você deseja que o usuário digite                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| description    | `string`                                   |                                                        | &times;  | Descrição do que a opção significa                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| name           | `string`                                   |                                                        | &times;  | O nome da opção                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| caseSensitive  | `boolean`                                  | `false`                                                | &check;  | Define se o que o usuário digitar deve diferenciar maiúsculas de minúsculas quando seu input for considerado o username, tag ou nickname de um usuário discord.<br>Se definido como `caseSensitive: false`, o argumento `JOHN` pode corresponder a um usuário que tenha o username do discord igual a `john` ou `John`, etc...<br>Se definido como `caseSensitive: true`, o argumento `JOHN` só irá dar "match" com algum usuário que possua username, tag ou nickname exatamente igual a `JOHN` (ou que o inclua, se `matchIncluding: true`). |
| fetch          | `boolean`                                  | `false`                                                | &check;  | Define se quando o usuário enviar um ID do discord, o bot deve buscar um usuário correspondente a esse ID em todo o Discord ou apenas nos usuários do bot                                                                                                                                                                                                                                                                                                                                                                                      |
| matchBy        | <code>[UserMatchBy](#UserMatchBy)[]</code> | <code>[defaultUserMatchBy](#defaultUserMatchBy)</code> | &check;  | Array com os métodos que o bot usará para encontrar o usuário digitado.<br>Exemplo, se nesse array não estiver incluso o nome `'ID'`, e o usuário digitar o ID de um outro usuário (ou dele mesmo), ele não será encontrado pelo bot.                                                                                                                                                                                                                                                                                                          |
| matchIncluding | `boolean`                                  | `false`                                                | &check;  | Define se o bot deve considerar uma correspondência válida caso o input esteja contido no username, tag ou nickname de um usuário.<br>Exemplo, o input do usuário foi `john`, mas o username do usuário que ele está citando é `john mickael`, caso `matchIncluding: true`, o bot retornará o usuário `john mickael`, mas se `matchIncluding: false`, o bot não retornará usuário algum.                                                                                                                                                       |
| onlyThisGuild  | `boolean`                                  | `false`                                                | &check;  | Define se o bot deve buscar correspondência apenas para usuários que estão no servidor em que o comando foi utilizado.<br>Caso seja definido como `onlyThisGuild: false` o bot buscará por uma correspondência em qualquer servidor que ele estiver.                                                                                                                                                                                                                                                                                           |
| required       | `boolean`                                  | `false`                                                | &check;  | Define se o usuário precisa colocar algum valor para essa opção.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| value          | `User`                                     | `undefined`                                            | &check;  | Define um valor default para a opção.<br>É por meio dessa propriedade que você buscará o valor que o usuário digitou.<br>OBS: Não funciona se `required: true`                                                                                                                                                                                                                                                                                                                                                                                 |

## Types

#### ChannelType

```ts
| 'GUILD_TEXT'
| 'DM'
| 'GUILD_VOICE'
| 'GROUP_DM'
| 'GUILD_CATEGORY'
| 'GUILD_NEWS'
| 'GUILD_STORE'
| 'UNKNOWN'
| 'GUILD_NEWS_THREAD'
| 'GUILD_PUBLIC_THREAD'
| 'GUILD_PRIVATE_THREAD'
| 'GUILD_STAGE_VOICE'
```

#### ChannelMatchBy

```ts
;'MENTION' | 'NAME' | 'ID'
```

#### RoleMatchBy

```ts
;'MENTION' | 'NAME' | 'ID'
```

#### ApplicationCommandOptionNumeralChoice

```ts
{
  name: string // O nome da alternativa de escolha
  value: number // O valor da alternativa (esse valor que será setado na propriedade "value" da opção caso o usuário escolha essa alternativa)
}
```

#### ApplicationCommandOptionStringChoice

```ts
{
  name: string // O nome da alternativa de escolha
  value: string // O valor da alternativa (esse valor que será setado na propriedade "value" da opção caso o usuário escolha essa alternativa)
}
```

#### MentionableCanBe

```ts
;typeof User | typeof Role | typeof GuildMember
```

#### MentionableValue

```ts
;User | Role | GuildMember
```

#### UserMatchBy

```ts
;'MENTION' | 'ID' | 'USERNAME' | 'NICKNAME' | 'TAG'
```

## Variáveis

#### defaultTruthyAliases

```js
;['true', 't', '1', 'y', 'yes', 'sim', 's', 'verdadeiro']
```

#### defaultFalsyAliases

```js
;['false', 'f', '0', 'n', 'no', 'nao', 'não', 'falso']
```

#### defaultChannelTypes

```js
;[
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
]
```

#### defaultChannelMatchBy

```js
;['NAME', 'ID', 'MENTION']
```

#### defaultMentionableCanBe

```js
;[User, Role, GuildMember]
```

#### defaultRoleMatchBy

```js
;['NAME', 'ID', 'MENTION']
```

#### defaultUserMatchBy

```js
;['USERNAME', 'NICKNAME', 'TAG', 'ID', 'MENTION']
```

## Erros

O método `checkOptions` pode retornar um erro caso o usuário deixe de digitar alguma opção obrigatória ou digite algo inválido para alguma opção.
Esses erros são padronizados e você pode a partir deles enviar algum feedback para o usuário.

| Código  | Mensagem                                                                                                                                                                      | Tipo        | Descrição                                                                                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'001'` | `'Invalid value. Does not match any of the aliases'`                                                                                                                          | `'BOOLEAN'` | Quando o valor digitado pelo usuário não está incluso nem no `falsyAliases` nem no `truthyAliases` da opção.                                                      |
| `'002'` | `'Channel not found by MENTION'`                                                                                                                                              | `'CHANNEL'` | Quando o canal mencionado pelo usuário não existe ou foi deletado.                                                                                                |
| `'003'` | `'Channel not found by ID'`                                                                                                                                                   | `'CHANNEL'` | Quando o ID digitado pelo usuário não é válido ou não pertence a um canal que o bot tem acesso.                                                                   |
| `'004'` | `'Channel not found by NAME'`                                                                                                                                                 | `'CHANNEL'` | Quando o que o usuário digita é considerado o nome de algum canal e mesmo assim o bot não encontra nenhum canal que corresponda com o nome digitado pelo usuário. |
| `'005'` | `'Channel does not belong to this guild'`                                                                                                                                     | `'CHANNEL'` | Quando o canal digitado pelo usuário existe mas pertente a uma outra guilda que o bot tem acesso.                                                                 |
| `'006'` | <code>'Invalid channel type: <span class="string-variable-brace">{</span><span class="string-variable">channelType</span><span class="string-variable-brace">}</span>'</code> | `'CHANNEL'` | Quando o canal encontrado pelo bot é de um tipo que não é aceito.                                                                                                 |
| `'007'` | `The channel was not provided`                                                                                                                                                | `'CHANNEL'` | Quando o valor da opção é obrigatório, mas o usuário não fornece nenhum valor para o canal                                                                        |
| `'008'` | `More than one matching channel was found`                                                                                                                                    | `'CHANNEL'` | Quando o usuário digita um nome de canal que corresponde a mais de um canal.                                                                                      |
| `'009'` | `Argument does not match any of the choices`                                                                                                                                  | `'STRING'`  | Quando o valor digitado pelo usuário não corresponde a nenhum das alternativas definidas na propriedade `choices`.                                                |
| `'010'` | `Providing an argument is required`                                                                                                                                           | `'STRING'`  | Quando o usuário não fornece nenhum valor para a opção, mas a opção é obrigatória.                                                                                |
| `'011'` | `Argument does not match any of the choices`                                                                                                                                  | `'NUMBER'`  | Quando o valor digitado pelo usuário não corresponde a nenhum das alternativas definidas na propriedade `choices`.                                                |
| `'012'` | `The number was not provided`                                                                                                                                                 | `'NUMBER'`  | Quando o valor da opção é obrigatório, mas o usuário não fornece nenhum valor para o número.                                                                      |

<style>
.string-variable-brace {
  color: #FF79C6;
}
.string-variable {
  color: #82D9EC;
}
.important-obs-text {
  color: #F1E05A;
}
</style>
