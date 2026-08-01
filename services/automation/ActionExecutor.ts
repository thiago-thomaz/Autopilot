import { PlatformActionAdapter } from './adapters/PlatformActionAdapter';
import { WebsiteActionAdapter } from './adapters/WebsiteActionAdapter';
import { BlogActionAdapter } from './adapters/BlogActionAdapter';
import { EmailActionAdapter } from './adapters/EmailActionAdapter';
import { TelegramActionAdapter } from './adapters/TelegramActionAdapter';
import { WhatsAppActionAdapter } from './adapters/WhatsAppActionAdapter';
import { PinterestActionAdapter } from './adapters/PinterestActionAdapter';
import { YouTubeActionAdapter } from './adapters/YouTubeActionAdapter';
import { InstagramActionAdapter } from './adapters/InstagramActionAdapter';
import { FacebookActionAdapter } from './adapters/FacebookActionAdapter';
import { TikTokActionAdapter } from './adapters/TikTokActionAdapter';
import { XActionAdapter } from './adapters/XActionAdapter';
import { ThreadsActionAdapter } from './adapters/ThreadsActionAdapter';
import { ActionPlanBlueprint, ActionStatus } from '../../types/automation/automation.types';
import { AutomationPersistenceService } from './AutomationPersistenceService';

export class ActionExecutor {
  private adapters: Map<string, PlatformActionAdapter> = new Map();
  private persistence: AutomationPersistenceService;

  constructor(persistence?: AutomationPersistenceService) {
    this.persistence = persistence || new AutomationPersistenceService();
    this.registerDefaultAdapters();
  }

  private registerDefaultAdapters() {
    const website = new WebsiteActionAdapter();
    const blog = new BlogActionAdapter();
    const email = new EmailActionAdapter();
    const telegram = new TelegramActionAdapter();
    const whatsapp = new WhatsAppActionAdapter();
    const pinterest = new PinterestActionAdapter();
    const youtube = new YouTubeActionAdapter();
    const instagram = new InstagramActionAdapter();
    const facebook = new FacebookActionAdapter();
    const tiktok = new TikTokActionAdapter();
    const x = new XActionAdapter();
    const threads = new ThreadsActionAdapter();

    this.adapters.set(website.platformName, website);
    this.adapters.set(blog.platformName, blog);
    this.adapters.set(email.platformName, email);
    this.adapters.set(telegram.platformName, telegram);
    this.adapters.set(whatsapp.platformName, whatsapp);
    this.adapters.set(pinterest.platformName, pinterest);
    this.adapters.set(youtube.platformName, youtube);
    this.adapters.set(instagram.platformName, instagram);
    this.adapters.set(facebook.platformName, facebook);
    this.adapters.set(tiktok.platformName, tiktok);
    this.adapters.set(x.platformName, x);
    this.adapters.set(threads.platformName, threads);
  }

  async executePlan(blueprint: ActionPlanBlueprint) {
    const results = [];
    for (const step of blueprint.steps) {
      const actionRecord = await this.persistence.createAction(step, blueprint.decisionId);
      const platformKey = step.platform ? step.platform.toUpperCase() : 'WEBSITE';
      const adapter = this.adapters.get(platformKey) || this.adapters.get('WEBSITE')!;

      try {
        await this.persistence.updateActionStatus(actionRecord.id, ActionStatus.EXECUTING);
        const execResult = await adapter.executeAction(step);

        if (execResult.success) {
          await this.persistence.updateActionStatus(actionRecord.id, ActionStatus.COMPLETED, execResult.response);
          results.push(execResult);
        } else {
          await this.persistence.updateActionStatus(actionRecord.id, ActionStatus.FAILED, undefined, execResult.error);
          throw new Error(`Action step failed on ${platformKey}: ${execResult.error}`);
        }
      } catch (err: any) {
        await this.persistence.updateActionStatus(actionRecord.id, ActionStatus.FAILED, undefined, err.message);
        throw err;
      }
    }
    return results;
  }
}
