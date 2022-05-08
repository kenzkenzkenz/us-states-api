const jsonStateData = require('../model/states.json'); //json data file

const verifyState = () => {
    return (req, res, next) => {
        const capState = req.params.state.toUpperCase(); //capitalize user's state code
        const stateCodes = jsonStateData.map(state => state.code); //make array of original state codes only
        const isState = stateCodes.find(state => state === capState);//search state codes array for user's state

        if (!isState) { //user's state code is not in array; so print message
            return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
        }
        req.params.state = capState; //user's input is in all caps
        next(); //continue to getState function
    }
}
module.exports = verifyState