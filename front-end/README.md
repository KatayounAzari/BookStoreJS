### Functional components vs Class Components

- Functional components do not have a state or lifecycle methods

- Class components have a state and can implement lifecycle methods like componentDidMount and componentDidUpdate

## React Hooks

- Hooks were added to React in version 16.8. 

- Hooks are functions which allow function components to have access to state and other React features. Because of this, class components are generally no longer needed.

    - Examples: useState(), useEffect(), useContext(), useRef(), useReducer(), useCallback(), useMemo() and Custom Hooks.

- useState() allows us to track state in a function component. State generally refers to data or properties that need to be tracking in an application.

- useEffect() allows you to perform side effects in your components. Examples: fetching data, directly updating the DOM, and timers.

- useContext() is a way to manage state globally. It can be used together with the useState Hook to share state between deeply nested components more easily than with useState alone.

- useRef() allows you to persist values between renders. It can be used to store a mutable value that does not cause a re-render when updated. It can be used to access a DOM element directly.

- useReducer() is similar to the useState Hook. It allows for custom state logic. If you find yourself keeping track of multiple pieces of state that rely on complex logic, useReducer may be useful.

- useCallback() returns a memoized callback function. Think of memoization as caching a value so that it does not need to be recalculated. This allows us to isolate resource intensive functions so that they will not automatically run on every render. The useCallback Hook only runs when one of its dependencies update. This can improve performance.

- useMemo() eturns a memoized value. Think of memoization as caching a value so that it does not need to be recalculated. The useMemo Hook only runs when one of its dependencies update.This can improve performance.
    - The useMemo and useCallback Hooks are similar. The main difference is that useMemo returns a memoized value and useCallback returns a memoized function.