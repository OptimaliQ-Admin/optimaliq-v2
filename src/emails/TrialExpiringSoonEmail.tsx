import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Button,
  Section,
  Hr,
} from '@react-email/components';

interface TrialExpiringSoonEmailProps {
  firstName: string;
  daysRemaining: number;
  trialEndDate: string;
  upgradeUrl: string;
  dashboardUrl: string;
}

export default function TrialExpiringSoonEmail({
  firstName,
  daysRemaining,
  trialEndDate,
  upgradeUrl,
  dashboardUrl,
}: TrialExpiringSoonEmailProps) {
  const isUrgent = daysRemaining <= 3;
  
  return (
    <Html>
      <Head />
      <Body style={{ 
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f8fafc',
        margin: 0,
        padding: 0,
      }}>
        <Container style={{ 
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}>
          {/* Header */}
          <Section style={{ 
            backgroundColor: isUrgent ? '#dc2626' : '#f59e0b',
            padding: '40px 30px',
            textAlign: 'center',
          }}>
            <Text style={{
              color: '#ffffff',
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              ⏰ Your <span style={{ color: '#3b82f6' }}>OptimaliQ</span> trial is expiring soon
            </Text>
            <Text style={{
              color: '#fef3c7',
              fontSize: '16px',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              {daysRemaining === 1 ? 'Your trial expires tomorrow' : `${daysRemaining} days remaining`}
            </Text>
          </Section>

          {/* Content */}
          <Section style={{ padding: '40px 30px' }}>
            <Text style={{
              fontSize: '18px',
              color: '#1e293b',
              margin: '0 0 24px 0',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
            }}>
              Hi {firstName},
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              {isUrgent 
                ? `Your <span style={{ color: '#3b82f6' }}>OptimaliQ</span> trial expires ${daysRemaining === 1 ? 'tomorrow' : `in ${daysRemaining} days`}. Don't lose access to your valuable insights and data!`
                : `Your <span style={{ color: '#3b82f6' }}>OptimaliQ</span> trial will end on ${trialEndDate}. We'd love to keep helping you grow your business.`
              }
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 32px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Upgrade now to continue accessing:
            </Text>

            {/* Feature highlights */}
            <Section style={{ margin: '0 0 32px 0' }}>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>AI-powered business insights</strong> - Real-time recommendations
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>Growth Studio simulations</strong> - Strategic planning tools
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>Market trend analysis</strong> - Stay ahead of competition
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>Personalized dashboards</strong> - Your data, your insights
              </Text>
            </Section>

            {/* CTA Buttons */}
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button
                href={upgradeUrl}
                style={{
                  backgroundColor: isUrgent ? '#dc2626' : '#3b82f6',
                  color: '#ffffff',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Inter, sans-serif',
                  display: 'inline-block',
                  margin: '0 12px 12px 0',
                }}
              >
                {isUrgent ? 'Upgrade Now' : 'Upgrade to Continue'}
              </Button>
              
              <Button
                href={dashboardUrl}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Inter, sans-serif',
                  display: 'inline-block',
                  border: '1px solid #e2e8f0',
                }}
              >
                Access Dashboard
              </Button>
            </Section>

            <Hr style={{ 
              border: 'none',
              borderTop: '1px solid #e2e8f0',
              margin: '32px 0',
            }} />

            {/* Pricing info */}
            <Section style={{ 
              backgroundColor: '#f1f5f9',
              padding: '20px',
              borderRadius: '8px',
              margin: '24px 0',
            }}>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 8px 0',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '600',
              }}>
                Simple Pricing:
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Accelerator Plan:</strong> $97/month - Perfect for growing businesses
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Strategic Plan:</strong> $197/month - Advanced features for scale
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Cancel anytime</strong> - No long-term commitments
              </Text>
            </Section>

            {isUrgent && (
              <Section style={{ 
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '16px',
                borderRadius: '8px',
                margin: '24px 0',
              }}>
                <Text style={{
                  fontSize: '14px',
                  color: '#dc2626',
                  margin: '0',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '600',
                }}>
                  ⚠️ After your trial expires, you&apos;ll lose access to all your data and insights. Upgrade now to preserve your progress.
                </Text>
              </Section>
            )}

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Questions about upgrading? Our team is here to help you choose the right plan for your business.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Best regards,<br />
              The <span style={{ color: '#3b82f6' }}>OptimaliQ</span> Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ 
            backgroundColor: '#f8fafc',
            padding: '24px 30px',
            textAlign: 'center',
          }}>
            <Text style={{
              fontSize: '14px',
              color: '#64748b',
              margin: '0 0 16px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Questions? Contact us at{' '}
              <Link href="mailto:support@optimaliq.ai" style={{ color: '#3b82f6' }}>
                support@optimaliq.ai
              </Link>
            </Text>
            
            <Text style={{
              fontSize: '12px',
              color: '#64748b',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              © 2025 <span style={{ color: '#3b82f6' }}>OptimaliQ</span>. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
} 