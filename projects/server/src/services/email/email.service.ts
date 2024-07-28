import { ConfigService } from "../config/config";
import { Injectable } from "@nestjs/common";
import Mailgun, {MailgunClientOptions} from "mailgun.js";
import formData from "form-data";
import {IMailgunClient} from "mailgun.js/Interfaces";

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
    const mailgun = new Mailgun.default(formData);
    const options: MailgunClientOptions = {
      username: "api",
      key: this.configService.config.email.mailgun.apiKey,
    }
    if (this.configService.config.email.mailgun.isEu) {
      options.url = "https://api.eu.mailgun.net";
    }
    this.mailgunClient = mailgun.client(options);

    this.senderString = `${this.configService.config.email.mailgun.sender.name} <${this.configService.config.email.mailgun.sender.address}@${this.configService.config.email.mailgun.domain}>`;
  }

  async sendEmail(data: EmailData) {
    if (this.configService.config.email.sendMode === "silent") {
      return
    }

    if (this.configService.config.email.sendMode === "log") {
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
