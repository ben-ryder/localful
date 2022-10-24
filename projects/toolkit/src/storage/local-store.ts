import {db} from "./db";
import {ChangeDto, UserDto} from "@ben-ryder/lfb-common";


export class LocalStore {
    ENCRYPTION_KEY_STORAGE_KEY = 'encryptionKey';
    ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
    REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
    CURRENT_USER_STORAGE_KEY = 'currentUser';

    async loadAllChanges(): Promise<ChangeDto[]> {
        return db.changes.toArray();
    }

    async loadChanges(ids: string[]): Promise<ChangeDto[]> {
        return db.changes
          .where("id").anyOf(ids)
          .toArray();
    }

    async loadAllChangeIds(): Promise<string[]> {
        const changes = await db.changes.toArray();
        return changes.map(change => change.id);
    }

    async saveChange(change: ChangeDto): Promise<void> {
        await db.changes.add(change);
    }

    async loadEncryptionKey(): Promise<string|null> {
        return localStorage.getItem(this.ENCRYPTION_KEY_STORAGE_KEY);
    }
    async saveEncryptionKey(encryptionKey: string) {
        localStorage.setItem(this.ENCRYPTION_KEY_STORAGE_KEY, encryptionKey);
    }
    async deleteEncryptionKey() {
        return localStorage.removeItem(this.ENCRYPTION_KEY_STORAGE_KEY);
    }
    async loadAccessToken(): Promise<string|null> {
        return localStorage.getItem(this.ACCESS_TOKEN_STORAGE_KEY);
    }
    async saveAccessToken(accessToken: string) {
        localStorage.setItem(this.ACCESS_TOKEN_STORAGE_KEY, accessToken);
    }
    async deleteAccessToken() {
        return localStorage.removeItem(this.ACCESS_TOKEN_STORAGE_KEY);
    }
    async loadRefreshToken(): Promise<string|null> {
        return localStorage.getItem(this.REFRESH_TOKEN_STORAGE_KEY);
    }
    async saveRefreshToken(refreshToken: string) {
        localStorage.setItem(this.REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    }
    async deleteRefreshToken() {
        return localStorage.removeItem(this.REFRESH_TOKEN_STORAGE_KEY);
    }

    async loadCurrentUser(): Promise<UserDto|null> {
        const raw = localStorage.getItem(this.CURRENT_USER_STORAGE_KEY);
        if (raw) {
            try {
                const loaded = JSON.parse(raw);
                return loaded as UserDto;
            }
            catch (e) {
                return null;
            }
        }
        return null;
    }
    async saveCurrentUser(currentUser: UserDto) {
        localStorage.setItem(this.CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    }
    async deleteCurrentUser() {
        return localStorage.removeItem(this.CURRENT_USER_STORAGE_KEY);
    }

    async clear() {
        await this.deleteCurrentUser();
        await this.deleteAccessToken();
        await this.deleteRefreshToken();
        await this.deleteEncryptionKey();
    }
}
