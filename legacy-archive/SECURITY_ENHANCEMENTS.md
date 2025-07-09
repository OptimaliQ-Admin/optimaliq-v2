# Security Enhancements Documentation

## Overview

This document outlines the comprehensive security enhancements implemented for the OptimaliQ application, including Row Level Security (RLS), admin policies, audit logging, and public data access.

## 🔒 Row Level Security (RLS) Implementation

### What is RLS?
Row Level Security is a PostgreSQL feature that restricts which rows users can access in database tables. It ensures users can only see and modify their own data.

### Security Levels

#### 🔐 **Protected Tables (RLS Enabled)**
These tables contain user-specific data and have RLS enabled with appropriate policies.

#### 🌐 **Public Tables (RLS Disabled)**
These tables contain anonymized, aggregated, or reference data that should be accessible to all users.

### Tables with RLS Enabled (Protected)

#### User & Identity Tables
- `tier2_users` - User profiles and authentication data
- `growth_users` - Growth assessment user data
- `subscriptions` - User subscription and billing data
- `notifications` - User-specific notifications
- `notification_preferences` - User notification settings

#### Assessment Tables
- `growth_assessment` - Growth assessment responses
- `ai_readiness_assessment` - AI readiness assessment data
- `bpm_assessment` - Business process management assessment
- `competitive_benchmarking_assessment` - Competitive analysis data
- `customer_experience_assessment` - Customer experience data
- `digital_transformation_assessment` - Digital transformation data
- `leadership_assessment` - Leadership assessment data
- `marketing_effectiveness_assessment` - Marketing effectiveness data
- `sales_performance_assessment` - Sales performance data
- `strategic_maturity_assessment` - Strategic maturity data
- `tech_stack_assessment` - Technology stack assessment
- `reassessment_assessment` - Reassessment data
- `onboarding_assessments` - Onboarding assessment data

#### Score Tables
- `score_ai_readiness` - AI readiness scores
- `score_bpm` - BPM scores
- `score_competitive_benchmarking` - Competitive benchmarking scores
- `score_customer_experience` - Customer experience scores
- `score_digital_transformation` - Digital transformation scores
- `score_leadership` - Leadership scores
- `score_marketing_effectiveness` - Marketing effectiveness scores
- `score_sales_performance` - Sales performance scores
- `score_strategic_maturity` - Strategic maturity scores
- `score_tech_stack` - Tech stack scores
- `score_reassessment` - Reassessment scores

#### Dashboard & Insights Tables
- `tier2_dashboard_insights` - Dashboard insights data
- `tier2_profiles` - User profile data
- `tier2_simulation_history` - Simulation history
- `growth_insights` - Growth insights data
- `growth_levers` - Growth lever data
- `growth_lever_progress` - Lever progress tracking
- `user_tech_stack` - User technology stack data

#### System Tables
- `ai_log` - AI API usage logs
- `useractivity` - User activity tracking

### Tables with RLS Disabled (Public Access)

#### Market & Trend Data
- `realtime_market_trends` - Anonymized market trend data
- `realtime_business_trends` - Anonymized business trend data
- `realtime_marketing_playbook` - Anonymized marketing insights
- `realtime_strategic_trends` - Anonymized strategic trend data

#### Reference & Content Data
- `industry_stock_symbols` - Public industry reference data
- `scorecard_insights` - Anonymized scorecard insights
- `inspirational_quotes` - Public inspirational content (if exists)

### RLS Policies

#### Protected Tables
Each protected table has two types of policies:

1. **User-Specific Policies**: Users can only access their own data
   ```sql
   CREATE POLICY "Users can access their own data" ON table_name
       FOR ALL USING (auth.uid()::uuid = u_id::uuid);
   ```

2. **Admin Override Policies**: Admins can access all data
   ```sql
   CREATE POLICY "Admins can access all data" ON table_name
       FOR ALL USING (
           EXISTS (
               SELECT 1 FROM tier2_users 
               WHERE u_id = auth.uid() 
               AND role = 'admin'
           )
       );
   ```

#### Public Tables
Public tables have RLS disabled and are accessible to all users (authenticated and anonymous).

## 👑 Admin System

### Admin Roles
- **user**: Regular user (default)
- **admin**: Full system access
- **support**: Limited admin access (future use)

### Admin Features
1. **Access to All Data**: Admins can view and modify any user's data
2. **Audit Log Access**: Only admins can view audit logs
3. **System Statistics**: Dashboard with system overview
4. **Admin Dashboard**: Available at `/admin`
5. **Security Status Monitoring**: Check RLS status of any table

### Making a User an Admin
```sql
UPDATE tier2_users 
SET role = 'admin' 
WHERE u_id = 'user-uuid-here';
```

### Check Table Security Status
```sql
-- Check security status of any table
SELECT * FROM get_table_security_status('table_name');

-- View all public tables
SELECT * FROM public_tables_overview;
```

## 📊 Audit Logging System

### Audit Log Table Structure
```sql
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')),
    user_id UUID,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    session_id UUID
);
```

### What Gets Logged
- **All CRUD operations** on sensitive tables
- **User identification** (who performed the action)
- **Record identification** (which record was affected)
- **Before/after values** for updates
- **IP address** and user agent for security tracking
- **Timestamp** for chronological tracking

