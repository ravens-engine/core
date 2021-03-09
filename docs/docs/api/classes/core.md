---
id: "core"
title: "Class: Core<Game>"
sidebar_label: "Core"
custom_edit_url: null
hide_title: true
---

# Class: Core<Game\>

## Type parameters

Name | Type |
:------ | :------ |
`Game` | [*AnyGame*](../modules.md#anygame) |

## Constructors

### constructor

\+ **new Core**<Game\>(`gameClass`: [*PhaseClass*](../interfaces/phaseclass.md)<Game\>, `serializedRootPhase?`: *null* \| *SerializedPhase*<Game\>): [*Core*](core.md)<Game\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Game` | [*Game*](game.md)<any, any, any, Game\> |

#### Parameters:

Name | Type | Default value |
:------ | :------ | :------ |
`gameClass` | [*PhaseClass*](../interfaces/phaseclass.md)<Game\> | - |
`serializedRootPhase` | *null* \| *SerializedPhase*<Game\> | null |

**Returns:** [*Core*](core.md)<Game\>

## Properties

### game

• **game**: Game

___

### gameClass

• **gameClass**: [*PhaseClass*](../interfaces/phaseclass.md)<Game\>

___

### onStateChange

• **onStateChange**: () => *void*

#### Type declaration:

▸ (): *void*

**Returns:** *void*

## Methods

### applyAction

▸ **applyAction**(`playerId`: *string*, `action`: *object*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`playerId` | *string* |
`action` | *object* |

**Returns:** *void*

___

### serializeRootPhase

▸ **serializeRootPhase**(): *SerializedPhase*<Game\>

**Returns:** *SerializedPhase*<Game\>
