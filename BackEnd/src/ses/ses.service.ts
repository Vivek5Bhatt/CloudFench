import { Injectable } from '@nestjs/common';

import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SESService {
  constructor(private config: ConfigService) {}
  async sendEmail(data: { subject: string; body: string }) {
    const client = new SESClient({
      region: this.config.get('SES_REGION'),
    });

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [this.config.get('SES_IDENTITY_DESTINATION')],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: data.body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: data.subject,
        },
      },
      Source: this.config.get('SES_IDENTITY_SOURCE'),
      ReplyToAddresses: [],
    });

    try {
      await client.send(command);
    } catch (error) {
      throw error;
    }
  }
}
