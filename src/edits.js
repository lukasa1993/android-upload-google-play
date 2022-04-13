const core = require("@actions/core");

const { google } = require("googleapis");

const androidpublisher = google.androidpublisher("v3");

const insert = async (payload) => {
  try {
    core.info("Creating a new edit for this release...");

    const res = await androidpublisher.edits.insert(payload);
    core.info("insert successfully");
    return res.data;
  } catch (error) {
    core.error("insert error");
    core.setFailed(error);
  }
};

const commit = async (payload) => {
  try {
    core.info("Committing the edit...");
    return await androidpublisher.edits.commit(payload);
  } catch (error) {
    core.setFailed(error);
  }
};

module.exports = {
  insert,
  commit
};
