---
id: "servertransportlayer"
title: "Class: ServerTransportLayer"
sidebar_label: "ServerTransportLayer"
custom_edit_url: null
hide_title: true
---

# Class: ServerTransportLayer

## Hierarchy

* **ServerTransportLayer**

  ↳ [*ServerSocketTransportLayer*](serversockettransportlayer.md)

## Constructors

### constructor

\+ **new ServerTransportLayer**(): [*ServerTransportLayer*](servertransportlayer.md)

**Returns:** [*ServerTransportLayer*](servertransportlayer.md)

## Properties

### onClientClose

• **onClientClose**: (`clientId`: *string*) => *void*

#### Type declaration:

▸ (`clientId`: *string*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`clientId` | *string* |

**Returns:** *void*

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

## Methods

### start

▸ `Abstract`**start**(): *void*

**Returns:** *void*

___

### transportMessage

▸ `Abstract`**transportMessage**(`clientId`: *null* \| *string*, `message`: *object*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`clientId` | *null* \| *string* |
`message` | *object* |

**Returns:** *void*
