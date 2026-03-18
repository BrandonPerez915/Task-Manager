import express from 'express'
import { apiRouter } from './routes/api.js'

const port = 3000
const app = express()

app.use(express.json())
app.use(apiRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
