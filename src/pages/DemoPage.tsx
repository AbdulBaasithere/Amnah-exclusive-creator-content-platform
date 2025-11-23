import { useEffect, useMemo, useState, useCallback } from 'react'
import { Sparkles, Gem } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Toaster, toast } from '@/components/ui/sonner'
import type { User, Chat, ChatMessage } from '@shared/types'
import { api } from '@/lib/api-client'
import { AppLayout } from '@/components/layout/AppLayout'
import { MOCK_USER_TOKENS } from 'shared/mock-data'
import { TokenPurchaseModal } from '@/components/modals/TokenPurchaseModal'
export function DemoPage() {
  const [users, updateUsers] = useState<User[]>([])
  const [chats, updateChats] = useState<Chat[]>([])
  const [messages, updateMessages] = useState<ChatMessage[]>([])
  const [selectedUserId, chooseUserId] = useState<string>('')
  const [selectedChatId, chooseChatId] = useState<string>('')
  const [name, updateName] = useState('')
  const [title, updateTitle] = useState('')
  const [text, updateText] = useState('')
  const [isTokenModalOpen, setTokenModalOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(MOCK_USER_TOKENS.balance);
  const usersById = useMemo(() => new Map(users.map(u => [u.id, u])), [users])
  const loadBasics = useCallback(async () => {
    try {
      const [uPage, cPage] = await Promise.all([
        api<{ items: User[]; next: string | null }>('/api/users'),
        api<{ items: Chat[]; next: string | null }>('/api/chats'),
      ]);
      updateUsers(uPage.items);
      updateChats(cPage.items);
    } catch (err) {
      toast.error("Failed to load initial data. Using fallback.");
      console.error(err);
    }
  }, []);
  const loadMessages = useCallback(async (chatId: string) => {
    try {
      const m = await api<ChatMessage[]>(`/api/chats/${chatId}/messages`);
      updateMessages(m);
    } catch (err: any) {
      toast.error(err.message);
    }
  }, []);
  useEffect(() => {
    loadBasics();
  }, [loadBasics]);
  useEffect(() => {
    if (!selectedUserId && users.length) chooseUserId(users[0].id);
  }, [users, selectedUserId]);
  useEffect(() => {
    if (!selectedChatId && chats.length) chooseChatId(chats[0].id);
  }, [chats, selectedChatId]);
  useEffect(() => {
    if (selectedChatId) loadMessages(selectedChatId);
  }, [selectedChatId, loadMessages]);
  const createUser = useCallback(async () => {
    if (!name.trim()) return;
    try {
      const u = await api<User>('/api/users', { method: 'POST', body: JSON.stringify({ name: name.trim() }) });
      updateUsers(prev => [...prev, u]);
      updateName('');
      toast.success('User created');
      if (!selectedUserId) chooseUserId(u.id);
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [name, selectedUserId]);
  const createChat = useCallback(async () => {
    if (!title.trim()) return;
    try {
      const c = await api<Chat>('/api/chats', { method: 'POST', body: JSON.stringify({ title: title.trim() }) });
      updateChats(prev => [...prev, c]);
      updateTitle('');
      toast.success('Chat created');
      if (!selectedChatId) chooseChatId(c.id);
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [title, selectedChatId]);
  const send = useCallback(async () => {
    if (!selectedUserId || !selectedChatId || !text.trim()) return;
    try {
      const m = await api<ChatMessage>(`/api/chats/${selectedChatId}/messages`, { method: 'POST', body: JSON.stringify({ userId: selectedUserId, text: text.trim() }) });
      updateMessages(prev => [...prev, m]);
      updateText('');
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [selectedUserId, selectedChatId, text]);
  return (
    <AppLayout container>
      <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 overflow-hidden relative">
        <ThemeToggle />
        <div className="space-y-6 relative z-10 max-w-3xl w-full">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary floating">
              <Sparkles className="w-8 h-8 text-white rotating" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-center">
            Template Demo Page
          </h1>
          <p className="text-muted-foreground text-center">This page demonstrates the original template features and the new token system.</p>
          <div className="p-4 border rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Gem className="w-5 h-5 text-primary" />
              <span className="font-medium">Token Balance: {tokenBalance}</span>
            </div>
            <Button onClick={() => setTokenModalOpen(true)}>Buy Tokens</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex gap-2">
              <Input placeholder="New user name" value={name} onChange={(e) => updateName(e.target.value)} />
              <Button onClick={createUser}>Add User</Button>
            </div>
            <div className="flex gap-2">
              <Input placeholder="New chat title" value={title} onChange={(e) => updateTitle(e.target.value)} />
              <Button onClick={createChat}>Add Chat</Button>
            </div>
          </div>
          <div className="border rounded p-3 h-64 overflow-y-auto bg-muted/30">
            {selectedChatId ? (
              messages.length ? (
                messages.map(m => (
                  <div key={m.id} className="text-sm mb-2">
                    <span className="font-medium">{usersById.get(m.userId)?.name ?? 'Unknown'}:</span> {m.text}
                    <span className="text-xs text-muted-foreground ml-2">{new Date(m.ts).toLocaleTimeString()}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No messages yet.</div>
              )
            ) : (
              <div className="text-sm text-muted-foreground">Select a chat to view messages.</div>
            )}
          </div>
          <div className="flex gap-2">
            <Textarea placeholder="Type a message" value={text} onChange={(e) => updateText(e.target.value)} disabled={!selectedUserId || !selectedChatId} />
            <Button onClick={send} disabled={!selectedUserId || !selectedChatId || !text.trim()}>Send</Button>
          </div>
        </div>
        <TokenPurchaseModal isOpen={isTokenModalOpen} onOpenChange={setTokenModalOpen} onPurchaseSuccess={(amount) => setTokenBalance(prev => prev + amount)} />
        <Toaster richColors closeButton />
      </main>
    </AppLayout>
  )
}