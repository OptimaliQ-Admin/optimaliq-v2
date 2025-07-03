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

interface QuestionDelegationEmailProps {
  delegatorName: string;
  assessmentTitle: string;
  questionCount: number;
  delegationUrl: string;
  expiresAt: string;
  customMessage?: string;
}

export default function QuestionDelegationEmail({
  delegatorName,
  assessmentTitle,
  questionCount,
  delegationUrl,
  expiresAt,
  customMessage,
}: QuestionDelegationEmailProps) {
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              🎯 Question Delegation Request
            </Text>
            <Text style={{
              color: '#ffffff',
              fontSize: '16px',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
              opacity: 0.9,
            }}>
              Your input is needed for {assessmentTitle}
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
              Hi there,
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              <strong>{delegatorName}</strong> has asked for your input on specific questions to help complete their {assessmentTitle}.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Your insights will help improve our business processes and strategic decision-making.
            </Text>

            {customMessage && (
              <Section style={{ 
                backgroundColor: '#f1f5f9',
                padding: '20px',
                borderRadius: '8px',
                margin: '24px 0',
              }}>
                <Text style={{
                  fontSize: '16px',
                  color: '#475569',
                  lineHeight: '1.6',
                  margin: '0',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}>
                  &quot;{customMessage}&quot;
                </Text>
              </Section>
            )}

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 32px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              This will only take <strong>5-7 minutes</strong> to complete and your responses will be anonymous and combined with other team input.
            </Text>

            {/* Question Details */}
            <Section style={{ 
              backgroundColor: '#f8fafc',
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
                Request Details:
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Assessment:</strong> {assessmentTitle}
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Questions:</strong> {questionCount} specific questions
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Duration:</strong> 5-7 minutes
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Expires:</strong> {expiresAt}
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Privacy:</strong> Anonymous responses, combined with team data
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button
                href={delegationUrl}
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
                Complete Questions
              </Button>
            </Section>

            <Hr style={{ 
              border: 'none',
              borderTop: '1px solid #e2e8f0',
              margin: '32px 0',
            }} />

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              This request expires on <strong>{expiresAt}</strong>. If you have any questions, please contact {delegatorName} directly.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Thank you for your input!<br />
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