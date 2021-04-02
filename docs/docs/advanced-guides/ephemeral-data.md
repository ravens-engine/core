---
id: ephemeral-data
title: Ephemeral Data
---

Ephemeral Data is a technique that allows you to use class instances in Ravens, even though you can't store class instances in the `state` of your game.

## When to use it

Let's say that we want to create an online version of the game of Chess. We could implement the rules of
the chess ourself, but we could also use a library, such as [`Chess.js`](https://github.com/jhlywa/chess.js/),
that already implements the rules of the game.

The API of `Chess.js` is extensive, but for our example, only those methods interests us:

* To create a game, instantiate the `Chess` class:  
  ```js
  const chess = new Chess()
  ```
* To process a move, use the `move` method of a `Chess` instance:  
  ```js
  chess.move(move)
  ```
* To get a string representing the state of the chessboard (in the [FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation) notation):  
  ```js
  const fen = chess.fen()
  // fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  ```
* To instantiate the `Chess` class based on a FEN string:  
  ```js
  const chess = new Chess(fen)
  ```

Naively, to integrate this library into Ravens, we may simply add a `Chess` instance to the state of our Game. In code, this would translate to this:

```js
class ChessGame extends Game {
    initialize() {
        this.state = {
            chess: new Chess()
        }
    }

    applyAction(playerId, action) {
        if (action.type == "move") {
            this.state.chess.move(action.move);
        }
    }
}
```

Unfortunately, we can't put a `Chess` instance inside `state` since Ravens requires `state` to be composed of only Javascript simple objects.

An other way to integrate `Chess.js` would be to store the FEN string inside `state`, and to instantiate a `Chess` instance based on `state` everytime we need to process a move. After processing the move, we would store the FEN string back into `state` to make sure we persist the state of the game. In code, this would translate to this:

```js
class ChessGame extends Game {
    initialize() {
        const chess = new Chess()

        this.state = {
            fen: chess.fen()
        }
    }

    applyAction(playerId, action) {
        if (action.type == "move") {
            const chess = new Chess(this.state.fen);

            this.state.chess.move(action.move);

            this.state.fen = chess.fen();
        }
    }
}
```

This works, but is highly inefficient. Indeed, everytime we need to process a move, we reinstantiate an instance of `Chess`.

## Using Ephemereal Data