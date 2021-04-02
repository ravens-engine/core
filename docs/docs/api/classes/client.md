---
id: "client"
title: "Class: Client<Game>"
sidebar_label: "Client"
custom_edit_url: null
hide_title: true
---

# Class: Client<Game\>

Represents a client communicating with a [Server](server.md)

## Type parameters

Name | Type |
:------ | :------ |
`Game` | [*AnyGame*](../modules.md#anygame) |

## Constructors

### constructor

\+ **new Client**<Game\>(`config`: [*ClientConfig*](../interfaces/clientconfig.md)<Game\>): [*Client*](client.md)<Game\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Game` | [*Game*](game.md)<any, any, any, Game\> |

#### Parameters:

Name | Type |
:------ | :------ |
`config` | [*ClientConfig*](../interfaces/clientconfig.md)<Game\> |

**Returns:** [*Client*](client.md)<Game\>

## Properties

### playerId

• **playerId**: *string*= "1"

**`readonly`** 

___

### state

• **state**: [*ClientState*](../enums/clientstate.md)

**`readonly`** 

## Accessors

### game

• get **game**(): Game

**Returns:** Game

## Methods

### onDisconnected

▸ **onDisconnected**(): *void*

**Returns:** *void*

___

### onMessage

▸ **onMessage**(`messageObject`: *object*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`messageObject` | *object* |

**Returns:** *void*

___

### sendAction

▸ **sendAction**(`action`: *object*): *void*

Send an action to perform to the server.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`action` | *object* | The action to apply to the game    |

**Returns:** *void*

___

### start

▸ **start**(): *void*

**Returns:** *void*
