# Mobile App Manual Test Cases

## 1. User Authentication (Common)

| Test ID | Scenario              | Steps                                                                                                           | Expected Result                                   | Priority |
| :------ | :-------------------- | :-------------------------------------------------------------------------------------------------------------- | :------------------------------------------------ | :------- |
| AUTH_01 | Register - Sender     | 1. Open App -> Register<br />2. Fill Name, Email, Phone, Password <br />3. Select "Sender"<br />4. Tap Register | Account created, redirected to Sender Home.       | High     |
| AUTH_02 | Register - Partner    | 1. Open App -> Register<br />2. Fill Details <br />3. Select "Delivery Partner"<br />4. Tap Register            | Account created, redirected to Partner Home.      | High     |
| AUTH_03 | Login - Success       | 1. Enter valid Email & Password<br />2. Tap Login                                                               | Redirected to correct Home screen based on role.  | High     |
| AUTH_04 | Login - Invalid Creds | 1. Enter wrong password<br />2. Tap Login                                                                       | Error message shown: "Invalid email or password". | High     |
| AUTH_05 | Logout                | 1. Go to Profile <br />2. Tap Logout                                                                            | Session cleared, redirected to Login screen.      | Medium   |

## 2. Sender Flow

| Test ID | Scenario                | Steps                                                                                                    | Expected Result                                                      | Priority |
| :------ | :---------------------- | :------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- | :------- |
| SEND_01 | Create Order - Success  | 1. Tap "+" (Create Order)<br />2. Enter Description, Pickup, Delivery Addr, Amount <br />3. Tap "Create" | Success message, Order appears in "Active Orders".                   | High     |
| SEND_02 | Create Order - Negative | 1. Create Order<br />2. Enter negative Amount (-50)                                                      | Error: "Amount cannot be negative". Order not created.               | Medium   |
| SEND_03 | View Active Orders      | 1. Navigate to Home/Active Orders                                                                        | List displays only 'Pending' or 'In-transit' orders created by user. | High     |
| SEND_04 | View History            | 1. Navigate to "Past Orders"                                                                             | List displays 'Delivered' or 'Cancelled' orders.                     | Low      |
| SEND_05 | Cancel Order            | 1. Open Pending Order details<br />2. Tap "Cancel Order"                                                 | Status changes to 'Cancelled'. Removed from Active list.             | High     |
| SEND_06 | Cancel Order - Fail     | 1. Open In-Transit Order<br />2. Try to Cancel                                                           | Cancel button disabled or Error: "Cannot cancel in-transit order".   | Medium   |
| SEND_07 | Edit Profile            | 1. Profile -> Edit <br />2. Change Name/Phone -> Save                                                    | Profile updated, success message shown.                              | Medium   |

## 3. Delivery Partner Flow

| Test ID | Scenario              | Steps                                                  | Expected Result                                                    | Priority |
| :------ | :-------------------- | :----------------------------------------------------- | :----------------------------------------------------------------- | :------- |
| PART_01 | View Available Orders | 1. Navigate to Home                                    | List shows all 'Pending' orders from any sender.                   | High     |
| PART_02 | Accept Order          | 1. Tap a Pending Order<br />2. Tap "Accept Delivery"   | Status becomes 'Assigned'. Order moves to "My Current Deliveries". | High     |
| PART_03 | Update - Picked Up    | 1. Open Assigned Order<br />2. Tap "Mark Picked Up"    | Status changes to 'In-transit'.                                    | High     |
| PART_04 | Update - Delivered    | 1. Open In-transit Order <br />2. Tap "Mark Delivered" | Status changes to 'Delivered'. Added to Earnings.                  | High     |
| PART_05 | View Earnings         | 1. Go to Earnings Screen                               | Shows total earnings from detailed delivered orders.               | Medium   |
| PART_06 | Access Control        | 1. Try to view Sender-only screens                     | UI should restrict access to Sender features.                      | Low      |
