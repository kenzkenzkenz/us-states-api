//link to the files
const jsonStateData = require('../model/states.json'); //json data file
const mongoData = require('../model/States.js'); //mongo funfacts schema file

// GET random funfact for state
const getFunfact = async (req, res) => {
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
    //dealing with inputs
    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }
    const myFunfacts = req.body.funfacts;
    if (!Array.isArray(myFunfacts)){
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    }
    const myStateCode = req.params.state.toUpperCase();


    //dealing with mongo
    const stateExists = await mongoData.find({ stateCode: myStateCode }).exec();

    if (!stateExists){
        const newState = await mongoData.create({
            stateCode: myStateCode,
            funfacts: myFunfacts
        });
        return res.json(newState);

    } else {
        stateExists.funfacts = [stateExists.funfacts, ...myFunfacts];
        return res.json(stateExists.funfacts);
    }
}

// PATCH a fun fact
const updateFunfact = async (req, res) => {
    //deal with inputs
    if (!req?.body?.index || !req?.body?.funfact) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }
    let myIndex = req.body.index - 1;

    if (typeof req.body.funfact[myIndex] != 'string'){
        return res.status(400).json({ 'message': 'State fun fact value required' });
    }

    //deal with mongo
    const state = await mongoData.find(st => st.stateCode === req.params.stateCode);
    if (!state) {
        return res.status(204).json({ "message": `No Fun Facts found for ${state}.` });
    }

    const myStateFactsArray = state.map(st => st.funfacts);
    if (!myStateFactsArray[req.body.index]) {
        return res.status(204).json({  "message": `No Fun Fact found at that index for ${state}.` });
    }
    if (req.params.stateCode) {
        state.stateCode = req.params.stateCode;
    }
    if (req.body.index) {
        state.funfacts[myIndex] = req.body.funfact;
    }

    const result = await state.save();
    res.json(result);
}

// DELETE a fun fact
const deleteFunfact = async (req, res) => {
    if (!req?.body?.index) { //if missing inputs
        return res.status(400).json({ 'message': `State fun fact index value required` });
    }
    let myIndex = req.body.index - 1; //assign index
    const state = await mongoData.findOne({ stateCode: req.params.stateCode }).exec(); //look for match

    if (!state) { // if no state matches
        return res.status(204).json({ "message": `No Fun Facts found for ${req.params.stateCode}.` });
    }

    let factsArray = [...state.funfacts]; //create array of chosen state's facts only
    if (!factsArray[myIndex]) {
        return res.status(204).json({  "message": `No Fun Fact found at that index for ${state}.` });
    }

    factsArray = factsArray.filter(fact => fact !== factsArray[myIndex]); //filter out selected index
    state.funfacts = factsArray; // reassign state funfacts
    const result = await state.save(); //save results
    res.json(result);//print success message
}

module.exports = {
    getFunfact,
    createFunfact,
    updateFunfact,
    deleteFunfact
}