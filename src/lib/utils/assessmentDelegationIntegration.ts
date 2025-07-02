import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface DelegatedAssessmentResult {
  inviter_u_id: string;
  assessment_type: string;
  answers: Record<string, unknown>;
  score: number | null;
  completed_at: string;
  invitee_name: string;
  invitee_email: string;
}

export interface DelegatedQuestionResult {
  delegator_u_id: string;
  assessment_type: string;
  question_keys: string[];
  answers: Record<string, unknown>;
  completed_at: string;
  delegate_name: string;
  delegate_email: string;
}

/**
 * Integrate completed assessment invitations into the main scoring system
 */
export async function integrateAssessmentInvitations(userId: string): Promise<void> {
  try {
    // Get all completed assessment invitations for this user
    const { data: invitations, error } = await supabase
      .from('assessment_invitations')
      .select('*')
      .eq('inviter_u_id', userId)
      .eq('status', 'completed')
      .not('score', 'is', null);

    if (error) {
      console.error('Error fetching assessment invitations:', error);
      return;
    }

    if (!invitations || invitations.length === 0) {
      return;
    }

    // Group invitations by assessment type
    const invitationsByType = invitations.reduce((acc: Record<string, DelegatedAssessmentResult[]>, invitation) => {
      if (!acc[invitation.assessment_type]) {
        acc[invitation.assessment_type] = [];
      }
      acc[invitation.assessment_type].push(invitation);
      return acc;
    }, {} as Record<string, DelegatedAssessmentResult[]>);

    // Process each assessment type
    for (const [assessmentType, typeInvitations] of Object.entries(invitationsByType)) {
      await processAssessmentTypeResults(userId, assessmentType, typeInvitations);
    }

  } catch (error) {
    console.error('Error integrating assessment invitations:', error);
  }
}

/**
 * Integrate completed question delegations into the main scoring system
 */
export async function integrateQuestionDelegations(userId: string): Promise<void> {
  try {
    // Get all completed question delegations for this user
    const { data: delegations, error } = await supabase
      .from('question_delegations')
      .select('*')
      .eq('delegator_u_id', userId)
      .eq('status', 'completed');

    if (error) {
      console.error('Error fetching question delegations:', error);
      return;
    }

    if (!delegations || delegations.length === 0) {
      return;
    }

    // Group delegations by assessment type
    const delegationsByType = delegations.reduce((acc: Record<string, DelegatedQuestionResult[]>, delegation) => {
      if (!acc[delegation.assessment_type]) {
        acc[delegation.assessment_type] = [];
      }
      acc[delegation.assessment_type].push(delegation);
      return acc;
    }, {} as Record<string, DelegatedQuestionResult[]>);

    // Process each assessment type
    for (const [assessmentType, typeDelegations] of Object.entries(delegationsByType)) {
      await processQuestionDelegationResults(userId, assessmentType, typeDelegations);
    }

  } catch (error) {
    console.error('Error integrating question delegations:', error);
  }
}

/**
 * Process assessment type results and update the main assessment data
 */
async function processAssessmentTypeResults(
  userId: string, 
  assessmentType: string, 
  invitations: DelegatedAssessmentResult[]
): Promise<void> {
  try {
    // Get existing assessment data for this user and type
    const { data: existingAssessment } = await supabase
      .from('tier2_profiles')
      .select(`${assessmentType}_assessment_data`)
      .eq('u_id', userId)
      .single();

    let existingData = ((existingAssessment as unknown as Record<string, unknown>)?.[`${assessmentType}_assessment_data`] as Record<string, unknown>) || {};

    // Merge all invitation answers
    for (const invitation of invitations) {
      if (invitation.answers) {
        existingData = {
          ...existingData,
          ...invitation.answers,
          // Add metadata about who answered what
          [`${invitation.invitee_email}_answered_at`]: invitation.completed_at,
          [`${invitation.invitee_email}_score`]: invitation.score
        };
      }
    }

    // Update the assessment data
    const { error } = await supabase
      .from('tier2_profiles')
      .update({
        [`${assessmentType}_assessment_data`]: existingData,
        [`${assessmentType}_last_updated`]: new Date().toISOString()
      })
      .eq('u_id', userId);

    if (error) {
      console.error(`Error updating ${assessmentType} assessment data:`, error);
    }

  } catch (error) {
    console.error(`Error processing ${assessmentType} results:`, error);
  }
}

