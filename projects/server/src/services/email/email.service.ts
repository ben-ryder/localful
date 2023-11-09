import { ConfigService } from "../config/config";
import { Injectable } from "@nestjs/common";
import Mailgun from "mailgun.js";
import {IMailgunClient} from "mailgun.js/interfaces/IMailgunClient";
import Options from "mailgun.js/interfaces/Options";
import formData from "form-data";

export interface EmailData {
  to: string,
  subject: string,
  message: string
}

@Injectable()
export class EmailService {
  private readonly mailgunClient: IMailgunClient;
  private readonly senderString: string;

  constructor(private configService: ConfigService) {
    const mailgun = new Mailgun(formData);
    const options: Options = {
      username: "api",
      key: this.configService.config.email.mailgun.apiKey,
    }
    if (this.configService.config.email.mailgun.isEu) {
      options.url = "https://api.eu.mailgun.net";
    }
    this.mailgunClient = mailgun.client(options);

    this.senderString = `${this.configService.config.email.mailgun.sender.name} <${this.configService.config.email.mailgun.sender.address}@${process.env.MAILGUN_DOMAIN}>`;
  }

  private async sendEmail(data: EmailData) {
    if (this.configService.config.email.testMode) {
      console.log(`[EMAIL]: ${data.to}`);
      console.table(data);
      return;
    }

    return this.mailgunClient.messages.create(
      this.configService.config.email.mailgun.domain,
      {
        from: this.senderString,
        to: [data.to],
        subject: data.subject,
        text: data.message
      }
    )
  }
}
