# Delivery Hub - Project Overview & Interview Guide

## 1. Project Abstract
**Delivery Hub** is a peer-to-peer logistics platform that connects users who need to send packages (**Senders**) with individuals willing to deliver them (**Delivery Partners**). The application features a secure authentication system, real-time order tracking (via status updates), and an earnings dashboard for partners.

## 2. Technology Stack
- **Backend:** Node.js with Express.js (RESTful API)
- **Database:** MySQL (Relational Data Model)
- **Frontend/Mobile:** React Native (simulated for this project context)
- **Testing:** Postman (API), Jest & Supertest (Automation)

## 3. Database Schema
### Users Table (`users`)
- **id**: String (PK) - Custom format `USR` + Random + Timestamp
- **email**: String (Unique)
- **password**: String (Hashed)
- **name**: String
- **phone**: String
- **user_type**: Enum ('sender', 'delivery_partner')

### Orders Table (`orders`)
- **id**: Integer (PK, Auto-increment)
- **sender_id**: String (FK -> users.id)
- **delivery_partner_id**: String (FK -> users.id, Nullable)
- **package_description**: String
- **pickup_address**: String
- **delivery_address**: String
- **amount**: Decimal - Cost of delivery
- **status**: Enum ('pending', 'assigned', 'in_transit', 'delivered', 'cancelled')
- **created_at**: Timestamp

## 4. Key Workflows (The "Flow")
1.  **Order Creation:** Sender logs in -> Creates active order (Status: `pending`).
2.  **Order Assignment:** Delivery Partner sees list -> Accepts order -> Status updates to `assigned`.
3.  **Delivery Process:** Partner picks up package (`in_transit`) -> Delivers package (`delivered`).
4.  **Earnings:** System calculates partner earnings based on completed deliveries.
5.  **Cancellation:** Sender can cancel order ONLY if status is `pending`.

## 5. Potential Interview Questions

**Q1: How did you ensure the security of user data?**
*Answer:* "I implemented JWT (JSON Web Tokens) for stateless authentication. Passwords are never stored in plain text; they are hashed using `bcrypt` before storage. API endpoints are protected by an `auth` middleware that verifies the token before optimal access."

**Q2: How did you test the 'Earnings' logic?**
*Answer:* "I focused on boundary value analysis. I created orders with decimals, zero amounts (negative checking), and verified the aggregation query in the backend. I verified that only 'delivered' orders are counted towards earnings."

**Q3: How do you handle race conditions (e.g., two partners accepting same order)?**
*Answer:* "In a real-world scenario, I would use database transactions. In this implementation, the `UPDATE` query checks if the order is still 'pending' before assigning. If one partner claims it, the status changes, and the second partner's request would fail validation."

**Q4: What was your approach to testing this application?**
*Answer:* "I adopted a pyramid approach:
1.  **Manual Testing:** Verified UI flows on mobile screens.
2.  **API Testing:** valid/invalid inputs using Postman.
3.  **Automation:** Implemented regression tests using Jest/Supertest to ensure new features don't break existing login or order flows."
