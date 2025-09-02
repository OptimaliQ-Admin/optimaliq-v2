import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DelegationAgent } from '@/lib/ai/agents/delegation-agent';
import { z } from 'zod';

const delegationRequestSchema = z.object({
  userId: z.string().uuid(),
  organizationId: z.string().uuid().optional(),
  workflowType: z.enum(['assessment', 'review', 'approval', 'collaboration']).optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional()
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = {
      userId: searchParams.get('userId') || user.id,
      organizationId: searchParams.get('organizationId'),
      workflowType: searchParams.get('workflowType'),
      status: searchParams.get('status')
    };

    const validatedQuery = delegationRequestSchema.parse(queryData);

    // Get user's organization
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('organization_id')
      .eq('user_id', validatedQuery.userId)
      .single();

    const organizationId = validatedQuery.organizationId || profile?.organization_id;

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Get delegation workflows
    let query = supabase
      .from('delegation_workflows')
      .select(`
        *,
        team_members!inner(organization_id)
      `)
      .eq('team_members.organization_id', organizationId);

    if (validatedQuery.workflowType) {
      query = query.eq('workflow_type', validatedQuery.workflowType);
    }

    if (validatedQuery.status) {
      query = query.eq('status', validatedQuery.status);
    }

    const { data: workflows, error: workflowsError } = await query;

    if (workflowsError) {
      console.error('Error fetching workflows:', workflowsError);
      return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
    }

    // Get workflow tasks
    let tasks = null;
    if (workflows && workflows.length > 0) {
      const workflowIds = workflows.map(w => w.id);
      const { data: taskData } = await supabase
        .from('workflow_tasks')
        .select('*')
        .in('workflow_id', workflowIds);

      tasks = taskData || [];
    }

    // Get team members for delegation
    const { data: teamMembers } = await supabase
      .from('team_members')
      .select('*')
      .eq('organization_id', organizationId);

    // Calculate workflow analytics
    const workflowAnalytics = calculateWorkflowAnalytics(workflows || [], tasks || []);

    return NextResponse.json({
      workflows: workflows || [],
      tasks: tasks || [],
      teamMembers: teamMembers || [],
      analytics: workflowAnalytics,
      summary: {
        totalWorkflows: workflows?.length || 0,
        activeWorkflows: workflows?.filter(w => w.status === 'in_progress').length || 0,
        completedWorkflows: workflows?.filter(w => w.status === 'completed').length || 0,
        totalTasks: tasks?.length || 0,
        completedTasks: tasks?.filter(t => t.status === 'completed').length || 0,
        averageCompletionTime: calculateAverageCompletionTime(workflows || [])
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Delegation workflow API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateWorkflowAnalytics(workflows: any[], tasks: any[]) {
  const analytics = {
    byType: {
      assessment: workflows.filter(w => w.workflow_type === 'assessment').length,
      review: workflows.filter(w => w.workflow_type === 'review').length,
      approval: workflows.filter(w => w.workflow_type === 'approval').length,
      collaboration: workflows.filter(w => w.workflow_type === 'collaboration').length
    },
    byStatus: {
      pending: workflows.filter(w => w.status === 'pending').length,
      inProgress: workflows.filter(w => w.status === 'in_progress').length,
      completed: workflows.filter(w => w.status === 'completed').length,
      cancelled: workflows.filter(w => w.status === 'cancelled').length
    },
    taskStats: {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => {
        if (t.status === 'completed') return false;
        const dueDate = new Date(t.due_date);
        return dueDate < new Date();
      }).length
    },
    efficiencyMetrics: {
      averageTasksPerWorkflow: workflows.length > 0 ? tasks.length / workflows.length : 0,
      completionRate: tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0,
      averageTaskDuration: calculateAverageTaskDuration(tasks)
    }
  };

  return analytics;
}

function calculateAverageCompletionTime(workflows: any[]): number {
  const completedWorkflows = workflows.filter(w => w.status === 'completed' && w.completed_at && w.created_at);
  
  if (completedWorkflows.length === 0) return 0;

  const totalTime = completedWorkflows.reduce((sum, workflow) => {
    const startTime = new Date(workflow.created_at).getTime();
    const endTime = new Date(workflow.completed_at).getTime();
    return sum + (endTime - startTime);
  }, 0);

  return totalTime / completedWorkflows.length / (1000 * 60 * 60 * 24); // Convert to days
}

function calculateAverageTaskDuration(tasks: any[]): number {
  const completedTasks = tasks.filter(t => t.status === 'completed' && t.completed_at && t.created_at);
  
  if (completedTasks.length === 0) return 0;

  const totalTime = completedTasks.reduce((sum, task) => {
    const startTime = new Date(task.created_at).getTime();
    const endTime = new Date(task.completed_at).getTime();
    return sum + (endTime - startTime);
  }, 0);

  return totalTime / completedTasks.length / (1000 * 60 * 60); // Convert to hours
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, workflowData } = body;

    switch (action) {
      case 'create_workflow':
        // Create a new delegation workflow
        const { data: newWorkflow, error: createError } = await supabase
          .from('delegation_workflows')
          .insert({
            name: workflowData.name,
            description: workflowData.description,
            workflow_type: workflowData.workflowType,
            created_by: user.id,
            organization_id: workflowData.organizationId,
            participants: workflowData.participants,
            steps: workflowData.steps,
            settings: workflowData.settings,
            status: 'pending',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating workflow:', createError);
          return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
        }

        // Generate tasks using Delegation Agent
        const delegationAgent = new DelegationAgent();
        const tasks = await delegationAgent.generateWorkflowTasks({
          workflowId: newWorkflow.id,
          workflowType: workflowData.workflowType,
          participants: workflowData.participants,
          steps: workflowData.steps,
          settings: workflowData.settings
        });

        // Insert tasks
        if (tasks && tasks.length > 0) {
          const { error: taskError } = await supabase
            .from('workflow_tasks')
            .insert(tasks);

          if (taskError) {
            console.error('Error creating tasks:', taskError);
          }
        }

        return NextResponse.json({ 
          message: 'Workflow created successfully',
          workflow: newWorkflow 
        });

      case 'start_workflow':
        // Start a workflow
        const { error: startError } = await supabase
          .from('delegation_workflows')
          .update({
            status: 'in_progress',
            started_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', workflowData.id)
          .eq('created_by', user.id);

        if (startError) {
          console.error('Error starting workflow:', startError);
          return NextResponse.json({ error: 'Failed to start workflow' }, { status: 500 });
        }

        // Update first task to in_progress
        const { error: taskUpdateError } = await supabase
          .from('workflow_tasks')
          .update({
            status: 'in_progress',
            started_at: new Date().toISOString()
          })
          .eq('workflow_id', workflowData.id)
          .eq('step_order', 1);

        if (taskUpdateError) {
          console.error('Error updating first task:', taskUpdateError);
        }

        return NextResponse.json({ message: 'Workflow started successfully' });

      case 'complete_task':
        // Complete a workflow task
        const { error: completeTaskError } = await supabase
          .from('workflow_tasks')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            result: workflowData.result
          })
          .eq('id', workflowData.taskId)
          .eq('assigned_to', user.id);

        if (completeTaskError) {
          console.error('Error completing task:', completeTaskError);
          return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 });
        }

        // Check if workflow is complete
        const { data: remainingTasks } = await supabase
          .from('workflow_tasks')
          .select('status')
          .eq('workflow_id', workflowData.workflowId)
          .neq('status', 'completed');

        if (!remainingTasks || remainingTasks.length === 0) {
          // Complete the workflow
          const { error: completeWorkflowError } = await supabase
            .from('delegation_workflows')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', workflowData.workflowId);

          if (completeWorkflowError) {
            console.error('Error completing workflow:', completeWorkflowError);
          }
        } else {
          // Start next task
          const { data: nextTask } = await supabase
            .from('workflow_tasks')
            .select('*')
            .eq('workflow_id', workflowData.workflowId)
            .eq('status', 'pending')
            .order('step_order', { ascending: true })
            .limit(1)
            .single();

          if (nextTask) {
            const { error: nextTaskError } = await supabase
              .from('workflow_tasks')
              .update({
                status: 'in_progress',
                started_at: new Date().toISOString()
              })
              .eq('id', nextTask.id);

            if (nextTaskError) {
              console.error('Error starting next task:', nextTaskError);
            }
          }
        }

        return NextResponse.json({ message: 'Task completed successfully' });

      case 'reassign_task':
        // Reassign a task to a different team member
        const { error: reassignError } = await supabase
          .from('workflow_tasks')
          .update({
            assigned_to: workflowData.newAssignee,
            reassigned_at: new Date().toISOString(),
            reassigned_by: user.id,
            reassignment_reason: workflowData.reason
          })
          .eq('id', workflowData.taskId)
          .eq('workflow_id', workflowData.workflowId);

        if (reassignError) {
          console.error('Error reassigning task:', reassignError);
          return NextResponse.json({ error: 'Failed to reassign task' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Task reassigned successfully' });

      case 'cancel_workflow':
        // Cancel a workflow
        const { error: cancelError } = await supabase
          .from('delegation_workflows')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            cancellation_reason: workflowData.reason
          })
          .eq('id', workflowData.id)
          .eq('created_by', user.id);

        if (cancelError) {
          console.error('Error cancelling workflow:', cancelError);
          return NextResponse.json({ error: 'Failed to cancel workflow' }, { status: 500 });
        }

        // Cancel all pending tasks
        const { error: cancelTasksError } = await supabase
          .from('workflow_tasks')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString()
          })
          .eq('workflow_id', workflowData.id)
          .in('status', ['pending', 'in_progress']);

        if (cancelTasksError) {
          console.error('Error cancelling tasks:', cancelTasksError);
        }

        return NextResponse.json({ message: 'Workflow cancelled successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Delegation action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

