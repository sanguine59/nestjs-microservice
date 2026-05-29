import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ClientsService {
  constructor(private config: ConfigService) {}

  private authUrl() {
    return this.config.get<string>('AUTH_SERVICE_URL') ?? 'http://localhost:3000';
  }

  private gameUrl() {
    return this.config.get<string>('GAME_SERVICE_URL') ?? 'http://localhost:3001';
  }

  async getUserProfile(userId: string): Promise<any | null> {
    try {
      const res = await axios.get(`${this.authUrl()}/users/${userId}/profile`);
      return res.data;
    } catch {
      return null;
    }
  }

  async getCategory(categoryId: string): Promise<any | null> {
    try {
      const res = await axios.get(`${this.gameUrl()}/categories/${categoryId}`);
      return res.data;
    } catch {
      return null;
    }
  }
}
