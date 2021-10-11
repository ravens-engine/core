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
npm init
npm install @ravens-engine/core
```

Create a file `src/TicTacToeGame.js`. Inside it, we'll use Ravens to create our game.

## Defining a game

In Ravens, a game is defined by 2 concepts:

* The state of the game, which contains all the information. Ravens takes care of synchronizing this state across all the users, so they can display it in their browser.
  In the case of Tic-Tac-Toe, this is the grid, with the `X` and the `O` inside it.
* The actions that a user can do on the state of the games. When a user wants to do an action, it sends it to the server where it is validated, and broadcasted to all the connected users so they can update their state of the game.
  In the case of Tic-Tac-Toe, there is only one: fill the grid with a symbol.

### Initialization

To define a game in Ravens, create a class extending `Game`:

```javascript
import { Game } from "@ravens-engine/core/lib/core/index.js";

export default class TicTacToeGame extends Game {

}
```

The first thing we need to define is the initial state of our game. In this example, it will be an empty 3-by-3 grid, represented by a two-dimensional array in Javascript. To achieve this, we define the `initialize` method of `Game`:

```javascript {2-12}
export default class TicTacToeGame extends Game {
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

Now that the state of our game is correctly initialized, we can define the actions that users can do. To handle them, we define the `applyAction` method of `Game`:

```javascript {4-6}
export default class TicTacToeGame extends Game {
  // ...

  applyAction(userId, action) {

  }
}
```

This method receives two arguments:

* `userId` is a string and corresponds to the id of the user that performed the action.
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
  In this case, this action would corresponds to a user trying to fill the cell at coordinates `1, 2`.

To handle the action of type `fill`, we can implement the logic in the method `applyAction`:

```javascript
applyAction(userId, action) {
  if (action.type == "fill") {
    // Fill the grid with the new value
    this.state.grid[action.cell.y][action.cell.x] = this.state.turn;

    // Change which symbol's turn it is
    this.state.turn = this.state.turn == "O" ? "X" : "O";
  }
}
```

#### Handling Invalid actions

For now, our `applyAction` method accepts any move sent by the users, but we should invalidate actions that try to fill an already-filled cell. Let's implement this in `applyAction`. Ravens expect that we throw an `InvalidActionError` whenever `applyAction` encounters an invalid move:

```javascript {7-10}
import { Game, InvalidActionError } from "@ravens-engine/core/lib/core/index.js";

// ...

applyAction(userId, action) {
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

### Making the UI

:::info

Ravens has built-in support for React, but it can be used with any other UI framework. More information can be found in section _TODO_

:::

Now that the logic has been implemented, we can work on the UI of our game. We'll use React to implement the UI of our Tic-Tac-Toe game.

Conceptually, designing an UI for a turn-based game is a simple task: we simply need to describe what the screen should look like, based on the state of the game that we have defined in the previous section.

First, let's install the libraries that we will use:

```
npm install react react-dom parcel-bundler
```

Next, let's set up a simple style sheet to format the game's grid. Create `src/style.css` and add the following styling. This `.css` file will be imported by the React component that we define next.

```css
table {
    text-align: center;
}

td {
    border: 1px solid black;
    height: 50px;
    width: 50px;
}

td.clickable {
    cursor: pointer;
}
```

Then, create a file `src/TicTacToeComponent.jsx`, and fill the `render` function with an UI for our game:

```jsx
import "./style.css";
import * as React from "react";

export default class TicTacTocComponent extends React.Component {
  render() {
    let tableRows = [];
    for (let y = 0;y < 3;y++) {
      const row = [];

      for (let x = 0;x < 3;x++) {
        row.push(<td>{this.props.game.state.grid[y][x]}</td>);
      }

      tableRows.push(<tr>{row}</tr>);
    }

    return (
      <div>
        <div>{this.props.game.state.turn}</div>
        <table>
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  }
}
```

## Launching the game

To be able to start a game server and a client, let's create 3 files that will be the starting point of those 2 processes:

First, an `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
</head>
<body>
    <div id="root"></div>
    <script src="./src/client.jsx"></script>
</body>
</html>
```

Then, `src/client.jsx`:

```jsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GameComponent } from "@ravens-engine/core/lib/client/index.js";
import TicTacToeGame from "./TicTacToeGame";
import TicTacToeComponent from "./TicTacToeComponent";

ReactDOM.render(
    <GameComponent gameClass={TicTacToeGame} rootComponent={TicTacToeComponent} />,
    document.getElementById("root")
);
```

Finally, `src/server.js`:

```js
import { Server } from "@ravens-engine/core/lib/server/index.js";
import TicTacToeGame from "./TicTacToeGame.js";

const server = new Server({
    gameClass: TicTacToeGame
});

server.start();
```

If you followed all the instructions of the tutorial, you should have those files in your project folder:

```
tic-tac-toe/
├── index.html
├── package.json
├── src/
│   ├── client.jsx
│   ├── server.js
│   ├── TicTacToeComponent.jsx
│   └── TicTacToeGame.js
└── node_modules/
    └── ...
```

To launch the game server, run in a terminal:

```sh
node ./src/server.js
```

To launch the UI, run in an other terminal:

```sh
npx parcel index.html
```

You can now access the game by opening `http://localhost:1234`. You can click on the square to fill the

## Making it multiplayer

At the moment, our game is a bit bare-bones:

* There's not concept of players yet as you can play the full game inside a single browser. We'll improve that by making the game truly multiplayer.
* When a player wins the game, there's no message indicating who's the winner.

### Separating into phases

The first modification we'll be doing is separating our game into 3 phases:

* The `Lobby` phase, where the server will wait for 2 players to connect. Once 2 players are connected, the server will actually launch the game by proceeding to the `GameInProgress` phase.
* The `GameInProgress` phase, where the 2 players will actually play the game. When the game ends (either by a win or a draw), the server will proceed to the `GameEnded` phase.
* The `GameEnded` phase, which will be the final phase of the game.

Ravens allows use to model this sequence of phases by coding sub-classes of `Phase`. Each sub-class of `Phase` will have its own state, and will be capable of processing its own actions, specific to this phase. More information about Phases can be found about in [the documentation](../docs/main-concepts/phases).

Let's write the skeletons of our phases in `src/TicTacToeGame.js`:

```js
import { Game, InvalidActionError, Phase } from "@ravens-engine/core/lib/core/index.js";

export class LobbyPhase extends Phase { }

LobbyPhase.id = "lobby";

export class GameInProgressPhase extends Phase { }

GameInProgressPhase.id = "game-in-progress";

export class GameEndedPhase extends Phase { }

GameEndedPhase.id = "game-ended";

export default class TicTacToeGame extends Game {
    // ...
}

TicTacToeGame.childPhaseClasses = [LobbyPhase, GameInProgressPhase, GameEndedPhase];
```

Let's breakdown what we have added here:

* ```js
  export class LobbyPhase extends Phase { }
  ```

