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

interface WelcomeTrialEmailProps {
  firstName: string;
  companyName?: string;
  trialEndDate: string;
  dashboardUrl: string;
}

export default function WelcomeTrialEmail({
  firstName,
  companyName,
  trialEndDate,
  dashboardUrl,
}: WelcomeTrialEmailProps) {
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
            backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              🎉 Welcome to OptimaliQ
            </Text>
            <Text style={{
              color: '#e2e8f0',
              fontSize: '16px',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Your 30-day trial is now active
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
              Welcome to OptimaliQ! Your 30-day trial is now active and you have full access to all our AI-powered business insights and strategic tools.
            </Text>

            {companyName && (
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                lineHeight: '1.6',
                margin: '0 0 20px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                We&apos;re excited to help <strong>{companyName}</strong> unlock new growth opportunities and make data-driven decisions.
              </Text>
            )}

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 32px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Here&apos;s what you can do right now:
            </Text>

            {/* Feature highlights */}
            <Section style={{ margin: '0 0 32px 0' }}>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>Complete your initial assessment</strong> - Get personalized insights
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>Explore your dashboard</strong> - View real-time business metrics
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>Access Growth Studio</strong> - Run strategic simulations
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>Review market trends</strong> - Stay ahead of the competition
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button
                href={`${dashboardUrl.replace('/premium/dashboard', '/subscribe/trial-signup')}?email=${encodeURIComponent(firstName)}`}
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Inter, sans-serif',
                  display: 'inline-block',
                }}
              >
                Complete Your Trial Setup
              </Button>
            </Section>

            <Hr style={{ 
              border: 'none',
              borderTop: '1px solid #e2e8f0',
              margin: '32px 0',
            }} />

            {/* Trial info */}
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
                Trial Details:
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Duration:</strong> 30 days
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Ends:</strong> {trialEndDate}
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>No credit card required</strong>
              </Text>
            </Section>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Need help getting started? Our team is here to support you every step of the way.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Best regards,<br />
              The OptimaliQ Team
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
              color: '#94a3b8',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              © 2025 OptimaliQ. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
} 