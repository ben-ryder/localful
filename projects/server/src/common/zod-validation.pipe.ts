import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { Schema } from "zod";
import {UserRequestError} from "../services/errors/base/user-request.error.js";


@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(data: any, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(data);

    if (result.success) {
      return data;
    }
    else {
      const formattedError = result.error.format();

      throw new UserRequestError({
        message: "Request data failed validation",
        applicationMessage: formattedError._errors.join(",")
      })
    }
  }
}
