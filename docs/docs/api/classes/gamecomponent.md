---
id: "gamecomponent"
title: "Class: GameComponent<Game>"
sidebar_label: "GameComponent"
custom_edit_url: null
hide_title: true
---

# Class: GameComponent<Game\>

## Type parameters

Name | Type |
:------ | :------ |
`Game` | [*AnyGame*](../modules.md#anygame) |

## Hierarchy

* *Component*<RavensGameComponentProps<Game\>, GameComponentState<Game\>\>

  ↳ **GameComponent**

## Constructors

### constructor

\+ **new GameComponent**<Game\>(`props`: *any*): [*GameComponent*](gamecomponent.md)<Game\>

#### Type parameters:

Name | Type |
:------ | :------ |
`Game` | [*Game*](game.md)<any, any, any, Game\> |

#### Parameters:

Name | Type |
:------ | :------ |
`props` | *any* |

**Returns:** [*GameComponent*](gamecomponent.md)<Game\>

Overrides: void

## Properties

### context

• **context**: *any*

If using the new style context, re-declare this in your class to be the
`React.ContextType` of your `static contextType`.
Should be used with type annotation or static contextType.

```ts
static contextType = MyContext
// For TS pre-3.7:
context!: React.ContextType<typeof MyContext>
// For TS 3.7 and above:
declare context: React.ContextType<typeof MyContext>
```

**`see`** https://reactjs.org/docs/context.html

Inherited from: void

___

### props

• `Readonly` **props**: *Readonly*<RavensGameComponentProps<Game\>\> & *Readonly*<{ `children?`: ReactNode  }\>

Inherited from: void

___

### refs

• **refs**: *object*

**`deprecated`** 
https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs

#### Type declaration:

Inherited from: void

___

### state

• **state**: *Readonly*<GameComponentState<Game\>\>

Inherited from: void

___

### contextType

▪ `Static` `Optional` **contextType**: *Context*<any\>

If set, `this.context` will be set at runtime to the current value of the given Context.

Usage:

```ts
type MyContext = number
const Ctx = React.createContext<MyContext>(0)

class Foo extends React.Component {
  static contextType = Ctx
  context!: React.ContextType<typeof Ctx>
  render () {
    return <>My context's value: {this.context}</>;
  }
}
```

**`see`** https://reactjs.org/docs/context.html#classcontexttype

Inherited from: void

## Methods

### UNSAFE\_componentWillMount

▸ `Optional`**UNSAFE_componentWillMount**(): *void*

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Returns:** *void*

Inherited from: void

___

### UNSAFE\_componentWillReceiveProps

▸ `Optional`**UNSAFE_componentWillReceiveProps**(`nextProps`: *Readonly*<RavensGameComponentProps<Game\>\>, `nextContext`: *any*): *void*

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters:

Name | Type |
:------ | :------ |
`nextProps` | *Readonly*<RavensGameComponentProps<Game\>\> |
`nextContext` | *any* |

**Returns:** *void*

Inherited from: void

___

### UNSAFE\_componentWillUpdate

▸ `Optional`**UNSAFE_componentWillUpdate**(`nextProps`: *Readonly*<RavensGameComponentProps<Game\>\>, `nextState`: *Readonly*<GameComponentState<Game\>\>, `nextContext`: *any*): *void*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters:

Name | Type |
:------ | :------ |
`nextProps` | *Readonly*<RavensGameComponentProps<Game\>\> |
`nextState` | *Readonly*<GameComponentState<Game\>\> |
`nextContext` | *any* |

**Returns:** *void*

Inherited from: void

___

### componentDidCatch

▸ `Optional`**componentDidCatch**(`error`: Error, `errorInfo`: ErrorInfo): *void*

Catches exceptions generated in descendant components. Unhandled exceptions will cause
the entire component tree to unmount.

#### Parameters:

Name | Type |
:------ | :------ |
`error` | Error |
`errorInfo` | ErrorInfo |

**Returns:** *void*

Inherited from: void

___

### componentDidMount

▸ **componentDidMount**(): *void*

**Returns:** *void*

Overrides: void

___

### componentDidUpdate

▸ `Optional`**componentDidUpdate**(`prevProps`: *Readonly*<RavensGameComponentProps<Game\>\>, `prevState`: *Readonly*<GameComponentState<Game\>\>, `snapshot?`: *any*): *void*

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

#### Parameters:

Name | Type |
:------ | :------ |
`prevProps` | *Readonly*<RavensGameComponentProps<Game\>\> |
`prevState` | *Readonly*<GameComponentState<Game\>\> |
`snapshot?` | *any* |

**Returns:** *void*

Inherited from: void

___

### componentWillMount

▸ `Optional`**componentWillMount**(): *void*

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Returns:** *void*

Inherited from: void

___

### componentWillReceiveProps

▸ `Optional`**componentWillReceiveProps**(`nextProps`: *Readonly*<RavensGameComponentProps<Game\>\>, `nextContext`: *any*): *void*

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters:

Name | Type |
:------ | :------ |
`nextProps` | *Readonly*<RavensGameComponentProps<Game\>\> |
`nextContext` | *any* |

**Returns:** *void*

Inherited from: void

___

### componentWillUnmount

▸ `Optional`**componentWillUnmount**(): *void*

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

**Returns:** *void*

Inherited from: void

___

### componentWillUpdate

▸ `Optional`**componentWillUpdate**(`nextProps`: *Readonly*<RavensGameComponentProps<Game\>\>, `nextState`: *Readonly*<GameComponentState<Game\>\>, `nextContext`: *any*): *void*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters:

Name | Type |
:------ | :------ |
`nextProps` | *Readonly*<RavensGameComponentProps<Game\>\> |
`nextState` | *Readonly*<GameComponentState<Game\>\> |
`nextContext` | *any* |

**Returns:** *void*

Inherited from: void

___

### forceUpdate

▸ **forceUpdate**(`callback?`: () => *void*): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`callback?` | () => *void* |

**Returns:** *void*

Inherited from: void

___

### getSnapshotBeforeUpdate

▸ `Optional`**getSnapshotBeforeUpdate**(`prevProps`: *Readonly*<RavensGameComponentProps<Game\>\>, `prevState`: *Readonly*<GameComponentState<Game\>\>): *any*

Runs before React applies the result of `render` to the document, and
returns an object to be given to componentDidUpdate. Useful for saving
things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
lifecycle events from running.

#### Parameters:

Name | Type |
:------ | :------ |
`prevProps` | *Readonly*<RavensGameComponentProps<Game\>\> |
`prevState` | *Readonly*<GameComponentState<Game\>\> |

**Returns:** *any*

Inherited from: void

___

### render

▸ **render**(): *null* \| *Element*

**Returns:** *null* \| *Element*

Overrides: void

___

### setState

▸ **setState**<K\>(`state`: *null* \| *GameComponentState*<Game\> \| (`prevState`: *Readonly*<GameComponentState<Game\>\>, `props`: *Readonly*<RavensGameComponentProps<Game\>\>) => *null* \| *GameComponentState*<Game\> \| *Pick*<GameComponentState<Game\>, K\> \| *Pick*<GameComponentState<Game\>, K\>, `callback?`: () => *void*): *void*

#### Type parameters:

Name | Type |
:------ | :------ |
`K` | *client* |

#### Parameters:

Name | Type |
:------ | :------ |
`state` | *null* \| *GameComponentState*<Game\> \| (`prevState`: *Readonly*<GameComponentState<Game\>\>, `props`: *Readonly*<RavensGameComponentProps<Game\>\>) => *null* \| *GameComponentState*<Game\> \| *Pick*<GameComponentState<Game\>, K\> \| *Pick*<GameComponentState<Game\>, K\> |
`callback?` | () => *void* |

**Returns:** *void*

Inherited from: void

___

### shouldComponentUpdate

▸ `Optional`**shouldComponentUpdate**(`nextProps`: *Readonly*<RavensGameComponentProps<Game\>\>, `nextState`: *Readonly*<GameComponentState<Game\>\>, `nextContext`: *any*): *boolean*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate`
and `componentDidUpdate` will not be called.

#### Parameters:

Name | Type |
:------ | :------ |
`nextProps` | *Readonly*<RavensGameComponentProps<Game\>\> |
`nextState` | *Readonly*<GameComponentState<Game\>\> |
`nextContext` | *any* |

**Returns:** *boolean*

Inherited from: void
