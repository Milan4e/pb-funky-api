# pb-funky-api

# npm install

# npm start

## Service will run on localhost:3000


## API Docs

### Create feature

POST /api/feature

BODY
{
  "data": {
    "id": "1d1ce8f8-7cdd-42c7-b2cd-4b4df9d8741e",
    "name": "Archive a ticket",
    "description": "Smoke test description 2021-01-05T13:34:25.507521Z",
    "type": "subfeature",
    "status": {
        "id": 180915,
        "name": "In progress"
      }
  }
}

### Create board

POST /api/feature/boards

BODY
{
  "name": "My first board"
}

### Get all boards

GET /api/feature/boards

### Create widget

POST /api/feature/boards/o9J_lZ6I-3Y=/widget (where o9J_lZ6I-3Y= is board ID)

BODY
{
  "name": "My first board"
}
