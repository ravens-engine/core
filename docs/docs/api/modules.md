---
id: "modules"
title: "@ravens-engine/core"
sidebar_label: "Table of contents"
hide_table_of_contents: true
custom_edit_url: null
hide_title: true
---

# @ravens-engine/core

## Table of contents

### Enumerations

- [ClientState](enums/clientstate.md)

### Classes

- [Client](classes/client.md)
- [Core](classes/core.md)
- [Game](classes/game.md)
- [GameComponent](classes/gamecomponent.md)
- [InvalidActionError](classes/invalidactionerror.md)
- [Phase](classes/phase.md)
- [Server](classes/server.md)

### Interfaces

- [ClientConfig](interfaces/clientconfig.md)
- [PhaseClass](interfaces/phaseclass.md)
- [RootComponentProps](interfaces/rootcomponentprops.md)

## Type aliases

### AnyGame

Ƭ **AnyGame**: [*Game*](classes/game.md)<any, any, any\>

___

### AnyPhase

Ƭ **AnyPhase**: [*Phase*](classes/phase.md)<any, any, any, any, any\>

___

### ClientMessage

Ƭ **ClientMessage**<Game\>: *SendAction*<Game\> \| Authenticate

#### Type parameters:

Name | Type |
:------ | :------ |
`Game` | [*AnyGame*](modules.md#anygame) |

___

### ServerMessage

Ƭ **ServerMessage**<Game\>: *ApplyAction*<Game\> \| *Sync*<Game\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Game` | [*AnyGame*](modules.md#anygame) |
