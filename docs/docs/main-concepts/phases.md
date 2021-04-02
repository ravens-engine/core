---
id: phases
title: Phases
---

Modelling a 

Phases are a way to model the fact that depending the progress of the game, the actions that the players can perform and the state that must be kept are different.

## Defining phases

To define the phases of your game:

* Create a class extending `Phase` for each of the phase of your game.
* For each of your phase, define an `id` property.
* Define the property `childPhases` in your `Game`, with the list of possible child Phases.

For example, a game with 3 phases would be defined this way:

```js
class LobbyPhase extends Phase { /* ... */ }
LobbyPhase.id = "lobby";

class GameInProgressPhase extends Phase { /* ... */ }
GameInProgressPhase.id = "game-in-progress";

class GameEndedPhase extends Phase { /* ... */ }
GameEndedPhase.id = "game-ended";

class ExampleGame extends Game { /* ... */ }
ExampleGame.childPhases = [LobbyPhase, GameInProgressPhase, GameEndedPhase];
```

Each phase has its own `state` field, `initialize` method and `applyAction` method.

One could visualize the different phases as tree of phases, with the `Game` at the top. The phase tree of the game defined above would be:

![Phase tree](./phases-phase-tree.drawio.svg)

### Initializing the first phase

To initialize the first phase, use the `this.setChild` function inside the `initialize` function of your game:

```js {3}
class ExampleGame extends Game {
    initialize() {
        setChild(LobbyPhase);
    }
}
```

### Handling actions

When an action must be applied to your game, Ravens "travels down" the tree, calling the `applyAction` method of each node encountered. In our example, the `applyAction` method of `Game` and then of the current phase will be called.

### Switching between phases

To switch between phases, use the `setChild` function of `Game`. The `Game` instance can be accessed from a `Phase` by using `this.parent`.

```js {4}
class LobbyPhase extends Phase {
    applyAction(playerId, action) {
        if (action.type == "start") {
            this.parent.setChild(GameInProgressPhase);
        }
    }
}
```

### Initialization with arguments

When calling `setChild`, arguments can be passed to the `initialize` method of the new phase. For example:

```js {6,12-17}
class GameInProgressPhase extends Phase {
    applyAction(playerId, action) {
        if (action.type == "win-the-game") {
            // playerId will be sent to the initialize
            // method of GameEndedPhase
            this.parent.setChild(GameEndedPhase, playerId);
        }
    }
}

class GameEndedPhase extends Phase {
    initialize(playerId) {
        // Save the playerId in the state of the phase
        this.state = {
            playerId: playerId
        }
    }
}
```

## Nested Phases

Phases can be nested, to allow complex gameflow to be modelled. Let's say we have this phase tree:

![Phase tree](./phases-nested-phase-tree.drawio.svg)

In code, this would be done like this:

```js
class LobbyPhase extends Phase { /* ... */}
LobbyPhase.id = "lobby";

class FirstSubPhase extends Phase { /* ... */ }
FirstSubPhase.id = "first-sub";

class SecondSubPhase extends Phase { /* ... */ }
SecondSubPhase.id = "second-sub";

class GameInProgressPhase extends Phase { /* ... */ }
GameInProgressPhase.id = "game-in-progress";
GameInProgressPhase.childPhases = [FirstSubPhase, SecondSubPhase];

class ExampleGame extends Game { /* ... */ }
ExampleGame.childPhases = [LobbyPhase, GameInProgressPhase, GameEndedPhase];
```

To set the child phase of a phase, use the `this.setChild` method of `Phase`, much in the same way than we did for `Game`:

```js {3}
class GameInProgressPhase extends Phase {
    initialize() {
        this.setChild(FirstSubPhase);
    }
}
```

## Example of a complex phase tree

The phase tree architecture can be a great tool to model complex games. As an example, you can find below the (simplfied) phase tree for the game _A Game of Thrones: The Board Game_, that I implemented for the project [Swords and Ravens](https://swordsandravens.net/).

![Phase tree](./phases-complex-phase-tree.drawio.svg)

:::info
The similarity in the names between _Swords and Ravens_ and _Ravens_ is not accidental. It's while coding S&R that I realized that it could be possible to create a library to help developping online turn-based games. Thus, _Ravens_ was born
:::