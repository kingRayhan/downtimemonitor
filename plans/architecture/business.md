# RM2AI Project Overview

## What This Project Is About

**RM2AI** is a **multi-tenant healthcare platform** that connects organizations, individual/family users, and patients with wearable devices and health monitoring. The system supports:

- **B2B (Organizations)** — Healthcare or other organizations that onboard members (patients), order and manage wearables, and pay via pro-rated monthly billing.
- **B2C (Individual & Family)** — Individuals or families who sign up directly, add members, order wearables, and subscribe on a monthly/half-yearly/yearly basis.
- **Mobile (Patients & Family)** — Patients and family members who use the mobile app (under a fixed RM2AI B2B tenant) to log vitals, manage reminders, and stay connected with their care circle.

The platform provides **web portals** for admins and tenant admins, **REST APIs** for user/tenant/billing/wearable management, and a **mobile app** for members and family to track health, reminders, and family events.

---

## Features at a Glance

| Area                 | What It Does                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Signup & auth**    | Website signup (B2B / B2C), mobile member/family signup; Cognito + OTP; role-based access (SUPER_ADMIN, TENANT_ADMIN, MEMBER, FAMILY_MEMBER).                 |
| **Tenants**          | B2B tenants (orgs) require admin approval and pricing; B2C tenants get immediate access; mobile users belong to the RM2AI tenant.                             |
| **Wearables**        | Ordering, assignment to members, tracking; B2B buys in bulk and assigns; B2C orders per member with flat shipping.                                            |
| **Billing**          | B2B: one-time wearable purchase + pro-rated monthly MAU billing. B2C: wearable + shipping + subscription (1/6/12 month). Invoices and Stripe integration.     |
| **Members & health** | Member CRUD, geo-fencing, vitals (blood pressure, glucose, heart rate, weight, etc.), medications, water intake, fall detection, notifications.               |
| **Mobile app**       | Reminders (medical/non-medical appointments, family events), health logs, family circle, allergies, diagnosis, vaccination history, settings and permissions. |
