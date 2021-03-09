---
id: "serversockettransportlayer"
title: "Class: ServerSocketTransportLayer"
sidebar_label: "ServerSocketTransportLayer"
custom_edit_url: null
hide_title: true
---

# Class: ServerSocketTransportLayer

## Hierarchy

* [*ServerTransportLayer*](servertransportlayer.md)

  ↳ **ServerSocketTransportLayer**

## Constructors

### constructor

\+ **new ServerSocketTransportLayer**(`port?`: *number*): [*ServerSocketTransportLayer*](serversockettransportlayer.md)

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`port` | *number* | 8081 |

**Returns:** [*ServerSocketTransportLayer*](serversockettransportlayer.md)

Overrides: [ServerTransportLayer](servertransportlayer.md)

## Properties

### clientIds

• **clientIds**: *Map*<WebSocket, string\>

___

### onClientClose

• **onClientClose**: (`clientId`: *string*) => *void*

#### Type declaration:

▸ (`clientId`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`clientId` | *string* |

**Returns:** *void*

Inherited from: [ServerTransportLayer](servertransportlayer.md).[onClientClose](servertransportlayer.md#onclientclose)

___

### onClientMessage

• **onClientMessage**: (`clientId`: *string*, `message`: *object*) => *void*

#### Type declaration:

▸ (`clientId`: *string*, `message`: *object*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`clientId` | *string* |
`message` | *object* |

**Returns:** *void*

Inherited from: [ServerTransportLayer](servertransportlayer.md).[onClientMessage](servertransportlayer.md#onclientmessage)

___

### port

• **port**: *number*

___

### websocketServer

• **websocketServer**: *Server*

___

### websockets

• **websockets**: *Map*<string, WebSocket\>

## Methods

### privateOnClose

▸ **privateOnClose**(`websocket`: *WebSocket*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`websocket` | *WebSocket* |

**Returns:** *void*

___

### privateOnMessage

▸ **privateOnMessage**(`websocket`: *WebSocket*, `messageRaw`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`websocket` | *WebSocket* |
`messageRaw` | *string* |

**Returns:** *void*

___

### start

▸ **start**(): *void*

**Returns:** *void*

Overrides: [ServerTransportLayer](servertransportlayer.md)

___

### transportMessage

▸ **transportMessage**(`clientId`: *null* \| *string*, `message`: *object*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`clientId` | *null* \| *string* |
`message` | *object* |

**Returns:** *void*

Overrides: [ServerTransportLayer](servertransportlayer.md)
