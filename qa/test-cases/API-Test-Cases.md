# API Test Cases

## Authentication Endpoints
| Test ID | Scenario | Endpoint | Method | Body/Params | Expected Status | Expected Result/Message |
|:--------|:---------|:---------|:-------|:------------|:----------------|:------------------------|
| API_01 | Register User | `/auth/register` | POST | `{email, password, name, phone, user_type}` | 201 | `{ token, user_type, ... }` |
| API_02 | Register Duplicate | `/auth/register` | POST | `{existing_email, ...}` | 409 | `{ message: "Email already exists" }` |
| API_03 | Login Success | `/auth/login` | POST | `{email, password}` | 200 | `{ token, ... }` |
| API_04 | Login Fail | `/auth/login` | POST | `{email, wrong_pass}` | 401 | `{ message: "Invalid email or password" }` |
| API_05 | Update Profile | `/auth/profile` | PUT | `{name, phone}` (Auth Header) | 200 | Updated user object |

## Order Endpoints
| Test ID | Scenario | Endpoint | Method | Body/Params | Expected Status | Expected Result/Message |
|:--------|:---------|:---------|:-------|:------------|:----------------|:------------------------|
| API_06 | Create Order | `/orders/create` | POST | `{package_description, pickup_address, delivery_address, amount}` | 201 | `{ status: "pending", ... }` |
| API_07 | Create Order Invalid | `/orders/create` | POST | `{amount: -100}` | 400 | `{ message: "Amount cannot be negative" }` |
| API_08 | List Orders (Sender) | `/orders` | GET | `?limit=10` | 200 | List of own orders |
| API_09 | List Orders (Partner)| `/orders` | GET | `?status=pending` | 200 | List of all pending orders |
| API_10 | Get Order Details | `/orders/:id` | GET | - | 200 | Full order object |
| API_11 | Assign Order | `/orders/:id/status`| PUT | `{status: "assigned"}` (Partner Auth) | 200 | `{ updated: true }` |
| API_12 | Deliver Order | `/orders/:id/status`| PUT | `{status: "delivered"}` (Partner Auth) | 200 | `{ updated: true }` |
| API_13 | Cancel Order | `/orders/:id/cancel`| PUT | - (Sender Auth) | 200 | `{ status: "cancelled" }` |
| API_14 | Cancel Non-Pending | `/orders/:id/cancel`| PUT | Order is 'in_transit' | 400 | `{ message: "Cancellation failed..." }` |

## Earnings Endpoints
| Test ID | Scenario | Endpoint | Method | Body/Params | Expected Status | Expected Result/Message |
|:--------|:---------|:---------|:-------|:------------|:----------------|:------------------------|
| API_15 | Get Earnings | `/orders/partner/earnings` | GET | (Partner Auth) | 200 | `{ total_earnings, orders_count }` |
| API_16 | Get Earnings Denied| `/orders/partner/earnings` | GET | (Sender Auth) | 403 | `{ message: "Access denied" }` |
