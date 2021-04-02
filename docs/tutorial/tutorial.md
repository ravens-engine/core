---
id: tutorial
title: Tutorial
slug: /
---

This tutorial will show how to build a multiplayer Tic-Tac-Toe game with Ravens.

## Setup

Let's create a new Javascript project and install the Ravens engine:

```bash
mkdir tic-tac-toe
cd tic-tac-toe
npm install @ravens-engine/core
```

Create a file `src/TicTacToe.js`. Inside it, we'll use Ravens to create our game.

## Defining a game

In Ravens, a game is defined by 2 concepts:

* The state of the game, which contains all the information. Ravens takes care of synchronizing this state across all the players, so they can display it in their browser.  
  In the case of Tic-Tac-Toe, this is the grid, with the `X` and the `O` inside it.  
* The actions that a player can do on the state of the games. When a player wants to do an action, it sends it to the server where it is validated, and broadcasted to all the connected players so they can update their state of the game.     
  In the case of Tic-Tac-Toe, there is only one: fill the grid with a symbol.

### Initialization

To define a game in Ravens, create a class extending `Game`: 

```javascript
import { Game } from "ravens"; 

export default class TicTacToe extends Game {

}
```

The first thing we need to define is the initial state of our game. In this example, it will be an empty 3-by-3 grid, represented by a two-dimensional array in Javascript. To achieve this, we define the `initialize` method of `Game`:

```javascript {2-12}
export default class TicTacToe extends Game {
  initialize() {
    const emptyGrid = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];

    this.state = {
      grid: emptyGrid
    }
  }
}
```

:::caution

The state of the game must be a pure Javascript object to allow Ravens to easily serialize it. This means that it cannot contain class instances or cyclic references.

:::

We're going to add an other element to our state: which symbol's turn it is.

```javascript {11}
export default class TicTacToe extends Game {
  initialize() {
    const emptyGrid = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];

    this.state = {
      grid: emptyGrid,
      turn: "O"
    }
  }
}
```

### Defining the actions

Now that the state of our game is correctly initialized, we can define the actions that players can do. To handle them, we define the `processAction` method of `Game`:

```javascript {4-6}
export default class TicTacToe extends Game {
  // ...

  processAction(playerId, action) {

  }
}
```

This method receives two arguments:

* `playerId` is a string and corresponds to the id of the player that performed the action.
* `action` is a Javacript object containing a description of the action performed. We can choose the structure of this object. For this tutorial, we'll assume that an action has the following form:
  ```json
  {
    type: "fill",
    cell: {
      x: 1,
      y: 2
    }
  }
  ```
  In this case, this action would corresponds to a player trying to fill the cell at coordinates `1, 2`.

To handle the action of type `fill`, we can implement the logic in the method `processAction`:

```javascript
processAction(playerId, action) {
  if (action.type == "fill") {
    // Fill the grid with the new value
    this.state.grid[action.cell.y][action.cell.x] = this.state.turn;

    // Change which symbol's turn it is
    this.state.turn = this.state.turn == "O" ? "X" : "O";
  }
}
```

#### Handling Invalid actions

For now, our `processAction` method accepts any move sent by the players, but we should invalidate actions that try to fill an already-filled cell. Let's implement this in `processAction`. Ravens expect that we throw an `InvalidActionError` whenever `processAction` encounters an invalid move:

```javascript {7-10}
import { Game, InvalidActionError } from "@ravens-engine/core";

// ...

processAction(playerId, action) {
  if (action.type == "fill") {
    // Check if the cell has alrady been filled
    if (this.state.grid[action.cell.y][action.cell.x] != null) {
      throw new InvalidActionError("Invalid move: cell already filled");
    }

    // Fill the grid with the new value
    this.state.grid[action.cell.y][action.cell.x] = this.state.turn;

    // Change which symbol's turn it is
    this.state.turn = this.state.turn == "O" ? "X" : "O";
  }
}
```

## Making the UI

:::info

Ravens has built-in support for React, but it can be used with any other UI framework. More information can be found in section _TODO_

:::

Now that the logic has been implemented, we can work on the UI of our game. We'll use React to implement the UI of our Tic-Tac-Toe game.

Conceptually, designing an UI for a turn-based game is a simple task: we simply need to describe what the screen should look like, based on the state of the game that we have defined in the previous section.

Let's create a file `src/TicTacToeComponent.jsx`:

```jsx
export default class TicTacTocComponent extends React.Component {
  render() {
    let tableRows = [];
    for (let y = 0;y < 3;y++) {
      const row = [];

      for (let y = 0;y < 3;y++) {
        row.push(<td>{this.props.game.state.grid[y][x]}</td>);
      }

      tableRows.push(<th>{row}</th>);
    }

    return (
      <div style="display: flex; align-items: center">
        <div>{this.props.game.state.turn}</div>
        <table>
          {tableRows}
        </table>
      </div>
    );
  }
}
```