### Automatic Triggers
Triggers automatically log all operations on sensitive tables:
- `tier2_users` - User profile changes
- (Additional triggers can be added for other tables)

### Manual Audit Logging
Use the `logAuditEvent` function in your code:
```typescript
import { logAuditEvent } from '@/lib/utils/auditLogger';

await logAuditEvent({
  table_name: 'tier2_users',
  operation: 'UPDATE',
  record_id: user.u_id,
  old_values: oldData,
  new_values: newData,
  user_id: currentUser.u_id
});
```

## 🔧 Service Role Configuration

### Supabase Client Setup
The application uses two Supabase clients:

1. **Regular Client** (`src/lib/supabase.ts`): Uses anon key, respects RLS
2. **Admin Client** (`src/lib/supabaseAdmin.ts`): Uses service role key, bypasses RLS

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### When to Use Each Client
- **Regular Client**: User-facing operations, client-side code
- **Admin Client**: Server-side operations, admin functions, audit logging

## 🛡️ Security Best Practices

### 1. RLS Strategy
- **Enable RLS** on all user-specific tables
- **Disable RLS** on public, anonymized data tables
- **Use service role** only when absolutely necessary
- **Test RLS policies** thoroughly

### 2. Public Data Guidelines
- **Anonymize data** before making tables public
- **Aggregate sensitive information** to prevent individual identification
- **Document public tables** with clear comments
- **Monitor public table access** for unusual patterns

### 3. Admin Access Control
- **Limit admin role assignments**
- **Regularly review admin access**
- **Use audit logs to monitor admin actions**

### 4. Audit Logging
- **Log all sensitive operations**
- **Monitor audit logs regularly**
- **Set up alerts for suspicious activity**

### 5. Environment Security
- **Keep service role key secure**
- **Never expose service role key in client-side code**
- **Use environment variables for all secrets**

## 🧪 Testing Security

### Test RLS Policies
```sql
-- Test as regular user (should only see own data)
SELECT * FROM tier2_users WHERE u_id = auth.uid();

-- Test as admin (should see all data)
-- (Requires admin role)
SELECT * FROM tier2_users;

-- Test public table access (should work for all users)
SELECT * FROM realtime_market_trends LIMIT 5;
```

### Test Public Access
```sql
-- Check which tables are public
SELECT * FROM public_tables_overview;

-- Check security status of specific table
SELECT * FROM get_table_security_status('realtime_market_trends');
```

### Test Audit Logging
```sql
-- Check audit logs
SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 10;

-- Check admin dashboard stats
SELECT * FROM admin_dashboard;
```

## 📈 Performance Considerations

### Public Tables
- **Optimized indexes** on frequently queried columns
- **Timestamp-based queries** for trend data
- **Category-based filtering** for insights

### Protected Tables
- **User-specific queries** are automatically optimized by RLS
- **Admin queries** may require additional indexing
- **Audit log queries** should be paginated for large datasets

## 📈 Monitoring & Maintenance

### Regular Tasks
1. **Review Audit Logs**: Check for suspicious activity
2. **Monitor Admin Actions**: Ensure admins aren't abusing privileges
3. **Update RLS Policies**: As new tables are added
4. **Backup Audit Logs**: Regular backups for compliance
5. **Review Public Tables**: Ensure data remains properly anonymized

### Performance Considerations
- **Audit logs can grow large** over time
- **Consider archiving old audit logs**
- **Monitor query performance** with RLS enabled
- **Optimize public table queries** for frequent access

## 🚨 Incident Response

### Security Breach Response
1. **Immediate Actions**:
   - Review audit logs for the affected time period
   - Identify compromised accounts
   - Temporarily disable affected accounts

2. **Investigation**:
   - Use audit logs to trace the breach
   - Identify the source of the compromise
   - Document all findings

3. **Recovery**:
   - Restore from backups if necessary
   - Update security measures
   - Notify affected users

## 📋 Compliance

### GDPR Compliance
- **RLS ensures data minimization**
- **Audit logs provide data processing records**
- **User consent can be tracked**
- **Public data is properly anonymized**

### SOC 2 Compliance
- **Access controls are documented**
- **Audit trails are maintained**
- **Security policies are enforced**
- **Public data access is controlled**

## 🔄 Migration History

### Migration Files
- `20240321000006_enhance_security_rls.sql` - Initial security setup
- `20240321000007_disable_rls_public_tables.sql` - Public table configuration
- Additional migrations for new tables

### Applying Migrations
```bash
# Apply security migrations to your database
psql -h your_host -U your_user -d your_database -f supabase/migrations/20240321000006_enhance_security_rls.sql
psql -h your_host -U your_user -d your_database -f supabase/migrations/20240321000007_disable_rls_public_tables.sql
```

## 📞 Support

For security-related issues:
1. **Check audit logs first**
2. **Review RLS policies**
3. **Verify public table access**
4. **Contact the development team**
5. **Document all security incidents**

---

**Last Updated**: March 21, 2024
**Version**: 1.1
**Author**: OptimaliQ Development Team 