//link to the files
const jsonStateData = require('../model/states.json'); //json data file
const mongoFunFacts = require('../model/States.js'); //mongo funfacts schema file

// GET random funfact for state
const getFunfact = async (req, res) => {
    const mongoData = await mongoFunFacts.find();
    const statesArray = [...jsonStateData];
    const myStateCode = req.params.state;
    let myStateObj;
    let randomFunfact;
    let factsArray = [];

    statesArray.forEach(state => {
        if (state.code === myStateCode) {
            myStateObj = state;
        }
    })
    const stateExists = mongoData.find(st => st.stateCode === myStateCode);
    if (stateExists) {
        factsArray = [...stateExists.funfacts];
        randomFunfact = factsArray[Math.floor(Math.random() * factsArray.length)];
        return res.status(200).json({ "funfact": ` ${randomFunfact}` });
    }

    return res.status(200).json({ "message": `No Fun Facts found for ${myStateObj.state}`});
}

// POST a fun fact
const createFunfact = async (req, res) => {
    if (!req?.body?.stateCode || !req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'stateCode and funfacts are required' });
    }

    try {
        const result = await mongoFunFacts.create({
            stateCode: req.body.stateCode,
            funfacts: req.body.funfacts
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

// PATCH a fun fact
const updateFunfact = async (req, res) => {
    if (!req?.body?.stateCode || !req?.body?.index || !req?.body?.funfact) {
        return res.status(400).json({ 'message': 'stateCode, index, and funfact required.' });
    }

    let myIndex = req.body.index - 1;

    const state = await mongoFunFacts.findOne({ stateCode: req.body.stateCode }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches abbreviation ${req.body.stateCode}.` });
    }
    if (req.body?.stateCode) {
        state.stateCode = req.body.stateCode;
    }
    if (req.body?.index) {
        state.funfacts[myIndex] = req.body.funfact;
    }

    const result = await state.save();
    res.json(result);
}

// DELETE a fun fact
const deleteFunfact = async (req, res) => {
    if (!req?.body?.stateCode || !req?.body?.index) { //if missing inputs
        return res.status(400).json({ 'message': `stateCode and index required.` });
    }
    let myIndex = req.body.index - 1; //assign index
    const state = await mongoFunFacts.findOne({ stateCode: req.body.stateCode }).exec(); //look for match

    if (!state) { // if no state matches
        return res.status(204).json({ "message": `No stateCode matches ${req.body.stateCode}.` });
    }

    let factsArray = [...state.funfacts]; //create array of chosen state's facts only
    factsArray = factsArray.filter(fact => fact !== factsArray[myIndex]); //filter out selected index
    state.funfacts = factsArray; // reassign state funfacts
    const result = await state.save(); //save results
    return res.status(200).json({"message": `The funfact at index ${req.body.index} has been deleted.`});//print success message
}

module.exports = {
    getFunfact,
    createFunfact,
    updateFunfact,
    deleteFunfact
}