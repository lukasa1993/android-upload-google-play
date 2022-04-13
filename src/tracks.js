const core       = require("@actions/core");
const { google } = require("googleapis");

const androidpublisher = google.androidpublisher("v3");

const fs = require("fs");

const update = async (payload, params) => {
  try {
    const { auth, packageName, editId } = payload;

    const { track, versionCode, status, whatsnewDir } = params;

    core.info(`Adding artifact to release on '${track}' track`);

    return await androidpublisher.edits.tracks.update({
      auth,
      editId,
      packageName,
      track,
      requestBody: {
        track,
        releases: [
          {
            status,
            versionCodes: [versionCode],
            releaseNotes: readReleaseNote(whatsnewDir)
          }
        ]
      }
    });
  } catch (error) {
    core.setFailed(error);
  }
};

const readReleaseNote = (whatsnewDir) => {
  if (whatsnewDir) {
    const files = fs.readdirSync(whatsnewDir);

    return files.map((file) => {
      return {
        language: file,
        text:     fs.readFileSync(`${whatsnewDir}/${file}`, "utf-8")
      };
    });
  }
};

module.exports = {
  update
};
