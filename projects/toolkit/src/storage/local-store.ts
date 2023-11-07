import {db} from "./db.js";
import {ChangeDto, ProfileDto} from "@ben-ryder/lfb-common";


export class LocalStore {
    ENCRYPTION_KEY_STORAGE_KEY = 'encryptionKey';
    CURRENT_PROFILE_STORAGE_KEY = 'currentProfile';

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

    async loadCurrentProfile(): Promise<ProfileDto|null> {
        const raw = localStorage.getItem(this.CURRENT_PROFILE_STORAGE_KEY);
        if (raw) {
            try {
                const loaded = JSON.parse(raw);
                return loaded as ProfileDto;
            }
            catch (e) {
                return null;
            }
        }
        return null;
    }
    async saveCurrentProfile(currentProfile: ProfileDto) {
        localStorage.setItem(this.CURRENT_PROFILE_STORAGE_KEY, JSON.stringify(currentProfile));
    }
    async deleteCurrentProfile() {
        return localStorage.removeItem(this.CURRENT_PROFILE_STORAGE_KEY);
    }

    async clear() {
        await this.deleteCurrentProfile();
        await this.deleteEncryptionKey();
    }
}
