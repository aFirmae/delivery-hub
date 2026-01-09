# API Test Cases

| Test ID | Test Scenario | Endpoint | Method | Expected Result |
|---------|---------------|----------|--------|-----------------|
| TC_01 | Register Valid User | /auth/register | POST | 201 Created |
| TC_02 | Register Duplicate Email | /auth/register | POST | 409 Conflict |
| TC_03 | Login Valid User | /auth/login | POST | 200 OK & Token |
| TC_04 | Login Invalid Password | /auth/login | POST | 401 Unauthorized |
| TC_05 | Create Order Valid | /orders/create | POST | 201 Created |
| TC_06 | Create Order Negative Amount | /orders/create | POST | 400 Bad Request |
| TC_07 | Get Order Details | /orders/:id | GET | 200 OK |
| TC_08 | Get Order Unauthorized | /orders/:id | GET | 403 Forbidden |
