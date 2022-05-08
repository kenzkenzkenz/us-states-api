//link to the files
const jsonStateData = require('../model/states.json'); //json data file
const mongoFunFacts = require('../model/States.js'); //mongo funfacts schema file

// GET all states
const getAllStates = async (req, res) => {
    const mongoData = await mongoFunFacts.find();
    let statesArray = [...jsonStateData];
    const contig = req.query?.contig;

    statesArray.forEach(state => {
        const stateExists = mongoData.find(st => st.stateCode === state.code);
        if (stateExists) {
            state.funfacts = stateExists.funfacts;
        }
    })

    if (contig === "true") {
        statesArray = statesArray.filter(st => st.code !== 'AK' && st.code !== 'HI');
    }
    if (contig === "false") {
        statesArray = statesArray.filter(st => st.code === 'AK' || st.code === 'HI');
    }

    res.json(statesArray);
}

// GET one state
const getState = async (req, res) => {
    const mongoData = await mongoFunFacts.find();
    const statesArray = [...jsonStateData];
    const myStateCode = req.params.state;
    let myStateObj;

    statesArray.forEach(state => {
        if (state.code === myStateCode) {
            myStateObj = state;
        }
    })
    const stateExists = mongoData.find(st => st.stateCode === myStateCode);
    if (stateExists) {
        myStateObj.funfacts = stateExists.funfacts;
    }
    res.json(myStateObj);
}

// GET capital of state
const getCapital = async (req, res) => {
    const statesArray = [...jsonStateData];
    const myStateCode = req.params.state;
    let myCapital;

    const stateExists = statesArray.find(st => st.code === myStateCode); //find matching code
    if (stateExists) { //if match found
        myCapital = stateExists.capital_city; //extract the capital
    }
    let result = ({ "state": `${stateExists.state}`, "capital": `${myCapital}` });
    res.json(result);//print success message

}

// GET nickname of state
const getNickname = async (req, res) => {
    const statesArray = [...jsonStateData];
    const myStateCode = req.params.state;
    let myNickname;

    const stateExists = statesArray.find(st => st.code === myStateCode); //find matching code
    if (stateExists) { //if match found
        myNickname = stateExists.nickname; //extract the nickname
    }
    let result = ({ "state": `${stateExists.state}`, "nickname": `${myNickname}` });
    res.json(result);//print success message
}

// GET population of state
const getPopulation = async (req, res) => {
    const statesArray = [...jsonStateData];
    const myStateCode = req.params.state;
    let myPopulation;

    const stateExists = statesArray.find(st => st.code === myStateCode); //find matching code
    if (stateExists) { //if match found
        myPopulation = stateExists.population; //extract the population
    }
    let result = ({ "state": `${stateExists.state}`, "population": `${myPopulation.toLocaleString("en-US")}` });
    res.json(result);//print success message
}

// GET admission date of state
const getAdmission = async (req, res) => {
    const statesArray = [...jsonStateData];
    const myStateCode = req.params.state;
    let myAdmission;

    const stateExists = statesArray.find(st => st.code === myStateCode); //find matching code
    if (stateExists) { //if match found
        myAdmission = stateExists.admission_date; //extract the admission date
    }
    let result = ({ "state": `${stateExists.state}`, "admitted": `${myAdmission}` });
    res.json(result);//print success message
}

module.exports = {
    getAllStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
}