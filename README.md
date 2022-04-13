# Publish Android App to Google Play Console

This action will help you to publish your android app into google play console automatically.

## Inputs

### `service-account`

**Required:** The service account file that is authorized by google cloud console for uploading to google play console.

### `release-file`

**Required:** Android release file (`.aab` file)

### `package-name`

**Required:** Android applicationId or package name of the app you are uploading

### `track`

**Required:** `production`, `alpha`, `beta`, `internal`

### `mapping-file`

The mapping.txt file used to de-obfuscate your stack traces from crash reports.

### `whatsnew-directory`

Directory for release note with multi-language supported. The files contained in the `whatsnew-directory` MUST use the pattern of [`BCP-47 language tag`](https://tools.ietf.org/html/bcp47). e.g

```
projectDir/
└── whatsnew/
    ├── en-US
    └── ja-JP
```

## Example usage

```yaml
- name: Upload App to Google Play Console
  uses: lukasa1993/android-upload-google-play@v2.0.0
  with:
    service-account: ${{ SERVICE_ACCOUNT }}
    package-name: com.example.myapp
    release-file: app/build/outputs/bundle/release/*.aab
    track: production
    status: complete
    whatsnew-directory: whatsnew
    mapping-file: app/build/outputs/mapping/release/mapping.txt
```
