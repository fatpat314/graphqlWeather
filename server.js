// Import dependancies
require('dotenv').config({ path: '.env' });
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const fetch = require("node-fetch");


const schema = buildSchema(`
type Weather {
    temperature: String!
    description: String!
    feels_like: String!
    temp_min: String!
    temp_max: String!
    pressure: String!
    humidity: String!
    cod: Int
    message: String
}

enum Units {
    standard
    metric
    imperial
}

type Query {
    getWeather(zip: Int!, units: Units): Weather!
}
`)

const root = {
    getWeather: async ({ zip, units = 'imperial' }) => {
          const apikey = process.env.OPENWEATHERMAP_API_KEY;
          const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apikey}&units=${units}`;
          const res = await fetch(url);
          const json = await res.json();
          console.log(json)
          const temperature = json.main.temp;
          const feels_like = json.main.feels_like;
          const temp_min = json.main.temp_min;
          const temp_max = json.main.temp_max;
          const pressure = json.main.pressure;
          const humidity = json.main.humidity;
          const description = json.weather[0].description;
          return { temperature, description, feels_like, temp_min, temp_max, pressure, humidity };
      }
}

// Create an express app
const app = express()


// Define a route for GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

// Start this app
const port = 4000
app.listen(port, () => {
  console.log('Running on port:'+port)
})
