---
id: "clientsockettransportlayer"
title: "Class: ClientSocketTransportLayer"
sidebar_label: "ClientSocketTransportLayer"
custom_edit_url: null
hide_title: true
---

# Class: ClientSocketTransportLayer

## Hierarchy

* [*ClientTransportLayer*](clienttransportlayer.md)

  ↳ **ClientSocketTransportLayer**

## Constructors

### constructor

\+ **new ClientSocketTransportLayer**(`address`: *string*): [*ClientSocketTransportLayer*](clientsockettransportlayer.md)

#### Parameters:

Name | Type |
:------ | :------ |
`address` | *string* |

**Returns:** [*ClientSocketTransportLayer*](clientsockettransportlayer.md)

Overrides: [ClientTransportLayer](clienttransportlayer.md)

## Properties

### address

• **address**: *string*

___

### onConnected

• **onConnected**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Inherited from: [ClientTransportLayer](clienttransportlayer.md).[onConnected](clienttransportlayer.md#onconnected)

___

### onDisconnected

• **onDisconnected**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

Inherited from: [ClientTransportLayer](clienttransportlayer.md).[onDisconnected](clienttransportlayer.md#ondisconnected)

___

### onMessage

• **onMessage**: (`message`: *object*) => *void*

#### Type declaration:

▸ (`message`: *object*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`message` | *object* |

**Returns:** *void*

Inherited from: [ClientTransportLayer](clienttransportlayer.md).[onMessage](clienttransportlayer.md#onmessage)

___

### websocket

• **websocket**: WebSocket

## Methods

### onClose

▸ **onClose**(): *void*

**Returns:** *void*

___

### onOpen

▸ **onOpen**(): *void*

**Returns:** *void*

___

### start

▸ **start**(): *void*

**Returns:** *void*

Overrides: [ClientTransportLayer](clienttransportlayer.md)

___

### transportMessage

▸ **transportMessage**(`message`: *object*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`message` | *object* |

**Returns:** *void*

Overrides: [ClientTransportLayer](clienttransportlayer.md)
