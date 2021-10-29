const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const Mint = require("../methods/mint.js")
const transfer = require("../methods/transfer.js")

router.get("/write/mint", async (req, res) => {
    res.render("mint.ejs")
})

router.post("/write/mint", async (req, res) => {
    console.log("Try to mint")
    //console.log(req.body)
    const address_to = req.body.mint_to;
    const no_of_token_to_create = req.body.no_of_token_to_create;
    const token_uri = req.body.token_uri
    const mint = await Mint.Mint(address_to, no_of_token_to_create, token_uri);
    console.log(mint)
    res.send(mint)
})

router.get("/write/transfer", async (req, res) => {
    console.log("req.body", req.body);
    transfer.transfer(req, res);
})

module.exports = router;
