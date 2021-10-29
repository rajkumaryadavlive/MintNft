const ipfsAPI = require("ipfs-api");
const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/art_db");
var Art = require("./models/main");
const fs = require("fs");
///////////
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./");
  },
  filename: function (req, file, cb) {
    let dat = new Date().getTime();
    cb(null, dat + "_" + file.originalname);
  },
});
var upload = multer({ storage: storage });
//var upload = multer({dest:'uploads/'});
/////////////
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });


//Addfile router for adding file a local file to the IPFS network without any local node
app.get("/", (req, res) => {
  Art.find({}, function (err, allArts) {
    if (err) {
      console.log(err);
    } else {
      console.log(allArts)
      res.render("b1.ejs", { allArts: allArts });
    }
    //res.render("b1.ejs")
  });
});

app.post("/", upload.single("myFile"), (req, res) => {
  try {
    //res.send(req.file);
    console.log(req.body);
    //res.redirect(`/addfile/${req.file.filename}`)
    ////////////////////
    let testFile = fs.readFileSync(`./${req.file.filename}`);
    //Creating buffer for ipfs function to add file to the system

    const path = `./${req.file.filename}`;

    try {
      fs.unlinkSync(path);
      //file removed
    } catch (err) {
      console.error(err);
    }

    let testBuffer = new Buffer(testFile);

    ipfs.files.add(testBuffer, async (err, file) => {
      if (err) {
        console.log(err);
      }
      //console.log(file);
      console.log(`https://gateway.ipfs.io/ipfs/${file[0].path}`);
      //res.send(`https://gateway.ipfs.io/ipfs/${ file[0].path }`)
      var hash1 = file[0].path;
      console.log(
        "🚀 ~ file: index.js ~ line 66 ~ ipfs.files.add ~ hash1",
        hash1
      );
      let testFile1 = {
        artist: `${req.body.artistName}`,
        artName: `${req.body.artName}`,
        year: `${req.body.year}`,
        otherDetails: `${req.body.otherDetails}`,
        technique: `${req.body.technique}`,
        art_add: `https://gateway.ipfs.io/ipfs/${hash1}`,
      };
      let testBuffer2 = new Buffer.from(JSON.stringify(testFile1));
      await ipfs.files.add(testBuffer2, function (err2, file2) {
        if (err2) {
          console.log(err2);
        }
        //console.log(file2);
        console.log(`https://gateway.ipfs.io/ipfs/${file2[0].path}`);
        let hash2 = file2[0].path;

        /////////////////////////////////////////
        let allDetails = `https://gateway.ipfs.io/ipfs/${hash2}`;
        let artistName = req.body.artistName;
        let artName = req.body.artName;
        let image_uri = `https://gateway.ipfs.io/ipfs/${hash1}`;
        let otherDetails = req.body.otherDetails;
        let year = req.body.year;
        let technique = req.body.technique;

        artRaw = {
          allDetails: allDetails,
          artistName: artistName,
          artName: artName,
          image_uri: image_uri,
          otherDetails: otherDetails,
          year: year,
          technique: technique,
        };

        Art.create(artRaw, function (err, artR) {
          if (err) {
            req.flash("error", err.message);
            return res.redirect("/");
          }
          console.log("Successfully updated in db");
          //res.redirect('/');
        });

        ////////////////////////////////////////
        res.send(artRaw);
      });
    });
    ////////////
  } catch (err) {
    res.send(400);
  }
});


const routes = require("./routes/home.js");
app.use(routes);


app.listen(3000, () => console.log("App listening on port 3001!"));
