# stylint-teamcity-reporter
 [TeamCity](https://www.jetbrains.com/teamcity/) reporter for [Stylint](https://github.com/rossPatton/stylint) 

## Install

To install for local project:

```
npm install stylint-teamcity-reporter --save
```

## Usage

### CLI

You need to set `reporter` to `stylint-teamcity-reporter`

```shell
stylint --reporter stylint-teamcity-reporter path/to/filename.styl
```

### Non CLI

You need to set `reporter` to `stylint-teamcity-reporter` in config object.

```json
{
  "reporter": "stylint-teamcity-reporter",
  "reporterOptions": {
    "reportSeverity": "error"
  }
}
```

Possible values for `reportSeverity` are: 
- `all` - Report all messages, by default
- `warning` - Report only warnings
- `error` - Report only errors
