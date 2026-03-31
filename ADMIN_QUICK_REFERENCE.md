# Admin Portal Quick Reference

## 🔗 Quick Links
- **Login**: http://localhost:3000/admin-dashboard-access/login
- **Dashboard**: http://localhost:3000/admin-dashboard-access/dashboard
- **Tools**: http://localhost:3000/admin-dashboard-access/tools
- **Analytics**: http://localhost:3000/admin-dashboard-access/analytics
- **Content**: http://localhost:3000/admin-dashboard-access/content-editor
- **Security**: http://localhost:3000/admin-dashboard-access/security
- **Maintenance**: http://localhost:3000/admin-dashboard-access/maintenance
- **Logs**: http://localhost:3000/admin-dashboard-access/logs

## 🔑 Default Credentials
```
Email:    owsmboy7383@gmail.com
Password: Aman@73550
```

## 📋 Common Tasks

### Enable Maintenance Mode
1. Navigate to **Maintenance** tab
2. Toggle the switch to **ON**
3. (Optional) Add whitelisted IPs for admin access
4. (Optional) Customize the maintenance message
5. Users will see the maintenance page

### Update Tool Status
1. Go to **Tools** tab
2. Find the tool in the table
3. Click the status dropdown
4. Select: Active / Inactive / Maintenance
5. Changes apply instantly

### Edit Tool SEO
1. Go to **Content Editor** tab
2. Select a tool from dropdown
3. Update SEO Title and Description
4. Edit blog content (optional)
5. Click **Save Changes**

### Configure Rate Limiting
1. Go to **Security** tab
2. Update Max Requests and Time Window
3. Add IPs to whitelist (optional)
4. Changes apply immediately

### View System Logs
1. Go to **Logs** tab
2. Filter by action (optional)
3. Review timestamp, user, and changes
4. Click **Export CSV** to download logs

## ⏱️ Session Info
- **Duration**: 24 hours
- **Expires**: Check countdown in sidebar
- **Auto-logout**: Session expires automatically when time runs out
- **Manual logout**: Click logout button anytime

## 🛡️ Security Checklist
- [ ] Change default password
- [ ] Update JWT_SECRET in .env.local
- [ ] Use HTTPS in production
- [ ] Monitor audit logs for unauthorized attempts
- [ ] Whitelist only necessary IPs
- [ ] Rotate credentials periodically

## 📊 Key Metrics to Monitor
- **Daily Active Users**: User engagement
- **Total Executions**: Tool usage volume
- **Error Rate**: System health
- **CPU/RAM Usage**: Server performance
- **Rate Limited IPs**: Suspicious activity
- **API Response Time**: Performance metric

## 🔄 Rate Limiting Default
- **Max Requests**: 10 per minute
- **Per**: IP Address
- **Exempt**: Admin auth routes

---

**Remember**: All changes are logged in the audit trail for compliance and debugging.
