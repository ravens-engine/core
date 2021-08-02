---
id: phase
title: Phase
---

A phase represents a portion of the logic of your game. This class is mean't to be inherited. More information can be found in the [Phase](../main-concepts/phases.md) section.

A class inheriting from `Phase` **must** define an id using the following syntax:

```js
class MyPhase extends Phase { /* ... */ }

MyPhase.id = "my-phase-id";
```

:::info
A `Game` is itself a `Phase`, meaning that all the methods described here can also be called on your `Game` class.
:::

## Static Properties

### id

The id associated with this phase class. Used by Ravens for serialization and deserialization purposes. Defined using the syntax:

```js
class MyPhase extends Phase { /* ... */ }

MyPhase.id = "my-phase-id";
```

## Methods

### addPlayer

```js
addPlayer(userId)
```

Adds a user as a player of this match.

**Note** This method can only be called during the `IN_LOBBY` phase of a match.

### removePlayer

```js
removePlayer(userId)
```

Removes a user as a player of this match.

**Note** This method can only be called during the `IN_LOBBY` phase of a match.

### setStatus

```js
setStatus(status)
```

Set the current status of the match. `status` must one of the values of the `GameStatus` enumeration. Accepted values are thus `GameStatus.IN_LOBBY`, `GameStatus.CLOSED`, `GameStatus.STARTED`, `GameStatus.CANCELLED` or `GameStatus.FINISHED`.

The flow in which the status of a game can change is restricted. As such, you can only set the status of a match following this diagram:

[Insert a flow of how the status of a match can change]

### setChild

```js
setChild(childPhaseClass, arguments?)
```

Sets the current child phase of this phase.

The `arguments` argument is optional and, if specified, will be passed to the `initialize` method of the child phase class.

In order for a phase to have a child phase, it must define the list of possible phase classes:

```js
MyPhase.childPhaseClasses = [FirstChildPhaseClass, SecondChildPhaseClass, ThirdChildPhaseClass];
```

See [Phases](../main-concepts/phases.md) for more information. 

### setMaxPlayers

```js
setMaxPlayers(maxPlayers)
```

Sets the maximum number of players this game can have.

### applyAction

```js
applyAction(userId, action)
```

This method is mean't to be overriden by a child class, and will be called everytime a player wants to execute an action to the game.

### onUserConnection

```js
onUserConnection(userId)
```

This method is mean't to be overriden by a child class, and will be called everytime a user connects to the match.

If a player opens 2 tabs and thus connecting to the same match, `onUserConnection` will **not** be called the second time.

### onUserDisconnection

```js
onUserConnection(userId)
```

This method is mean't to be overriden by a child class, and will be called everytime a user disconnects.

Similar to the way `onUserConnection` works, if a user has multiple tabs with the same match open, `onUserDisconnection` will only be called when they closes the last tab and thus no longer has any connection to the match.
