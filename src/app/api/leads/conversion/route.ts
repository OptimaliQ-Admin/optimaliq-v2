import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const conversionRequestSchema = z.object({
  leadId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  eventType: z.enum(['page_view', 'form_submit', 'email_open', 'email_click', 'demo_request', 'trial_signup', 'purchase']).optional(),
  includeAnalytics: z.boolean().default(true)
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
      leadId: searchParams.get('leadId'),
      userId: searchParams.get('userId') || user.id,
      eventType: searchParams.get('eventType'),
      includeAnalytics: searchParams.get('includeAnalytics') === 'true'
    };

    const validatedQuery = conversionRequestSchema.parse(queryData);

    // Get lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', validatedQuery.leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Get conversion events
    let query = supabase
      .from('conversion_events')
      .select('*')
      .eq('lead_id', validatedQuery.leadId)
      .order('created_at', { ascending: false });

    if (validatedQuery.eventType) {
      query = query.eq('event_type', validatedQuery.eventType);
    }

    const { data: events, error: eventsError } = await query;

    if (eventsError) {
      console.error('Error fetching conversion events:', eventsError);
      return NextResponse.json({ error: 'Failed to fetch conversion events' }, { status: 500 });
    }

    // Calculate conversion analytics
    const analytics = validatedQuery.includeAnalytics 
      ? calculateConversionAnalytics(events || [], lead)
      : null;

    // Get conversion funnel data
    const funnelData = await getConversionFunnel(validatedQuery.leadId, supabase);

    // Get attribution data
    const attributionData = await getAttributionData(validatedQuery.leadId, supabase);

    return NextResponse.json({
      leadId: validatedQuery.leadId,
      lead: {
        id: lead.id,
        email: lead.email,
        name: lead.name,
        company: lead.company,
        status: lead.status,
        score: lead.score,
        qualificationStatus: lead.qualification_status,
        createdAt: lead.created_at,
        lastActivity: lead.last_activity
      },
      events: events || [],
      analytics,
      funnel: funnelData,
      attribution: attributionData,
      summary: {
        totalEvents: events?.length || 0,
        conversionRate: calculateConversionRate(events || []),
        averageTimeToConversion: calculateAverageTimeToConversion(events || []),
        lastEvent: events?.[0]?.created_at,
        eventTypes: events?.reduce((acc, event) => {
          acc[event.event_type] = (acc[event.event_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Conversion tracking API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateConversionAnalytics(events: any[], lead: any) {
  const analytics = {
    eventCounts: events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    
    timeSeries: events.map(event => ({
      date: event.created_at,
      eventType: event.event_type,
      value: 1
    })),
    
    conversionPath: events.map(event => ({
      step: event.event_type,
      timestamp: event.created_at,
      metadata: event.metadata
    })),
    
    engagementScore: calculateEngagementScore(events),
    
    conversionProbability: calculateConversionProbability(events, lead)
  };

  return analytics;
}

function calculateEngagementScore(events: any[]): number {
  const eventWeights = {
    page_view: 1,
    form_submit: 5,
    email_open: 2,
    email_click: 3,
    demo_request: 10,
    trial_signup: 15,
    purchase: 25
  };

  const totalScore = events.reduce((score, event) => {
    return score + (eventWeights[event.event_type as keyof typeof eventWeights] || 0);
  }, 0);

  return Math.min(100, totalScore);
}

function calculateConversionProbability(events: any[], lead: any): number {
  let probability = 0;

  // Base probability from lead score
  probability += (lead.score || 0) * 0.3;

  // Event-based probability
  const eventTypes = events.map(e => e.event_type);
  
  if (eventTypes.includes('purchase')) probability += 100;
  else if (eventTypes.includes('trial_signup')) probability += 80;
  else if (eventTypes.includes('demo_request')) probability += 60;
  else if (eventTypes.includes('email_click')) probability += 20;
  else if (eventTypes.includes('email_open')) probability += 10;
  else if (eventTypes.includes('form_submit')) probability += 30;
  else if (eventTypes.includes('page_view')) probability += 5;

  // Recency bonus
  const lastEvent = events[0];
  if (lastEvent) {
    const daysSinceLastEvent = (Date.now() - new Date(lastEvent.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastEvent <= 1) probability += 10;
    else if (daysSinceLastEvent <= 7) probability += 5;
  }

  return Math.min(100, Math.max(0, probability));
}

async function getConversionFunnel(leadId: string, supabase: any) {
  const { data: funnelEvents } = await supabase
    .from('conversion_events')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true });

  if (!funnelEvents || funnelEvents.length === 0) {
    return null;
  }

  const funnel = {
    awareness: funnelEvents.filter(e => e.event_type === 'page_view').length,
    interest: funnelEvents.filter(e => e.event_type === 'form_submit').length,
    consideration: funnelEvents.filter(e => e.event_type === 'email_open' || e.event_type === 'email_click').length,
    intent: funnelEvents.filter(e => e.event_type === 'demo_request').length,
    decision: funnelEvents.filter(e => e.event_type === 'trial_signup').length,
    purchase: funnelEvents.filter(e => e.event_type === 'purchase').length
  };

  return funnel;
}

async function getAttributionData(leadId: string, supabase: any) {
  const { data: attributionEvents } = await supabase
    .from('conversion_events')
    .select('*')
    .eq('lead_id', leadId)
    .not('attribution_source', 'is', null);

  if (!attributionEvents || attributionEvents.length === 0) {
    return null;
  }

  const attribution = {
    sources: attributionEvents.reduce((acc, event) => {
      const source = event.attribution_source;
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    
    channels: attributionEvents.reduce((acc, event) => {
      const channel = event.attribution_channel;
      acc[channel] = (acc[channel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    
    campaigns: attributionEvents.reduce((acc, event) => {
      const campaign = event.attribution_campaign;
      if (campaign) {
        acc[campaign] = (acc[campaign] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  };

  return attribution;
}

function calculateConversionRate(events: any[]): number {
  const totalEvents = events.length;
  const conversionEvents = events.filter(e => 
    e.event_type === 'trial_signup' || e.event_type === 'purchase'
  ).length;

  return totalEvents > 0 ? (conversionEvents / totalEvents) * 100 : 0;
}

function calculateAverageTimeToConversion(events: any[]): number {
  const conversionEvents = events.filter(e => 
    e.event_type === 'trial_signup' || e.event_type === 'purchase'
  );

  if (conversionEvents.length === 0) return 0;

  const firstEvent = events[events.length - 1];
  const lastConversionEvent = conversionEvents[0];

  const timeToConversion = new Date(lastConversionEvent.created_at).getTime() - new Date(firstEvent.created_at).getTime();
  return timeToConversion / (1000 * 60 * 60 * 24); // Convert to days
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
    const { action, leadId, eventData } = body;

    switch (action) {
      case 'track_event':
        // Track a conversion event
        const { data: newEvent, error: eventError } = await supabase
          .from('conversion_events')
          .insert({
            lead_id: leadId,
            event_type: eventData.eventType,
            event_data: eventData.eventData,
            attribution_source: eventData.attributionSource,
            attribution_channel: eventData.attributionChannel,
            attribution_campaign: eventData.attributionCampaign,
            metadata: eventData.metadata,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (eventError) {
          console.error('Error tracking conversion event:', eventError);
          return NextResponse.json({ error: 'Failed to track conversion event' }, { status: 500 });
        }

        // Update lead's last activity
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            last_activity: new Date().toISOString(),
            website_visits: eventData.eventType === 'page_view' ? 
              (eventData.lead?.website_visits || 0) + 1 : eventData.lead?.website_visits,
            email_opens: eventData.eventType === 'email_open' ? 
              (eventData.lead?.email_opens || 0) + 1 : eventData.lead?.email_opens,
            email_clicks: eventData.eventType === 'email_click' ? 
              (eventData.lead?.email_clicks || 0) + 1 : eventData.lead?.email_clicks
          })
          .eq('id', leadId);

        if (updateError) {
          console.error('Error updating lead activity:', updateError);
        }

        return NextResponse.json({ 
          message: 'Conversion event tracked successfully',
          event: newEvent 
        });

      case 'update_attribution':
        // Update attribution data for existing events
        const { error: attributionError } = await supabase
          .from('conversion_events')
          .update({
            attribution_source: eventData.attributionSource,
            attribution_channel: eventData.attributionChannel,
            attribution_campaign: eventData.attributionCampaign,
            updated_at: new Date().toISOString()
          })
          .eq('lead_id', leadId)
          .is('attribution_source', null);

        if (attributionError) {
          console.error('Error updating attribution:', attributionError);
          return NextResponse.json({ error: 'Failed to update attribution' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Attribution updated successfully' });

      case 'mark_converted':
        // Mark lead as converted
        const { error: convertError } = await supabase
          .from('leads')
          .update({
            status: 'converted',
            converted_at: new Date().toISOString(),
            conversion_value: eventData.conversionValue,
            conversion_source: eventData.conversionSource
          })
          .eq('id', leadId);

        if (convertError) {
          console.error('Error marking lead as converted:', convertError);
          return NextResponse.json({ error: 'Failed to mark lead as converted' }, { status: 500 });
        }

        // Create conversion event
        const { error: conversionEventError } = await supabase
          .from('conversion_events')
          .insert({
            lead_id: leadId,
            event_type: 'purchase',
            event_data: {
              conversionValue: eventData.conversionValue,
              conversionSource: eventData.conversionSource
            },
            created_at: new Date().toISOString()
          });

        if (conversionEventError) {
          console.error('Error creating conversion event:', conversionEventError);
        }

        return NextResponse.json({ message: 'Lead marked as converted successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Conversion action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

