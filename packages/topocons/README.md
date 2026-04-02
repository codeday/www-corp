# Topocons

These icons are only licensed for use by CodeDay. Sorry!

**In topocons 2, imports have changed! Take a look below.**

## Use
Import format:
```jsx
import { [IconName] } from `@codeday/topocons`

<[IconName] />
```

```jsx
import { Illuminati } from `@codeday/topocons`

<Illuminati />
```

### How it works

generate icons:
 - svgo: optimizes svgs and tries its best to remove all the colors
 - create-chakra-icons (using @nexite/create-chakra-icons to allow generating individual files): generates tsx files for each svg
 - idxgen: creates index.ts that exports each icon in a tree shaking friendly way
 - replace: finishes removing any remaining colors

build:
 - uses tsup to bundle and transpile our ts into cjs and esm

### Maybe helpful commands

download submodules (private repo)
```console
git pull --recurse-submodules
```

download dependencies
```console
yarn install
```

generate icons
```console
yarn generate-icons
```

build (use `build:fast` to build w/o types)
```console
yarn build
```

all done!
