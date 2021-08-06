---
id: randomness
title: Randomness
---

Many games have random components, whether it be through the roll of a dice, the shuffling of a deck of cards, or random tiles being taken from a bag. Ravens provide an API to generate randomness into your games.

:::danger
Other methods to generate randomness (e.g. `Math.random`) should never be used as Ravens relies on controlled
randomness to properly sync the state of the to the clients
:::

Methods to generate randomness can be accessed inside your Game instance that way:

```js {3}
class RandomGame extends Game {
    applyAction(userId: string, action: any): void {
        // Generate a number between 1 and 6, like a 6-sided dice
        this.random.d6();
    }
}
```

`this.random` is actually an instance object of the [Chance.js](https://chancejs.com/) library, meaning that any methods
described in the library can be used inside your Game class. As a preview, here are some of the methods that may be useful when coding a game:

* `this.chance.integer({min: -10, max: 10})` returns an integer between the given `min` and `max` (included).
* `this.chance.d6()` returns the roll of a 6-sided. `d20`, `d100` also exists.
* `this.chance.shuffle(array)` returns a shuffled version of the array given in argument.
* `this.chance.pickone(array)` returns a random element from the array given in argument.
* And many others. Check the [documentation of Chance.js](https://chancejs.com/) to see all the available methods.

