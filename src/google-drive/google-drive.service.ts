import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

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
}