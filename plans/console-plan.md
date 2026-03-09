Below is a simple console UI plan for a downtime monitoring product.

## Console Layout

Main layout:

```
Sidebar
Top bar
Main content area
```

Sidebar navigation:

```
Dashboard
Monitors
Incidents
Logs
Alerts
Status Pages
Settings
```

Top bar:

* workspace selector
* search
* notifications
* user menu

---

# Pages Plan

## 1. Dashboard

Purpose: quick system overview.

Sections:

**Stats cards**

* Total monitors
* Monitors up
* Monitors down
* Active incidents

**Uptime chart**

* last 24h
* last 7 days

**Response time chart**

Average latency of monitors.

**Recent incidents**

List of latest downtime events.

**Recent checks**

Latest monitor activity.

---

## 2. Monitors Page

Purpose: manage endpoints.

Table columns:

```
Name
URL
Status
Interval
Response time
Last checked
Actions
```

Features:

* create monitor
* pause / enable
* edit monitor
* delete monitor
* filter by status
* search

Top button:

```
Add Monitor
```

---

## 3. Create / Edit Monitor Page

Fields:

```
Monitor name
URL
HTTP method
Check interval
Timeout
Expected status code
Headers (optional)
```

Optional later:

* region selection
* keyword monitoring

Buttons:

```
Create Monitor
Save Changes
```

---

## 4. Monitor Details Page

Shows everything about one endpoint.

Sections:

**Monitor summary**

```
URL
Status
Interval
Last check
Response time
```

**Uptime graph**

Shows uptime over time.

**Response time graph**

Latency history.

**Check history**

Table:

```
Status
Status code
Response time
Time
```

**Incident history**

List of downtime events.

---

## 5. Incidents Page

Shows downtime events.

Table:

```
Monitor
Status
Started
Resolved
Duration
```

Clicking opens incident details.

Incident details show:

* timeline
* logs during failure
* resolution time

---

## 6. Logs Page

Raw monitoring logs.

Table:

```
Monitor
Status
Status code
Response time
Timestamp
Error
```

Filters:

* monitor
* status
* time range

---

## 7. Alerts Page

Configure notifications.

Alert channels:

```
Email
Slack
Webhook
Telegram
```

Settings:

```
Notify when monitor goes down
Notify when monitor recovers
Alert delay
```

---

## 8. Status Pages

Public uptime page.

Features:

* public URL
* choose monitors to show
* incident history
* uptime stats

---

## 9. Settings Page

Sections:

**Team**

* invite member
* roles

**API keys**

* generate API token

**Workspace settings**

* project name
* timezone

---

# Console Structure

```
Dashboard
Monitors
  └ Monitor Details
Incidents
Logs
Alerts
Status Pages
Settings
```

---

# Recommended MVP

Start with only:

```
Dashboard
Monitors
Monitor Details
Incidents
```

Then add alerts and logs later. This keeps the first version simple.
