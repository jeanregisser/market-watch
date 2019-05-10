# Market Watch

<img src="./demo/market-watch-demo-iphonex.gif">
<img src="./demo/market-watch-demo-nexus5x.gif">

## Prerequisites

- Xcode and Android Studio

## Installation

1. Install [Node.js](http://nodejs.org), and [Yarn](https://yarnpkg.com): `$ brew install node yarn`
2. Install file watcher used by React Native: `$ brew install watchman`
3. Install NPM modules: `$ yarn`

## Running

1. Start Packager
```
$ react-native start
```

2. **Running on iOS**

```
$ yarn ios
```

3. **Running on Android**:

```
$ yarn android
$ adb reverse tcp:8081 tcp:8081   # if running app cannot find the packager
```

## Recommended Editor

[VS Code](https://code.visualstudio.com)

## Tasks

### Linting

```
$ yarn lint
```

### TypeScript check

```
$ yarn compile
```

### Test

```
$ yarn test
```

or

```
$ yarn test:watch
```

## Resources

* React Native:
  - http://makeitopen.com
  - https://github.com/fbsamples/f8app/
  - http://facebook.github.io/react-native/docs/getting-started.html
  - http://beginning-mobile-app-development-with-react-native.com/book-preview.html

* Testing:
  - https://facebook.github.io/jest/
  - https://facebook.github.io/jest/docs/api.html#content
  - https://facebook.github.io/jest/blog/2016/07/27/jest-14.html

* TypeScript:
  - https://www.typescriptlang.org
  - https://github.com/basarat/typescript-book

* Flexbox:
  - https://css-tricks.com/snippets/css/a-guide-to-flexbox/
  - http://blog.krawaller.se/posts/a-react-app-demonstrating-css3-flexbox/

* React Native Debugger:
  - https://github.com/jhen0409/react-native-debugger
