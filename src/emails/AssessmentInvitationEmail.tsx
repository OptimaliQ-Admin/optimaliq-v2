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

interface AssessmentInvitationEmailProps {
  inviterName: string;
  inviterCompany: string;
  assessmentTitle: string;
  assessmentDescription: string;
  invitationUrl: string;
  expiresAt: string;
  customMessage?: string;
}

export default function AssessmentInvitationEmail({
  inviterName,
  inviterCompany,
  assessmentTitle,
  assessmentDescription,
  invitationUrl,
  expiresAt,
  customMessage,
}: AssessmentInvitationEmailProps) {
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
              📊 Business Assessment Invitation
            </Text>
            <Text style={{
              color: '#ffffff',
              fontSize: '16px',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
              opacity: 0.9,
            }}>
              Help improve your organization&apos;s performance
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
              <strong>{inviterName}</strong> from <strong>{inviterCompany}</strong> has invited you to complete a business assessment to help improve their organization&apos;s performance.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              <strong>Assessment:</strong> {assessmentTitle}
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0 0 20px 0',
              fontFamily: 'Inter, sans-serif',
            }}>
              {assessmentDescription}
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
              This assessment will take approximately <strong>10-15 minutes</strong> to complete and your responses will help provide valuable insights for strategic decision-making.
            </Text>

            {/* Assessment Details */}
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
                Assessment Details:
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Type:</strong> {assessmentTitle}
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '0 0 4px 0',
                fontFamily: 'Inter, sans-serif',
              }}>
                • <strong>Duration:</strong> 10-15 minutes
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
                • <strong>Privacy:</strong> Your responses are anonymous and secure
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={{ textAlign: 'center', margin: '32px 0' }}>
              <Button
                href={invitationUrl}
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
                Start Assessment
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
              This invitation expires on <strong>{expiresAt}</strong>. If you have any questions about this assessment, please contact {inviterName} directly.
            </Text>

            <Text style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.6',
              margin: '0',
              fontFamily: 'Inter, sans-serif',
            }}>
              Thank you for your participation!<br />
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