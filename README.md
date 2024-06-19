# Lestin
Lestin has one job: Transform JSX codes to pure HTML elements using `document.createElement()`.

Lestin is DOM-based. There's no virtual-DOM, and thus, no additional overhead. We can theoretically say its performance is ~equal to vanilla JS (it's just three functions). (Please contribute on testing Lestin performance).

Lestin adds **less than 1KB** gzipped to bundles, but reduces the project size much more than this, as it simplifies component and element creations by supporting JSX; Compared to React (~30KB) and Preact (~3KB).

## Using Lestin

To use Lestin, install it with TypeScript and Vite, and add the configs described below to `tsconfig.json`.

### Installing Lestin

Installing using Yarn:
```
yarn add -D lestin typescript vite
```

Installing using NPM:
```
npm install -D lestin typescript vite
```

### Configuring JSX for Lestin

After installing, to support JSX, add these configs to your `tsconfig.json` in the root of your project:

```json
{
	"compilerOptions": {
		"jsx": "react-jsx",
		"jsxImportSource": "lestin",
		"moduleResolution": "node",
		"esModuleInterop": true,
	}
}
```

## Examples
Check out [`/examples`](examples) for more examples.

These are some mini projects built with Lestin as examples:
- [Toastification - Toast notifications for DOM WebApps](https://github.com/movahhedi/Toastification)
- [ImageSort - A simple picture categorizer for the exhaust of photos on phone](https://github.com/movahhedi/ImageSort)
- [A presentation about RegEx based on code-presentation](https://github.com/movahhedi/regex-basics)
- [A client-side SVG creator](https://github.com/movahhedi/iau-profile-pic-creator)
- [A simple code presentation](https://github.com/movahhedi/code-presentation)
- [A very basic event adder for Google Calendar](https://github.com/movahhedi/GoogleCalendar-EventCreator)

Below are some examples of other libraries like React and their equivalents in Lestin:

### React Example

What it's like in React ([Source](https://github.com/facebook/react#examples)):
```js
import { createRoot } from 'react-dom/client';

function HelloMessage({ name }) {
    return <div>Hello {name}</div>;
}

const root = createRoot(document.body);
root.render(<HelloMessage name="Taylor" />);
```

The same in Lestin:
```js
function HelloMessage({ name }) {
    return <div>Hello {name}</div>;
}

document.body.appendChild(<HelloMessage name="Taylor" />);
```

You don't need to import Lestin in your scripts for JSX. TypeScript and Vite automatically import them upon build. This is due to setting `lestin` as the `jsxImportSource` in `tsconfig.json`.
Although you may import it to use it's type declarations such as `Lestin.PropsWithChildren`.

Lestin uses Vite as its primarily supported bundler. Vite is extremely fast⚡️, and reliable.

**Quick reminder:** If you choose not to use JSX in your project, using Lestin does nothing, and you can safely remove it. But I really can't find a reason not to use JSX in new projects.

## SSR with Lestin
[Puppeteer](https://pptr.dev/) and [Prerender](https://prerender.io/) are excellent renderers (technically headless browser middlewares) for SSR. Lestin is tested on them too. Read [*Headless Chrome: an answer to server-side rendering JS sites* @ Chrome Developers](https://developer.chrome.com/docs/puppeteer/ssr/).


## Thank You
Special thanks to [React](https://reactjs.org), [@types/react](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react), [*How to Use JSX without React* by Kartik Nair](https://betterprogramming.pub/how-to-use-jsx-without-react-21d23346e5dc), future contributors to this project, and you, for using Lestin.

## License
Lestin is [MIT licensed](https://github.com/movahhedi/lestin/blob/main/LICENSE).

Copyright 2023-present Shahab Movahhedi ([shmovahhedi.com](https://shmovahhedi.com)).

Copyrights on the type definition files are respective of each contributor listed at the beginning of each definition file. Their licenses apply.
