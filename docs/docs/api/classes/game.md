---
id: "game"
title: "Class: Game<State, Action, Children>"
sidebar_label: "Game"
custom_edit_url: null
hide_title: true
---

# Class: Game<State, Action, Children\>

## Type parameters

Name | Type | Default |
:------ | :------ | :------ |
`State` | - | *null* |
`Action` | - | *null* |
`Children` | [*AnyPhase*](../modules.md#anyphase) \| *null* | *null* |

## Hierarchy

* [*Phase*](phase.md)<State, Action, *null*, *null*, Children\>

  ↳ **Game**

## Constructors

### constructor

\+ **new Game**<State, Action, Children\>(`parent`: *null*): [*Game*](game.md)<State, Action, Children\>

#### Type parameters:

Name | Type | Default |
:------ | :------ | :------ |
`State` | - | *null* |
`Action` | - | *null* |
`Children` | *null* \| [*AnyPhase*](../modules.md#anyphase) | *null* |

#### Parameters:

Name | Type |
:------ | :------ |
`parent` | *null* |

**Returns:** [*Game*](game.md)<State, Action, Children\>

Inherited from: [Phase](phase.md)

## Properties

### child

• **child**: Children

Inherited from: [Phase](phase.md).[child](phase.md#child)

___

### parent

• **parent**: *null*

Inherited from: [Phase](phase.md).[parent](phase.md#parent)

___

### state

• **state**: State

Inherited from: [Phase](phase.md).[state](phase.md#state)

___

### childPhaseClasses

▪ `Static` **childPhaseClasses**: [*PhaseClass*](../interfaces/phaseclass.md)<[*AnyPhase*](../modules.md#anyphase)\>[]

Inherited from: [Phase](phase.md).[childPhaseClasses](phase.md#childphaseclasses)

___

### id

▪ `Static` **id**: *string*= "root"

Overrides: [Phase](phase.md).[id](phase.md#id)

## Methods

### applyAction

▸ **applyAction**(`playerId`: *string*, `action`: Action): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`playerId` | *string* |
`action` | Action |

**Returns:** *void*

Inherited from: [Phase](phase.md)

___

### initialize

▸ **initialize**(`args`: *null*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`args` | *null* |

**Returns:** *void*

Inherited from: [Phase](phase.md)

___

### onDeserialize

▸ **onDeserialize**(): *void*

**Returns:** *void*

Inherited from: [Phase](phase.md)

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

Inherited from: [Phase](phase.md)
