import axios from 'axios'

export const injectDataToTarget = async (baseURL, dataValues) => {
    try {
        await axios.post(`${baseURL}/api/dataValueSets.json`, { dataValues })
    } catch (error) {
        console.log(error.message)
    }
}