  This line defines a class that extends the `Phase` class. This class will contain everything related to the `LobbyPhase` of our games

* ```js
  LobbyPhase.id = "lobby";
  ```

  Here, we defined the id of our phase. This is a requirement of Ravens, and is used for serialization purposes

* ```js
  export class GameInProgressPhase extends Phase { }

  GameInProgressPhase.id = "game-in-progress";

  export class GameEndedPhase extends Phase { }

  GameEndedPhase.id = "game-ended";
  ```

  In the same way we did for the `LobbyPhase`, we defined the `GameInProgressPhase` and `GameEndedPhase`.

* ```js
  TicTacToeGame.childPhaseClasses = [LobbyPhase, GameInProgressPhase, GameEndedPhase];
  ```

  Here, we list all the phases of our games defined earlier.

Let's now implement Tic-Tac-Toe using the phases we defined

#### Modifying TicTacToeGame

We'll first modify the class `TicTacToe` that we defined earlier. We'll remove parts that

```js
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

    this.setChild(LobbyPhase);
  }

  // `applyAction` has been removed
}
```

We did two things:

* In `initialize`, a line was added to initialize the initial phase of our game, `LobbyPhase`.
* `applyAction` was removed since it's the child phases that will handle the actions.

#### Implementing LobbyPhase

`LobbyPhase` will wait for new users to join. When 2 players have joined, it will proceed to the `GameInProgressPhase` phase:

```js
export class LobbyPhase extends Phase {
    onUserConnection(userId) {
        // Add the player to the game
        this.addPlayer(userId);

        if (this.players.length == 2) {
            // 2 players have connected, start the game!
            this.parent.setChild(GameInProgressPhase);
        }
    }

    onUserDisconnection(userId) {
        // Remove the player
        this.removePlayer(userId);
    }
}
```

Notice that:

* We tell Ravens to mark a user as a player using `this.addPlayer`. Conversely, we can unmark them using `this.removePlayer`.
* We can access the list of players with `this.players`.
* Once 2 users have connected, we change the phase of the game using `this.parent.setchild`. Indeed, `this.parent` corresponds to the `TicTacToe` class that we defined. Calling `this.parent.setChild` thus replaces the current phase by the new one.

#### Implementing GameInProgressPhase


#### Implementing GameEndedPhase

`GameEndedPhase` will be the final phase of the game. Its job is simple: track the winner so that it can be displayed in the UI.

This phase will take a parameter during "initialization". In other words, this phase takes an argument whenever this phase is triggered via `this.parent.setChild(GameEndedPhase, ...)`.

This parameter (`winner`) will be the 'X' or 'O' symbol corresponding to the winning player.

```js
export class GameEndedPhase extends Phase {
    initialize(winner) {
        this.state = {
            winner
        };
    }
}

// ...
```

Notice that:

* The `winner` is passed in to the phase via the `initialize()` parameter.
* Phases can have their own internal state. For this phase, track the winner in the phase's state. This will be read by the UI code.

#### Modifying the UI

Now that we split our game into 3 phases, we can modify the UI:

```jsx
export default class TicTacToeComponent extends React.Component {
    render() {
        return <>
            <div>
                Player {this.props.client.userId} -
                {this.props.game.child instanceof LobbyPhase && (
                    <>Waiting for <b>{2 - this.props.game.players.length}</b> players</>
                )}
                {this.props.game.child instanceof GameInProgressPhase && (
                    <>Turn: <b>{this.props.game.state.turn}</b> {this.props.game.isTurn(this.props.client.userId) && "(Your turn)"}</>
                )}
                {this.props.game.child instanceof GameEndedPhase && (
                    this.props.game.child.state.winner != null
                        ? <>Winner: <b>{this.props.game.child.state.winner}</b>!</>
                        : <>Draw</>
                )}
            </div>
            <table>
                <tbody>
                    {this.props.game.state.grid.map((row, y) => (
                        <tr key={y}>
                            {this.props.game.state.grid[y].map((cell, x) => (
                                <td key={x}
                                    style={{width: "50px"}}
                                    className={this.canFill(x, y) ? "clickable" : ""}
                                    onClick={this.onCellClick.bind(this, x, y)}>
                                        {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>;
    }

    onCellClick(x, y) {
        this.props.client.sendAction({
            type: "fill",
            cell: {
                x,
                y
            }
        });
    }

    canFill(x, y) {
        return this.props.game.child instanceof GameInProgressPhase
            && this.props.game.isTurn(this.props.client.userId)
            && this.props.game.state.grid[y][x] == null;
    }
}
```

Notice how we can use `this.props.game.child instanceof XXX` to check in which phase the game is currently in, allowing us to make our UI display accordingly.

The full code can be found in the [GitHub repository](https://github.com/ravens-engine/tic-tac-toe).

## Launching the improved game

To launch the game:

```sh
# In a terminal
node ./src/server.js
# In an other terminal
npx parcel index.html
```

You can access the game by opening `http://localhost:1234`.

To simulate a second player joining the game, access `http://localhost:1234#2`. You can simulate more players by increasing the number after the `#`.
