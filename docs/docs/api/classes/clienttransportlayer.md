---
id: "clienttransportlayer"
title: "Class: ClientTransportLayer"
sidebar_label: "ClientTransportLayer"
custom_edit_url: null
hide_title: true
---

# Class: ClientTransportLayer

## Hierarchy

* **ClientTransportLayer**

  ↳ [*ClientSocketTransportLayer*](clientsockettransportlayer.md)

## Constructors

### constructor

\+ **new ClientTransportLayer**(): [*ClientTransportLayer*](clienttransportlayer.md)

**Returns:** [*ClientTransportLayer*](clienttransportlayer.md)

## Properties

### onConnected

• **onConnected**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

___

### onDisconnected

• **onDisconnected**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

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

## Methods

### start

▸ `Abstract`**start**(): *void*

**Returns:** *void*

___

### transportMessage

▸ `Abstract`**transportMessage**(`message`: *object*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`message` | *object* |

**Returns:** *void*
