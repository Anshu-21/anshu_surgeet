import { Client, Account, ID } from 'appwrite';
import conf from "../conf/conf"

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl) 
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      if (userAccount) {
        return this.login({ email, password });
      }
      return userAccount;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async checkSession() {
    try {
      const session = await this.account.getSession('current');
      return session;
    } catch (error) {
      console.warn("No active session:", error);
      return null;
    }
  }

  async getCurrentUser() {
    try {
      const session = await this.checkSession();
      if (!session) {
        console.warn("No active session, user not logged in.");
        return null;
      }
      const user = await this.account.get();
      return user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSession('current'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}

const authService = new AuthService();
export default authService;
