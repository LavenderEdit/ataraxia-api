import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Stream } from 'stream';

@Injectable()
export class GoogleDriveService {
    private driveClient;
    private readonly logger = new Logger(GoogleDriveService.name);

    constructor(private configService: ConfigService) {
        const clientId = this.configService.get<string>('DRIVE_OAUTH_CLIENT_ID');
        const clientSecret = this.configService.get<string>('DRIVE_OAUTH_CLIENT_SECRET');
        const refreshToken = this.configService.get<string>('DRIVE_OAUTH_REFRESH_TOKEN');

        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
        oauth2Client.setCredentials({ refresh_token: refreshToken });

        this.driveClient = google.drive({ version: 'v3', auth: oauth2Client });
    }

    async getFileViewLink(fileId: string): Promise<string> {
        try {
            const response = await this.driveClient.files.get({
                fileId: fileId,
                fields: 'webViewLink, thumbnailLink, webContentLink',
            });
            return response.data.thumbnailLink || response.data.webViewLink;
        } catch (error) {
            this.logger.error(`Error fetching file from Drive: ${error.message}`);
            return '';
        }
    }

    async uploadFile(filename: string, mimeType: string, buffer: Buffer): Promise<string> {
        if (!this.driveClient) throw new Error('Google Drive not configured');

        const folderId = this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID');

        const bufferStream = new Stream.PassThrough();
        bufferStream.end(buffer);

        const fileMetadata = {
            name: filename,
            parents: folderId ? [folderId] : [],
        };

        const media = {
            mimeType: mimeType,
            body: bufferStream,
        };

        try {
            const response = await this.driveClient.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id',
            });

            await this.setFilePublic(response.data.id);

            return response.data.id;
        } catch (error) {
            this.logger.error(`Upload failed: ${error.message}`);
            throw error;
        }
    }

    async deleteFile(fileId: string): Promise<void> {
        if (!this.driveClient) return;
        try {
            await this.driveClient.files.delete({ fileId });
            this.logger.log(`Deleted file ${fileId} from Drive`);
        } catch (error) {
            this.logger.warn(`Failed to delete file ${fileId}: ${error.message}`);
        }
    }

    private async setFilePublic(fileId: string) {
        try {
            await this.driveClient.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
        } catch (error) {
            this.logger.warn(`Could not set public permission for ${fileId}`);
        }
    }
}