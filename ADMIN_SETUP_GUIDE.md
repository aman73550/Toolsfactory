# 👑 Admin Portal Setup & Usage Guide

Welcome to the Toolsfactory Admin Portal. This guide walks you through authentication, configuration, and using the admin dashboard.

---

## 🔐 Authentication Setup

### Prerequisites
Make sure you have the following installed:
- Node.js (v18+)
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
npm install
# or
yarn install
```

2. **Configure Environment Variables**
Create a `.env.local` file in the project root:
```bash
cp .env.local.example .env.local
```

3. **Update `.env.local` with your settings:**
```env
JWT_SECRET=your-unique-secret-here-change-in-production
ADMIN_EMAIL=owsmboy7383@gmail.com
ADMIN_PASSWORD_HASH=$2b$10$dPz1O5h.VX92kQ8DvzQSt.hWPfRvPRp5fG2kM7m9p8w9kQ8DvzQSt
NODE_ENV=development
```

### Default Credentials
```
Email:    owsmboy7383@gmail.com
Password: Aman@73550
```

⚠️ **⚠️ CRITICAL: Change these credentials in production!**

---

## 🚀 Starting the Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

---

## 🔑 Accessing the Admin Portal

1. Navigate to: `http://localhost:3000/admin-dashboard-access/login`
2. Enter your credentials:
   - Email: `owsmboy7383@gmail.com`
   - Password: `Aman@73550`
3. Click "Sign In"

Once authenticated, you'll be redirected to the Dashboard.

---

## 📊 Admin Dashboard Features

### 1. **Dashboard** (Overview)
- Real-time metrics (Daily Active Users, Total Executions, Error Rate)
- Server health monitoring (CPU, RAM, API Response Time)
- Top 5 most-used tools
- System performance indicators

### 2. **Tools Management**
- View all tools on the platform
- Change tool status (Active/Inactive/Maintenance)
- View tool usage statistics
- Delete tools (irreversible)
- Add new tools to the platform

### 3. **Analytics**
- Platform-wide usage metrics
- User engagement tracking
- Bounce rate and session duration
- Conversion tracking
- Top referrer sources

### 4. **Content Editor**
- Edit SEO metadata (Title, Description)
- Manage tool blog content
- Create and edit FAQ sections
- Bulk update meta tags (coming soon)
- Generate FAQs for tools (coming soon)

### 5. **Security**
- Configure rate limiting parameters
- Whitelist IPs for bypass (for testing)
- View currently rate-limited IPs
- Monitor suspicious activity

### 6. **Maintenance Mode**
- Toggle maintenance mode on/off
- Set custom maintenance message for users
- Whitelist admin IPs for access during maintenance
- Configure scheduled maintenance windows

### 7. **Logs**
- View all admin actions (audit trail)
- Filter logs by action type
- View user, timestamp, and changes
- Export audit logs as CSV

---

## 🔐 Security Features

### Authentication
- **JWT (HS256)**: Tokens expire after 24 hours
- **bcryptjs**: Password hashing with salt rounds
- **httpOnly Cookies**: Prevents XSS attacks
- **sameSite: strict**: CSRF protection
- **secure flag**: Only sent over HTTPS in production

### Session Management
- Session expiry countdown visible in sidebar
- Auto-logout on token expiration
- Clear feedback on unauthorized access
- Automatic redirect to login on session expire

### API Protection
- All admin endpoints require valid JWT token
- Rate limiting on login attempts (shared pool with main API)
- Activity logging of all admin actions

---

## 🛠️ Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `toolsfactory-admin-secret-2024` | Secret key for JWT signing |
| `ADMIN_EMAIL` | `owsmboy7383@gmail.com` | Admin email for login |
| `ADMIN_PASSWORD_HASH` | (bcrypt hash) | Hashed password |
| `NODE_ENV` | `development` | Environment mode |
| `GEMINI_API_KEY` | (empty) | Google GenAI API key |

---

## 🔑 Changing Admin Password

To change the admin password:

1. **Generate a new bcryptjs hash:**
```javascript
const bcrypt = require('bcryptjs');
const password = 'your-new-password';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

2. **Update `.env.local`:**
```env
ADMIN_PASSWORD_HASH=<paste-the-new-hash-here>
```

3. **Restart the server:**
```bash
npm run dev
```

---

## 📱 Mobile-Friendly Design

The admin portal is fully responsive:
- **Desktop**: Sidebar navigation on the left
- **Tablet**: Collapsible sidebar with hamburger menu
- **Mobile**: Full-screen hamburger menu with slide-out navigation

Touch the hamburger icon (☰) to toggle the menu on smaller screens.

---

## 🔄 API Endpoints

### Authentication
```
POST   /api/admin/auth/login     - Login with email/password
GET    /api/admin/auth/verify    - Verify session validity
POST   /api/admin/auth/logout    - Logout and clear session
```

### Admin Operations (All Protected)
```
GET    /api/admin/stats          - Get system statistics
GET    /api/admin/tools          - List all tools
GET    /api/admin/tools/:id      - Get tool details
PUT    /api/admin/tools/:id      - Update tool
DELETE /api/admin/tools/:id      - Delete tool

GET    /api/admin/security/rate-limit       - Get rate limits
PUT    /api/admin/security/rate-limit       - Update rate limits
GET    /api/admin/security/rate-limited-ips - View blocked IPs

GET    /api/admin/maintenance/status   - Get maintenance status
POST   /api/admin/maintenance/toggle   - Toggle maintenance mode

GET    /api/admin/analytics/overview   - Get analytics data

GET    /api/admin/content/:toolId      - Get tool content
PUT    /api/admin/content/:toolId      - Update tool content

GET    /api/admin/audit-logs           - View activity logs
```

---

## 🐛 Troubleshooting

### **"Invalid credentials" error**
- Check `.env.local` for correct `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`
- Verify password hash is valid bcryptjs hash
- Ensure server has restarted after `.env.local` changes

### **"Session expired" message**
- JWT tokens expire after 24 hours
- Login again to get a new token
- Check browser for httpOnly cookies

### **Cannot access admin pages**
- Ensure you're logged in (should see login page if not)
- Check browser console for errors
- Verify `/admin-dashboard-access/login` route exists

### **Rate limiting blocking requests**
- Admin auth routes bypass rate limits
- Other admin routes share rate limit with public API (10 req/min per IP)
- Whitelist your IP in Security settings for testing

---

## 📈 Best Practices

1. **Change Default Credentials**: Update email and password in production
2. **Rotate JWT Secret**: Change `JWT_SECRET` periodically
3. **Monitor Logs**: Check audit logs regularly for suspicious activity
4. **Rate Limit Tuning**: Adjust rate limits based on traffic patterns
5. **Backup**: Maintain regular backups of tool configurations
6. **HTTPS Only**: Always use HTTPS in production for secure cookies

---

## 📚 Additional Resources

- **ADMIN_PORTAL_ARCHITECTURE.md**: Technical architecture documentation
- **MASTER_SYSTEM_INSTRUCTION.md**: System guidelines and standards
- **UNIVERSAL_BLUEPRINT.md**: Design system and component standards

---

**Questions? Issues? Refer to the architecture documentation or check the audit logs for system events.**

👑 **Admin Portal is your Command Center for platform management** 🚀
