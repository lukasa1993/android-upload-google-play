const core       = require("@actions/core");
const { google } = require("googleapis");

const fg = require("fast-glob");

const edits   = require("./src/edits");
const bundles = require("./src/bundles");
const tracks  = require("./src/tracks");

const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/androidpublisher"]
});

async function uploadToGooglePlay(payload, releaseFile, configuration) {
  try {
    const { track, mappingFile, whatsnewDir, status } = configuration;

    const { id } = await edits.insert(payload);
    const bundle = await bundles.upload({ ...payload, editId: id }, releaseFile);

    await bundles.uploadMappingFile({ ...payload, editId: id }, { versionCode: bundle.versionCode, mappingFile });

    await tracks.update({ ...payload, editId: id }, {
      track,
      versionCode: bundle.versionCode,
      status:      status || "draft",
      whatsnewDir
    });

    await edits.commit({ ...payload, editId: id, changesNotSentForReview: false });
  } catch (error) {
    core.setFailed(error);
  }
}

async function execute() {
  try {
    const serviceAccount = core.getInput("service-account", { required: true });
    const packageName    = core.getInput("package-name", { required: true });
    const releaseFile    = core.getInput("release-file", { required: true });
    const track          = core.getInput("track", { required: true });
    const status         = core.getInput("status", { required: false });
    const mappingFile    = core.getInput("mapping-file", { required: false });
    const whatsnewDir    = core.getInput("whatsnew-directory", {
      required: false
    });

    if (!serviceAccount) {
      core.setFailed("You must provide a service account file to use this action.");
    }

    if (!packageName) {
      core.setFailed("You must provide your app package name in your configuration.");
    }

    if (!releaseFile) {
      core.setFailed("You must provide a release file in your configuration.");
    }

    if (!track) {
      core.setFailed("You must provide track in your configuration.");
    }

    core.info(`Your service account file ${serviceAccount}`);

    core.exportVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccount);

    const files = await fg(releaseFile);
    await uploadToGooglePlay({ auth, packageName }, files[0], {
      track, mappingFile, whatsnewDir, status
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

execute().catch(e => console.log("execute error", e));
