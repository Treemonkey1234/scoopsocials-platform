# Groups Feature Specification - ScoopSocials
*In-Person Activity Events with Trust-Based Access*

## Overview
Groups are location-based events for in-person activities. Users can create and join events based on their Trust Scores and account types, with built-in networking and review systems to enhance community trust.

---

## Account Types & Permissions

### **Free Account**
- **Event Creation:** Unlimited events
- **Event Types:** Public and Private
- **Invitation Limit:** 20 users per event
- **Trust Score Requirement:** 50+ to create events

### **Professional Account (Paid)**
- **Event Creation:** Unlimited events  
- **Event Types:** Public and Private
- **Invitation Limit:** Unlimited invitations
- **Trust Score Requirement:** 50+ to create events
- **Additional Features:** Enhanced event promotion, analytics

### **Venue Account (Business - Paid)**
- **Purpose:** Bars, restaurants, businesses hosting events
- **Event Creation:** Unlimited business events
- **Event Types:** Primarily public events
- **Verification:** Same profile setup as standard users (website, social media presence)
- **Special Features:** 
  - Direct outreach to past attendees
  - Business branding on events
  - Discount/promotion integration
  - Customer retention tools

---

## Event Management System

### **Event Creation**
- **Host Role:** Event creator automatically becomes host
- **Host Permissions:** Cannot delegate admin rights to others
- **Location Input:** Address or map pinpoint
- **Event Duration:** Start time and end time required
- **Privacy Settings:** Public or Private
- **Event Categories:** Custom tags (user-defined)
- **Trust Score Minimums:** Host sets minimum for public events (auto-denies low scores)

### **RSVP System**
- **RSVP Options:** "Going", "Maybe", "Can't Go"
- **Attendance Limits:** Optional max capacity setting
- **Public Events:** Automatic approval (if meets Trust Score minimum)
- **Private Events:** Invitation-only
- **Notifications:** RSVPs sent to user's inbox

### **Event Discovery**
- **Map View:** Interactive map with event pins (Google Maps-style)
- **Default Radius:** 5-mile radius from user location
- **Map Controls:** Full zoom in/out capability like Google Maps
- **Pin Interaction:** Click for basic details, "See More" for full info
- **Filters:** Event type, distance, time, Trust Score requirements
- **Map Integration:** Plugins for seamless mapping functionality

---

## Trust Score Integration

### **Creation Requirements**
- **Minimum Score:** 50+ to create any event
- **Host Control:** Set custom minimums for public events
- **Auto-Moderation:** System automatically denies users below set threshold

### **Post-Event Reviews**
- **Automatic Trigger:** Event end time triggers post-event prompts
- **Event Reviews:** Attendees review the event experience
- **Networking Prompts:** Connect with other attendees met at event
- **Home Feed Integration:** Event reviews appear in main feed
- **Friend Suggestions:** System suggests other attendees as potential friends
- **Trust Building:** Event interactions contribute to overall Trust Scores

---

## User Experience Flow

### **Event Discovery**
1. User opens Groups tab
2. Views map with event pins in their area
3. Clicks pin → sees basic event info
4. Clicks "See More" → full event details + attendee roster
5. Views attendee profiles and Trust Scores
6. RSVPs if interested and meets requirements

### **Event Creation**
1. User clicks "Create Event"
2. Sets location (address or map pin)
3. Adds event details (time, description, etc.)
4. Chooses Public/Private
5. Sets Trust Score minimum (if public)
6. Sends invitations (if private)
7. Event goes live on map

### **Post-Event**
1. Event ends
2. Attendees receive networking prompts
3. Option to connect with other attendees
4. Prompted to review event experience
5. Reviews feed into home timeline
6. System suggests new friends from event

---

## Business Integration

### **Venue Features**
- **Business Events:** Happy hours, promotions, special events
- **Customer Outreach:** Contact past attendees for future events
- **Discount Integration:** RSVP = discount eligibility
- **Branding:** Business logo and info on event listings
- **Analytics:** Event performance and attendance tracking

### **Revenue Model**
- **Professional Accounts:** Enhanced features for power users
- **Venue Accounts:** Business event management and customer engagement
- **Verified Businesses:** Trust verification for legitimate venues

---

## Technical Considerations

### **Location Services**
- **Map Integration:** Interactive map with real-time event pins
- **Address Validation:** Ensure real locations
- **Privacy Controls:** Private event locations hidden until RSVP

### **Notification System**
- **RSVP Confirmations:** Immediate inbox notifications
- **Event Reminders:** Day-of and hour-before reminders
- **Post-Event Prompts:** Networking and review notifications

### **Security & Trust**
- **Trust Score Verification:** Real-time score checking
- **Business Verification:** Prevent fake venue accounts
- **Event Moderation:** Report system for inappropriate events

---

## Success Metrics
- **Event Creation Rate:** Events created per user per month
- **RSVP Conversion:** View-to-RSVP ratios
- **Attendance Rate:** RSVP-to-attendance ratios
- **Post-Event Engagement:** Reviews and connections made
- **Trust Score Impact:** How events affect overall platform trust
- **Business Retention:** Venue account renewal rates

---

*This feature transforms ScoopSocials from a review platform into a comprehensive trust-based social network for real-world connections.*