# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Pull request previews

Every pull request from a branch of this repository is built and published as a preview. The link is added to the pull request description (between `<!-- pr-preview:start -->` and `<!-- pr-preview:end -->`) about a minute after each push, and removed again when the pull request is closed or merged.

```
https://theempathicdev.de/previews/<slug>/
```

`<slug>` is the branch name with `/` replaced by `-`, every other character outside `A-Z a-z 0-9 . _ -` replaced by `-`, leading and trailing `.` and `-` removed, cut to 60 characters. `anton/fix-date-abc123` becomes `anton-fix-date-abc123`.

How it works (`.github/workflows/`):

- `pr-preview.yml` builds the pull request with a read-only token and uploads the site as an artifact.
- `pr-preview-publish.yml` runs from `main`, never executes pull request code, copies the artifact to `previews/<slug>/` on the `gh-pages` branch and updates the description. On close or merge it deletes the folder.
- `deploy.yml` keeps `previews/` when it deploys `main`.

Limits: no previews for pull requests from forks, and links or images with absolute paths (`/blog`, some `/img/...`) point to the live site.
