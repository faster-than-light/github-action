# Faster Than Light BugCatcher GitHub Action 

<center><img src="bugcatcher-logo.svg" alt="Faster Than Light BugCatcher" width="100%" height="auto" /></center>

Use this GitHub Action to add the *Faster Than Light* **[BugCatcher static analysis tool](https://fasterthanlight.dev)** to your CI/CD workflow. Configure your Action with your tolerance (severity threshold) for the severity level of issues which will trigger a failure in your workflow.

<hr />

## Inputs

### `GITHUB_TOKEN`

**Required** : This token is included in the `secrets` dictionary passed to the GitHub workflow and must be passed through to the Action in order to allow it access to the contents of some repositories. This is simply done by adding a `with` parameter in your yaml file (as shown below).

### `BUGCATCHER_TOKEN`

**Required** : A security identifier token copied from your [BugCatcher](https://bugcatcher.fasterthanlight.dev) account.

**Note:** This token must be saved to your GitHub repository&apos;s &nbsp;*`Settings > Secrets`*&nbsp; collection as `BUGCATCHER_TOKEN`.

### `SEVERITY_THRESHOLD`
*options: (`high`, `medium`, `low`)*

**Optional** : The minimum severity level you want to trigger a failure in your testing workingflow. If no value is specified, your checks will pass and include a link to the BugCatcher test results.

## Outputs

### `results`

A list of results from BugCatcher static analysis testing.

## Example usage

Add file: `.github/workflows/bugcatcher.yml` :
```yaml
name: BugCatcher

on: [push]

jobs:
  CI:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Use Node.js 12
        uses: actions/setup-node@v1
        with:
          node-version: 12
      - name: BugCatcher Static Analysis
        uses: faster-than-light/github-action@master
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          BUGCATCHER_TOKEN: ${{ secrets.BUGCATCHER_TOKEN }}
          SEVERITY_THRESHOLD: high
```
