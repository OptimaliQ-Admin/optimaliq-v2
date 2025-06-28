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

interface TrialExpiredEmailProps {
  firstName: string;
  upgradeUrl: string;
  supportUrl: string;
}

export default function TrialExpiredEmail({
  firstName,
  upgradeUrl,
  supportUrl,
}: TrialExpiredEmailProps) {
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
            backgroundColor: '#6b7280',
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
              ⏰ Trial Expired
            </Text>
            <Text style={{
              color: '#d1d5db',
              fontSize: '16px',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Your OptimaliQ trial has ended
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
              Your OptimaliQ trial has expired. We've temporarily paused your account to preserve your data and insights.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 32px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Don't worry - you can easily reactivate your account and continue where you left off:
            </Text>

            {/* What you'll get back */}
            <Section style={{ margin: '0 0 32px 0' }}>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>All your assessment data</strong> - Complete history preserved
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>Dashboard insights</strong> - Your personalized metrics
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>Growth Studio simulations</strong> - All your strategic scenarios
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ✅ <strong>Market trend analysis</strong> - Your competitive insights
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button
                href={upgradeUrl}
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
                Reactivate Your Account
              </Button>
            </Section>

            <Hr style={{ 
              border: 'none',
              borderTop: '1px solid #e2e8f0',
              margin: '32px 0',
            }} />

            {/* Pricing reminder */}
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

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Questions about reactivating your account? Our support team is here to help you get back up and running quickly.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              We hope to see you back soon!<br />
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