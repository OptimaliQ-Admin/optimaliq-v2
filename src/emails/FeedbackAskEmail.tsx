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

interface FeedbackAskEmailProps {
  firstName: string;
  feedbackUrl: string;
  dashboardUrl: string;
}

export default function FeedbackAskEmail({
  firstName,
  feedbackUrl,
  dashboardUrl,
}: FeedbackAskEmailProps) {
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
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
              💬 Quick Question
            </Text>
            <Text style={{
              color: '#e9d5ff',
              fontSize: '16px',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              We'd love to hear from you
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
              I hope you're finding OptimaliQ valuable for your business growth. As we continue to build and improve our platform, I'd love to get your thoughts on your experience so far.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 32px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Your feedback helps us create better tools and insights for executives like you. It only takes 2 minutes to share your thoughts.
            </Text>

            {/* What we're asking */}
            <Section style={{ margin: '0 0 32px 0' }}>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                📊 <strong>How are you using OptimaliQ?</strong> - What features are most valuable?
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                🎯 <strong>What challenges are you facing?</strong> - How can we help you better?
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                💡 <strong>What would you like to see?</strong> - New features or improvements?
              </Text>
              <Text style={{
                fontSize: '16px',
                color: '#475569',
                margin: '0 0 12px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                ⭐ <strong>Overall experience</strong> - How would you rate OptimaliQ?
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button
                href={feedbackUrl}
                style={{
                  backgroundColor: '#8b5cf6',
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
                Share Your Feedback
              </Button>
            </Section>

            <Hr style={{ 
              border: 'none',
              borderTop: '1px solid #e2e8f0',
              margin: '32px 0',
            }} />

            {/* Incentive */}
            <Section style={{ 
              backgroundColor: '#faf5ff',
              border: '1px solid #e9d5ff',
              padding: '20px',
              borderRadius: '8px',
              margin: '24px 0',
            }}>
              <Text style={{
                fontSize: '14px',
                color: '#7c3aed',
                margin: '0 0 8px 0',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '600',
              }}>
                🎁 Thank You Gift:
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#7c3aed',
                margin: '0',
                fontFamily: 'Inter, sans-serif',
              }}>
                Complete the feedback survey and we'll extend your trial by 7 days as a thank you for your valuable input.
              </Text>
            </Section>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Your insights directly influence our product roadmap and help us serve the executive community better. Every piece of feedback matters to us.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Thank you for being part of the OptimaliQ community!<br />
              James<br />
              <em>Founder, OptimaliQ</em>
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
              <Link href="mailto:founder@optimaliq.ai" style={{ color: '#3b82f6' }}>
                founder@optimaliq.ai
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