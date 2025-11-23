import { IndexedEntity } from './core-utils';
import type { Creator, ContentItem, Tier, Subscription, TokenTransaction, UserTokens } from '@shared/types';
import { MOCK_CREATOR, MOCK_CONTENT_ITEMS, MOCK_TIERS, MOCK_SUBSCRIPTION, MOCK_TOKEN_TRANSACTIONS, MOCK_USER_TOKENS } from '@shared/mock-data';
// Creator Entity
export class CreatorEntity extends IndexedEntity<Creator> {
  static readonly entityName = 'creator';
  static readonly indexName = 'creators';
  static readonly initialState: Creator = { id: '', name: '', bio: '', avatar: '', balance: 0 };
  static readonly seedData = [MOCK_CREATOR];
}
// Content Entity
export class ContentEntity extends IndexedEntity<ContentItem> {
  static readonly entityName = 'content';
  static readonly indexName = 'content_items';
  static readonly initialState: ContentItem = { id: '', creatorId: '', title: '', description: '', type: 'post', tierId: '', publishedAt: new Date(), status: 'draft', attachments: [] };
  static readonly seedData = MOCK_CONTENT_ITEMS;
}
// Tier Entity
export class TierEntity extends IndexedEntity<Tier> {
  static readonly entityName = 'tier';
  static readonly indexName = 'tiers';
  static readonly initialState: Tier = { id: '', creatorId: '', name: '', price: 0, benefits: [] };
  static readonly seedData = MOCK_TIERS;
}
// Subscription Entity
export class SubscriptionEntity extends IndexedEntity<Subscription> {
  static readonly entityName = 'subscription';
  static readonly indexName = 'subscriptions';
  static readonly initialState: Subscription = { id: '', userId: '', creatorId: '', tierId: '', active: false };
  static readonly seedData = [MOCK_SUBSCRIPTION];
}
// Token Transaction Entity
export class TokenTransactionEntity extends IndexedEntity<TokenTransaction> {
  static readonly entityName = 'token_transaction';
  static readonly indexName = 'token_transactions';
  static readonly initialState: TokenTransaction = { id: '', userId: '', amount: 0, reason: '', ts: new Date() };
  static readonly seedData = MOCK_TOKEN_TRANSACTIONS;
}
// User Tokens Entity (Not indexed, as we'll likely fetch by user ID)
export class UserTokensEntity extends IndexedEntity<UserTokens> {
    static readonly entityName = 'user_tokens';
    static readonly indexName = 'user_tokens_idx'; // still needs an index name
    static readonly initialState: UserTokens = { id: '', userId: '', balance: 0 };
    static readonly seedData = [MOCK_USER_TOKENS];
    static keyOf(state: UserTokens): string { return state.id; }
}