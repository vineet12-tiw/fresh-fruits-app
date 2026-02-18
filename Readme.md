That is the perfect operational advantage. The **"Milk Run" (T+1)** model completely removes the stress of instant payment verification.

You have a roughly **12-hour window** (8 PM cutoff to 8 AM packing) to comfortably check your bank statement or SMS logs and mark orders as `CONFIRMED` or `REJECTED`.

Here is your **Final, Production-Ready** Project Context. **Save this file.**

---

# 📂 PROJECT_CONTEXT.md

**Project Name:** Fresh Fruits Milk Run (WhatsApp + Prepaid Model)
**Current Date:** Feb 13, 2026
**Location:** Hyderabad, India
**Status:** Ready for Development

---

## 1. 🏗 System Architecture

* **Customer Interface:** **WhatsApp Business API** (Ordering & History).
* **Admin/Driver Interface:** **Web Dashboard** (React bundled inside Spring Boot).
* **Backend:** Java 17 + Spring Boot 3 + Spring Security 6.
* **Database:** MySQL (AWS RDS Free Tier).
* **Hosting:** Single AWS EC2 Instance (Runs Java + Serves Admin UI).

---

## 2. 🚦 Business Logic & Rules

* **Ordering Channel:** WhatsApp Flow (Native Form).
* **Payment Policy:** **Strictly Prepaid** (UPI Intent Links).
* *Process:* User Orders  Bot sends UPI Link  User Pays via GPay/PhonePe.
* **Verification:** **Manual via Bank SMS/Statement.**
* *Timeline:* Admin verifies payments between **8:00 PM (Cutoff)** and **6:00 AM (Packing Start)**.


* **Delivery Model:** "Milk Run" (Batch Delivery Next Day).
* **Unpaid Orders:** Any order not verified by 6:00 AM is automatically skipped.

---

## 3. 🔐 Security Configuration

* **Public Access:**
* `POST /api/whatsapp/webhook` (Meta Callback).
* `GET /login` (Admin Login Page).


* **Admin Only (`ROLE_ADMIN`):**
* `GET /admin/**` (The Web Dashboard).
* `POST /api/fruits/**` (Manage Stock).
* `GET /api/orders/all` (Packing List).
* `POST /api/orders/{id}/confirm-payment` (Mark as Paid).



---

## 4. 💻 Backend State (To-Build)

### **A. Entities**

* **`UserEntity`**: `id`, `phone` (username), `role` (`CUSTOMER`, `ADMIN`).
* **`Fruit`**: `id`, `name`, `price`, `stock`.
* **`Order`**: `id`, `customerPhone`, `items` (JSON), `totalAmount`, `status` (`PENDING_PAYMENT`, `PAID`, `DELIVERED`), `paymentReference`.

### **B. WhatsApp Components**

* **`WhatsAppController`**: Receives messages & button clicks.
* **`FlowService`**: Sends the "Fruit Cart" form.
* **`PaymentService`**: Generates `upi://pay` links.

---

## 5. 🚀 Next Steps (Implementation)

1. **Meta Setup:** Register App & Get Test Number.
2. **Backend Core:**
* Add `spring-boot-starter-webflux`.
* Create `WhatsAppWebhookController` (Verification + Echo).


3. **Order Logic:**
* Implement `POST /api/orders` to save `PENDING_PAYMENT` order.
* Send "Pay Now" UPI Link back to WhatsApp.

4.**Admin logic** add UTR Auto-Reconciliation



---

**We are now ready to write code.**

Your first step is to **Setup the Meta App** to get your credentials (Token & Phone Number ID).

**Do you have a Meta Developer account, or should I guide you through creating the App and getting the Test Number?**