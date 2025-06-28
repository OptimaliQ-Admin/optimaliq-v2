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

interface TrialConvertedEmailProps {
  firstName: string;
  planName: string;
  planPrice: string;
  dashboardUrl: string;
  supportUrl: string;
}

export default function TrialConvertedEmail({
  firstName,
  planName,
  planPrice,
  dashboardUrl,
  supportUrl,
}: TrialConvertedEmailProps) {
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
              🚀 Welcome to OptimaliQ!
            </Text>
            <Text style={{
              color: '#d1fae5',
              fontSize: '16px',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              You&apos;re all set with the {planName} plan
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
              Congratulations! You&apos;ve successfully upgraded to the <strong>{planName}</strong> plan. You now have full access to all OptimaliQ features and your data is safely preserved.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 32px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Here&apos;s what&apos;s next to maximize your success:
            </Text>

            {/* Next steps */}
            <Section style={{ margin: '0 0 32px 0' }}>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                🎯 <strong>Complete your business profile</strong> - Get more personalized insights
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                📊 <strong>Run your first Growth Studio simulation</strong> - Test strategic scenarios
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                📈 <strong>Set up your key metrics</strong> - Track what matters most
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                🔔 <strong>Enable notifications</strong> - Stay updated on important insights
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button
                href={dashboardUrl}
                style={{
                  backgroundColor: '#10b981',
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
                Access Your Dashboard
              </Button>
            </Section>

            <Hr style={{ 
              border: 'none',
              borderTop: '1px solid #e2e8f0',
              margin: '32px 0',
            }} />

            {/* Account info */}
            <Section style={{ 
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '20px',
              borderRadius: '8px',
              margin: '24px 0',
            }}>
              <Text style={{
                fontSize: '14px',
                color: '#166534',
                margin: '0 0 8px 0',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '600',
              }}>
                Account Details:
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#166534',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Plan:</strong> {planName}
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#166534',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Billing:</strong> {planPrice}
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#166534',
                margin: '0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Next billing:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </Text>
            </Section>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Need help getting the most out of OptimaliQ? Our success team is here to support you with onboarding, best practices, and strategic guidance.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Welcome to the OptimaliQ family!<br />
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