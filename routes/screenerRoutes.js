const express = require("express");

const router = express.Router();

const {

    scanNow,

    getLatest

} = require("../controllers/screenerController");

router.get("/scan", scanNow);

router.get("/latest", getLatest);

module.exports = router;