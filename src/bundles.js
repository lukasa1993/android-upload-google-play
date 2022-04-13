const core       = require("@actions/core");
const { google } = require("googleapis");

const androidpublisher = google.androidpublisher("v3");

const fs = require("fs");

const upload = async (payload, releaseFile) => {
  try {
    const { auth, packageName, editId } = payload;

    core.info(`Your release file ${releaseFile}`);

    const bundleFile = fs.createReadStream(releaseFile);

    core.info("Uploading your bundle file...");

    const res = await androidpublisher.edits.bundles.upload({
      auth,
      packageName,
      editId,
      media: {
        mimeType: "application/octet-stream",
        body:     bundleFile
      }
    });

    core.info(
      `Successfully upload versionCode '${res.data.versionCode}' bundle file.`
    );

    return res.data;
  } catch (error) {
    core.error("error uploading bundle");
    core.setFailed(error);
  }
};

const uploadMappingFile = async (payload, params) => {
  try {
    const { auth, packageName, editId } = payload;
    const { versionCode, mappingFile }  = params;

    if (mappingFile) {
      const mapping = fs.readFileSync(mappingFile, "utf-8");

      if (mapping) {
        core.info("Uploading mapping file...");
        return await androidpublisher.edits.deobfuscationfiles.upload({
          auth,
          packageName,
          editId,
          apkVersionCode:        versionCode,
          deobfuscationFileType: "proguard",
          media:                 {
            mimeType: "application/octet-stream",
            body:     fs.createReadStream(mappingFile)
          }
        });
      }
    }
  } catch (error) {
    core.setFailed(error);
  }
};

module.exports = {
  upload,
  uploadMappingFile
};
