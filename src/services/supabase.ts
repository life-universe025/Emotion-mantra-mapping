import { EdgeFunctionService } from './edgeFunctions'
import { Session, UserStats } from '../types'

export class SupabaseService {
  // Authentication - delegate to EdgeFunctionService
  static async signInWithEmail(email: string) {
    return EdgeFunctionService.signInWithEmail(email)
  }

  static async signInWithGoogle() {
    return EdgeFunctionService.signInWithGoogle()
  }

  static async signOut() {
    return EdgeFunctionService.signOut()
  }

  static getCurrentUser() {
    return EdgeFunctionService.getCurrentUser()
  }


  // Mantras - delegate to EdgeFunctionService
  static async getMantras() {
    try {
      const result = await EdgeFunctionService.getMantras()
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  static async getMantrasByEmotion(emotion: string) {
    try {
      const result = await EdgeFunctionService.getMantrasByEmotion(emotion)
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  static async getMantraById(id: number) {
    try {
      const result = await EdgeFunctionService.getMantraById(id)
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }


  // Sessions - delegate to EdgeFunctionService
  static async createSession(session: Omit<Session, 'id' | 'created_at'>) {
    try {
      const result = await EdgeFunctionService.createSession(session)
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  static async getUserSessions(userId: string, limit = 50) {
    try {
      const result = await EdgeFunctionService.getUserSessions(userId, limit)
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  // User Stats - delegate to EdgeFunctionService
  static async getUserStats(userId: string) {
    try {
      const result = await EdgeFunctionService.getUserStats(userId)
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  static async createUserStats(userStats: Omit<UserStats, 'user_id'>) {
    try {
      const result = await EdgeFunctionService.createUserStats(userStats)
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  static async updateUserStats(userId: string, updates: Partial<UserStats>) {
    try {
      const result = await EdgeFunctionService.updateUserStats(userId, updates)
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  // Analytics - delegate to EdgeFunctionService
  static async getUserAnalytics(userId: string) {
    try {
      const result = await EdgeFunctionService.getUserAnalytics(userId)
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  // Consolidated method to get all user data in one go (reduces API calls)
  static async getAllUserData(userId: string) {
    try {
      const result = await EdgeFunctionService.getAllUserData(userId)
      // Edge function already returns { data: {...} }, so we need to return the result directly
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  // Practice History for Charts
  static async getDailyPracticeHistory(userId: string, days = 30) {
    try {
      const result = await EdgeFunctionService.getDailyPracticeHistory(userId, days)
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  static async getWeeklyPracticeHistory(userId: string, weeks = 12) {
    try {
      const result = await EdgeFunctionService.getWeeklyPracticeHistory(userId, weeks)
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  static async getStreakHistory(userId: string) {
    try {
      const result = await EdgeFunctionService.getStreakHistory(userId)
      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  // Custom repetition goals
  static async setCustomRepetitionGoal(userId: string, goal: number) {
    try {
      const result = await EdgeFunctionService.setCustomRepetitionGoal(userId, goal)
      return { success: result.success, data: result.data, error: result.error }
    } catch (error) {
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async getCustomRepetitionGoal(userId: string) {
    try {
      const result = await EdgeFunctionService.getCustomRepetitionGoal(userId)
      return { success: result.success, goal: result.goal, goalSetAt: result.goalSetAt, error: result.error }
    } catch (error) {
      return { success: false, goal: null, goalSetAt: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  static async clearCustomRepetitionGoal(userId: string) {
    try {
      const result = await EdgeFunctionService.clearCustomRepetitionGoal(userId)
      return { success: result.success, data: result.data, error: result.error }
    } catch (error) {
      return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}