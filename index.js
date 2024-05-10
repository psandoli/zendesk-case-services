const axios = require("axios")
const cors = require("cors")

// Load environment variables from .env file
require("dotenv").config()

const express = require("express")
const app = express()
const port = 8000

// Middleware to parse JSON bodies
app.use(express.json())

app.use(cors())

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

app.post("/ticket", async (req, res) => {
  const body = req.body

  const data = JSON.stringify({
    ticket: {
      subject: body?.subject,
      comment: body?.comment,
      requester: body?.requester,
    },
  })

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://psandoli.zendesk.com/api/v2/tickets.json",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(
        "paulasandoli@gmail.com/token:" + process.env.PASSWORD
      )}`,
    },
    data: data,
  }

  axios
    .request(config)
    .then((response) => {
      res.statusCode = 200
      res.setHeader("Content-Type", "text/plain")
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.json({ ticketId: response?.data?.ticket?.id })
    })
    .catch((error) => {
      res.statusCode = 500
      res.setHeader("Content-Type", "text/plain")
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.json(error)
    })
})
