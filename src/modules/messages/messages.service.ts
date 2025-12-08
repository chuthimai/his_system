import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';
import { Notification } from 'firebase-admin/messaging';

@Injectable()
export class MessageService {
  constructor(private readonly configService: ConfigService) {
    firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId: configService.getOrThrow('FIREBASE_PROJECT_ID'),
        clientEmail: configService.getOrThrow('FIREBASE_CLIENT_ID'),
        privateKey: configService.getOrThrow('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      }),
    });
  }

  async sendToDevice(token: string, notification: Notification): Promise<void> {
    await firebase.messaging().send({
      token,
      notification,
    });
  }
}
