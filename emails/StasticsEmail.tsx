import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
  
  interface props{
    text:string;
  }
  
  export default function StaticsEmail({text}:props) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Your Quiz Results</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Here&apos;s your stastical Analysis</Preview>
        <Section>
        <Row>
          {text.split('<br>').map((point, index) => (
            <Text key={index} style={{ marginBottom: '10px' }}>
              {point}
            </Text>
          ))}
        </Row>
          
          <Row>
            <Text>
            Keep up the great work!
            </Text>
          </Row>
          <Row>
            <Text>
              If you did not request this email, please ignore this email.
            </Text>
          </Row>
          {/* <Row>
            <Button
              href={`http://localhost:3000/verify/${username}`}
              style={{ color: '#61dafb' }}
            >
              Verify here
            </Button>
          </Row> */}
        </Section>
      </Html>
    );
  }