const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const path = require('path')
const app = express()

app.use(express.json())

const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const intilaizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running At http://llocalhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

intilaizeDBAndServer()

app.get('/players/', async (request, response) => {
  const getplayersQuery = `SELECT * FROM cricket_team`
  const players = await db.all(getplayersQuery)
  response.send(list(players))
})

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {player_id, player_name, jersey_number, role} = playerDetails
  const addPlayerQuery = `INSERT INTO cricket_team (player_name, jersey_number, role) VALUES ('${player_name}',${jersey_number},'${role}') ORDER BY ${player_id};`
  const dbResponse = await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = `SELECT * FROM cricket_team WHERE player_id = '${playerId} ORDER BY player_id ASC;`
  const playersByASCOrder = await db.get(playerDetails)
  response.send(playersByASCOrder)
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {player_name, jersey_number, role} = playerDetails
  const updatePlayerQuery = `UPDATE cricket_team SET player_name = '${player_name}', jersey_number = ${jersey_number}, role ='${role}' WHERE player_id = ${playerId};`
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayer = `DELETE from cricket_team WHERE player_id = ${playerId};`
  await db.run(deletePlayer)
  response.send('Player Removed')
})
module.exports = app
