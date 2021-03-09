---
id: "server"
title: "Class: Server<Game>"
sidebar_label: "Server"
custom_edit_url: null
hide_title: true
---

# Class: Server<Game\>

## Type parameters

Name | Type |
:------ | :------ |
`Game` | [*AnyGame*](../modules.md#anygame) |

## Constructors

### constructor

\+ **new Server**<Game\>(`serverConfig`: *ServerConfig*<Game\>): [*Server*](server.md)<Game\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Game` | [*Game*](game.md)<any, any, any, Game\> |

#### Parameters:

Name | Type |
:------ | :------ |
`serverConfig` | *ServerConfig*<Game\> |

**Returns:** [*Server*](server.md)<Game\>

## Properties

### authContextForClientId

• **authContextForClientId**: *Map*<string, { `clientId`: *string* ; `gameId`: *string* ; `playerId`: *string*  }\>

___

### clientIdsForPlayerId

• **clientIdsForPlayerId**: *Map*<string, string[]\>

___

### cores

• **cores**: *Map*<string, [*Core*](core.md)<Game\>\>

___

### rootPhaseClass

• **rootPhaseClass**: [*PhaseClass*](../interfaces/phaseclass.md)<Game\>

___

### transportLayer

• **transportLayer**: [*ServerTransportLayer*](servertransportlayer.md)

## Methods

### broadcastMessage

▸ **broadcastMessage**(`message`: [*ServerMessage*](../modules.md#servermessage)<Game\>): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`message` | [*ServerMessage*](../modules.md#servermessage)<Game\> |

**Returns:** *void*

___

### onClientClose

▸ **onClientClose**(`clientId`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`clientId` | *string* |

**Returns:** *void*

___

### onClientMessage

▸ **onClientMessage**(`clientId`: *string*, `messageObject`: *object*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`clientId` | *string* |
`messageObject` | *object* |

**Returns:** *void*

___

### sendMessage

▸ **sendMessage**(`playerId`: *string*, `message`: [*ServerMessage*](../modules.md#servermessage)<Game\>): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`playerId` | *string* |
`message` | [*ServerMessage*](../modules.md#servermessage)<Game\> |

**Returns:** *void*

___

### start

▸ **start**(): *void*

**Returns:** *void*
