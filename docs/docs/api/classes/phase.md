---
id: "phase"
title: "Class: Phase<State, Action, InitArgs, Parent, Child>"
sidebar_label: "Phase"
custom_edit_url: null
hide_title: true
---

# Class: Phase<State, Action, InitArgs, Parent, Child\>

## Type parameters

Name | Type | Default |
:------ | :------ | :------ |
`State` | - | *any* |
`Action` | - | *any* |
`InitArgs` | - | *null* |
`Parent` | [*AnyPhase*](../modules.md#anyphase) \| *null* | *null* |
`Child` | [*AnyPhase*](../modules.md#anyphase) \| *null* | *null* |

## Hierarchy

* **Phase**

  ↳ [*Game*](game.md)

## Constructors

### constructor

\+ **new Phase**<State, Action, InitArgs, Parent, Child\>(`parent`: Parent): [*Phase*](phase.md)<State, Action, InitArgs, Parent, Child\>

#### Type parameters:

Name | Type | Default |
:------ | :------ | :------ |
`State` | - | *any* |
`Action` | - | *any* |
`InitArgs` | - | *null* |
`Parent` | *null* \| [*AnyPhase*](../modules.md#anyphase) | *null* |
`Child` | *null* \| [*AnyPhase*](../modules.md#anyphase) | *null* |

#### Parameters:

Name | Type |
:------ | :------ |
`parent` | Parent |

**Returns:** [*Phase*](phase.md)<State, Action, InitArgs, Parent, Child\>

## Properties

### child

• **child**: Child

___

### parent

• **parent**: Parent

___

### state

• **state**: State

___

### childPhaseClasses

▪ `Static` **childPhaseClasses**: [*PhaseClass*](../interfaces/phaseclass.md)<[*AnyPhase*](../modules.md#anyphase)\>[]

___

### id

▪ `Static` **id**: *string*

## Methods

### applyAction

▸ **applyAction**(`playerId`: *string*, `action`: Action): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`playerId` | *string* |
`action` | Action |

**Returns:** *void*

___

### initialize

▸ **initialize**(`args`: InitArgs): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`args` | InitArgs |

**Returns:** *void*

___

### onDeserialize

▸ **onDeserialize**(): *void*

**Returns:** *void*

___

### setChild

▸ **setChild**<SpecificChild\>(`phaseClass`: [*PhaseClass*](../interfaces/phaseclass.md)<SpecificChild\>, `args?`: *null* \| *object*): *void*

#### Type parameters:

Name | Type |
:------ | :------ |
`SpecificChild` | *null* \| [*AnyPhase*](../modules.md#anyphase) |

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`phaseClass` | [*PhaseClass*](../interfaces/phaseclass.md)<SpecificChild\> | - |
`args` | *null* \| *object* | null |

**Returns:** *void*