/**
 * Process question delegation results and update the main assessment data
 */
async function processQuestionDelegationResults(
  userId: string, 
  assessmentType: string, 
  delegations: DelegatedQuestionResult[]
): Promise<void> {
  try {
    // Get existing assessment data for this user and type
    const { data: existingAssessment } = await supabase
      .from('tier2_profiles')
      .select(`${assessmentType}_assessment_data`)
      .eq('u_id', userId)
      .single();

    let existingData = ((existingAssessment as unknown as Record<string, unknown>)?.[`${assessmentType}_assessment_data`] as Record<string, unknown>) || {};

    // Merge all delegation answers
    for (const delegation of delegations) {
      if (delegation.answers) {
        // Add each delegated question answer
        for (const [questionKey, answer] of Object.entries(delegation.answers)) {
          existingData[questionKey] = answer;
          existingData[`${questionKey}_delegated_to`] = delegation.delegate_email;
          existingData[`${questionKey}_delegated_at`] = delegation.completed_at;
        }
      }
    }

    // Update the assessment data
    const { error } = await supabase
      .from('tier2_profiles')
      .update({
        [`${assessmentType}_assessment_data`]: existingData,
        [`${assessmentType}_last_updated`]: new Date().toISOString()
      })
      .eq('u_id', userId);

    if (error) {
      console.error(`Error updating ${assessmentType} delegation data:`, error);
    }

  } catch (error) {
    console.error(`Error processing ${assessmentType} delegation results:`, error);
  }
}

/**
 * Calculate aggregated score from multiple assessment responses
 */
export function calculateAggregatedScore(assessmentData: Record<string, any>): number {
  try {
    // Extract all scores from the assessment data
    const scores: number[] = [];
    
    for (const [key, value] of Object.entries(assessmentData)) {
      if (key.endsWith('_score') && typeof value === 'number') {
        scores.push(value);
      }
    }

    if (scores.length === 0) {
      return 0;
    }

    // Calculate weighted average (you can adjust weights based on importance)
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore / scores.length);

  } catch (error) {
    console.error('Error calculating aggregated score:', error);
    return 0;
  }
}

/**
 * Get delegation statistics for a user
 */
export async function getDelegationStats(userId: string): Promise<{
  totalInvitations: number;
  completedInvitations: number;
  totalDelegations: number;
  completedDelegations: number;
  pendingInvitations: number;
  pendingDelegations: number;
}> {
  try {
    // Get invitation stats
    const { data: invitations } = await supabase
      .from('assessment_invitations')
      .select('status')
      .eq('inviter_u_id', userId);

    // Get delegation stats
    const { data: delegations } = await supabase
      .from('question_delegations')
      .select('status')
      .eq('delegator_u_id', userId);

    const invitationStats = invitations?.reduce((acc, inv) => {
      if (inv.status === 'completed') acc.completed++;
      else if (inv.status === 'pending') acc.pending++;
      acc.total++;
      return acc;
    }, { total: 0, completed: 0, pending: 0 }) || { total: 0, completed: 0, pending: 0 };

    const delegationStats = delegations?.reduce((acc, del) => {
      if (del.status === 'completed') acc.completed++;
      else if (del.status === 'pending') acc.pending++;
      acc.total++;
      return acc;
    }, { total: 0, completed: 0, pending: 0 }) || { total: 0, completed: 0, pending: 0 };

    return {
      totalInvitations: invitationStats.total,
      completedInvitations: invitationStats.completed,
      pendingInvitations: invitationStats.pending,
      totalDelegations: delegationStats.total,
      completedDelegations: delegationStats.completed,
      pendingDelegations: delegationStats.pending
    };

  } catch (error) {
    console.error('Error getting delegation stats:', error);
    return {
      totalInvitations: 0,
      completedInvitations: 0,
      totalDelegations: 0,
      completedDelegations: 0,
      pendingInvitations: 0,
      pendingDelegations: 0
    };
  }
} 