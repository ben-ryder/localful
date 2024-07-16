
export interface RawDatabaseVault {
	id: string
	vault_name: string
	protected_encryption_key: string
	protected_data?: string
	owner_id: string
	created_at: string
	updated_at: string
}
