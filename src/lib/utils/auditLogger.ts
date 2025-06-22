import { supabaseAdmin } from '@/lib/supabaseAdmin';

export interface AuditLogEntry {
  table_name: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  record_id?: string;
  old_values?: any;
  new_values?: any;
  user_id?: string;
}

/**
 * Log an audit event to the audit_log table
 * This function uses the admin client to bypass RLS and insert audit records
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('audit_log')
      .insert({
        table_name: entry.table_name,
        operation: entry.operation,
        record_id: entry.record_id,
        old_values: entry.old_values ? JSON.stringify(entry.old_values) : null,
        new_values: entry.new_values ? JSON.stringify(entry.new_values) : null,
        user_id: entry.user_id,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to log audit event:', error);
    } else {
      console.log(`✅ Audit event logged: ${entry.operation} on ${entry.table_name}`);
    }
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}

/**
 * Check if the current user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('tier2_users')
      .select('role')
      .eq('u_id', userId)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get audit logs for admin users
 */
export async function getAuditLogs(
  filters: {
    table_name?: string;
    operation?: string;
    user_id?: string;
    start_date?: string;
    end_date?: string;
  } = {},
  limit: number = 100
): Promise<any[]> {
  try {
    let query = supabaseAdmin
      .from('audit_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (filters.table_name) {
      query = query.eq('table_name', filters.table_name);
    }
    if (filters.operation) {
      query = query.eq('operation', filters.operation);
    }
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters.start_date) {
      query = query.gte('timestamp', filters.start_date);
    }
    if (filters.end_date) {
      query = query.lte('timestamp', filters.end_date);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminDashboardStats(): Promise<any> {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_dashboard')
      .select('*');

    if (error) {
      console.error('Error fetching admin dashboard stats:', error);
      return {};
    }

    return data || {};
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return {};
  }
}

/**
 * Create a higher-order function that wraps database operations with audit logging
 */
export function withAuditLogging<T extends any[], R>(
  operation: (...args: T) => Promise<R>,
  tableName: string,
  operationType: 'INSERT' | 'UPDATE' | 'DELETE'
) {
  return async (...args: T): Promise<R> => {
    try {
      // Execute the original operation
      const result = await operation(...args);
      
      // Log the audit event
      await logAuditEvent({
        table_name: tableName,
        operation: operationType,
        // You can extract record_id and values from args or result as needed
      });
      
      return result;
    } catch (error) {
      // Log failed operations too
      await logAuditEvent({
        table_name: tableName,
        operation: operationType,
        // Log error details if needed
      });
      
      throw error;
    }
  };
} 