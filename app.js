const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const connectDB = require('./db')
const path = require('path')
const Input = require('./models/Input')
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { getMaxListeners } = require('./models/Input');
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
connectDB()

app.get('/', async(req, res) => {
    
    const CurrentDate = new Date();          // Get current Date

    const CurrentDateplus5 = new Date();          // Get current Date
    CurrentDateplus5.setDate(CurrentDateplus5.getDate() + 5); // add 5 days to the current date

    // if (due date falls b/w currentDATA and currenrDate+5day){
    //     then it will send email with product id and duedate
    // }

    // const resp = await Input.find({ "duedate": { $in: [`${CurrentDate} , ${CurrentDateplus5}`] } });
    const resp = await Input.find({ "duedate": { "$gte": `${CurrentDate}`, "$lt": `${CurrentDateplus5}` } });

    // console.log(resp);
    resp.forEach(({ _id, duedate, equip_no }) => {
        console.log("My email Data -> " + _id + " " + duedate);
        //email options
        const mailOptions = {
            from: process.env.EMAIL,
            to: 'daspreeti1609@gmail.com',
            subject: 'Email from Node-js app',
            text: `Due date for your equipment number - ${equip_no} is on ${duedate}`
        };

        // //email transport configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        // //send email

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log('email send' + info.response);
            }
        });

    });
    
    
    res.render('main')
})

app.get('/main', (req, res) => res.render("input"))

app.post('/in', async (req, res) => {
    const {name, section, location, equip_no, equip_des, equip_type, range, accuracy, frequency, lastdate, duedate, intidays, status, remarks } = req.body
    const newInput = new Input({
        plant:name,
        section,
        location,
        equip_no,
        equip_des,
        equip_type,
        range,
        accuracy,
        frequency,
        lastdate,
        duedate,
        intidays,
        status,
        remarks
    })

    newInput.save().then((inp) => console.log("Data Saved")).catch(err => console.error(err))
    res.render('saved')
})

app.get('/display', async (req,res) => { 
    const resp = await Input.find({});
    let display = ''
    resp.forEach(({plant, section, location, equip_no, equip_des, equip_type, range, accuracy, frequency, lastdate, duedate, intidays, status, remarks}) => {
    
        display += `
        <tr>
            <th>${plant}</th>
            <th>${section}</th>
            <th>${location}</th>
            <th>${equip_no}</th>
            <th>${equip_des}</th>
            <th>${equip_type}</th>
            <th>${range}</th>
            <th>${accuracy}</th>
            <th>${frequency}</th>
            <th>${lastdate}</th>
            <th>${duedate}</th>
            <th>${intidays}</th>
            <th>${status}</th>
            <th>${remarks}</th>
        </tr>
        `
    })
    res.render('display', {display})
})


const CurrentDate = new Date();

app.get('/pending', async (req, res) => {
    // const resp = await Input.find();
    // Case 1: (duedate>=currentData)
    // const resp = await Input.find({ "duedate": { $gte: `${CurrentDate}` } });
    // Case 2: (duedate<=currentData)
    const resp = await Input.find({ "duedate": { $lte: `${CurrentDate}` } });
    // let -> Return less than and equal to
    // gte -> Return greater than and equalto
    // gt -> Returns greater
    // le -> Returns less
    // if duedate is >= current data

    let display = ''
    resp.forEach(({ plant, section, location, equip_no, equip_des, equip_type, range, accuracy, frequency, lastdate, duedate, intidays, status, remarks }) => {

        display += `
        <tr>
            <th>${plant}</th>
            <th>${section}</th>
            <th>${location}</th>
            <th>${equip_no}</th>
            <th>${equip_des}</th>
            <th>${equip_type}</th>
            <th>${range}</th>
            <th>${accuracy}</th>
            <th>${frequency}</th>
            <th>${lastdate}</th>
            <th>${duedate}</th>
            <th>${intidays}</th>
            <th>${status}</th>
            <th>${remarks}</th>
        </tr>
        `
      

    



    })
    res.render('pending', { display })
})





app.get("/update", (req,res) => { res.render('update')})
app.get("/deleteone", (req,res) => { res.render('deleteone')})


app.post("/dataPUT", function (req, res) {
    // Change this plant to _id attribute later and select each row with its id.

    Input.updateOne({ plant: req.body.oldname }, { $set: { plant: req.body.name, section: req.body.section, location: req.body.location, 
        equip_no: req.body.equip_no, equip_des: req.body.equip_des, equip_type: req.body.equip_type, range: req.body.range, accuracy: req.body.accuracy, frequency: req.body.frequency, lastdate: req.body.lastdate, duedate: req.body.duedate, intidays: req.body.intidays, status: req.body.status, remarks: req.body.remarks } }, function (err, resp) {
        if (!err) {
            console.log(resp);
            res.redirect('display')
        }
        else {
            console.log(err);
        }
    });
});

app.post("/dataDel", function (req, res) {
    // Make use to but attribute that is unique
    var myquery = { plant: req.body.name };
    Input.deleteOne(myquery, function (err, resp) {
        if (!err) {
            console.log(resp);
            res.redirect("display");
        }
        else {
            console.log(err);
        }
    });
});


app.post("/dataDelAll", function (req, res) {
    // Make use to but attribute that is unique
    Input.deleteMany(function (err, resp) {
        if (!err) {
            console.log(resp);
            res.redirect("display");
        }
        else {
            console.log(err);
        }
    });
});





app.use('/input', require('./routes/input.js'))
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))
