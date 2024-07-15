import {z} from "zod";
import {CreatedAtField, createIdField, ProtectedDataField, UpdatedAtField} from "../common/fields";

export const VaultFields = z.object({
	name: z.string()
		.min(1, "name must be at least 1 character.")
		.max(100, "name can't be over 100 characters."),
	protectedEncryptionKey: z.string()
		.min(1, "protectedEncryptionKey must be at least 1 character.")
		.max(255, "protectedEncryptionKey can't be over 255 characters."),
	protectedData: ProtectedDataField.nullish(),
}).strict()
export type VaultFields = z.infer<typeof VaultFields>;

export const VaultEntity = VaultFields.extend({
	id: createIdField(),
	ownerId: createIdField('ownerId'),
	createdAt: CreatedAtField,
	updatedAt: UpdatedAtField,
}).strict()
export type VaultEntity = z.infer<typeof VaultEntity>;

export const VaultDto = VaultEntity;
export type VaultDto = z.infer<typeof VaultDto>;

export const CreateVaultDto = VaultFields
export type CreateVaultDto = z.infer<typeof CreateVaultDto>;

export const UpdateVaultDto = VaultFields
	.pick({name: true, protectedData: true})
	.strict()
export type UpdateVaultDto = z.infer<typeof UpdateVaultDto>;
