---
id: "invalidactionerror"
title: "Class: InvalidActionError"
sidebar_label: "InvalidActionError"
custom_edit_url: null
hide_title: true
---

# Class: InvalidActionError

## Hierarchy

* *Error*

  ↳ **InvalidActionError**

## Constructors

### constructor

\+ **new InvalidActionError**(`message?`: *string*): [*InvalidActionError*](invalidactionerror.md)

#### Parameters:

Name | Type |
:------ | :------ |
`message?` | *string* |

**Returns:** [*InvalidActionError*](invalidactionerror.md)

Inherited from: void

## Properties

### message

• **message**: *string*

Inherited from: void

___

### name

• **name**: *string*

Inherited from: void

___

### stack

• `Optional` **stack**: *string*

Inherited from: void

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Type declaration:

▸ (`err`: Error, `stackTraces`: CallSite[]): *any*

#### Parameters:

Name | Type |
:------ | :------ |
`err` | Error |
`stackTraces` | CallSite[] |

**Returns:** *any*

Inherited from: void

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: *number*

Inherited from: void

## Methods

### captureStackTrace

▸ `Static`**captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters:

Name | Type |
:------ | :------ |
`targetObject` | *object* |
`constructorOpt?` | Function |

**Returns:** *void*

Inherited from: void
