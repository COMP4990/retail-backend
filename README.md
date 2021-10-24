# retail-backend

## Endpoints

- `/login`:
  - @param:
    - email
    - password

  - @return:
    - user:
      - id
      - email
    - accessToken

  example payload:
  
  ```json
  {
    "email": "admin@example.com",
    "password": "password"
  }
  ```

  example response:

  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkNlZqVS54OUlTU2tBRGZ0a05ra0QvdThFVmlKc2dnYkVRcDY2SnRMTE1jYTQ0TS5kUklYYVMiLCJpYXQiOjE2MzUxMDk3OTB9.bJ31Wwg4MRpTnZTvkKfRAurz2CfONT9TZNEksnEDphg",
    "user": {
        "email": "admin@example.com",
        "id": 1
    }
  }
  ```
