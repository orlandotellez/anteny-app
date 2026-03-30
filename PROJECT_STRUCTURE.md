anteny-app/
├── app/                               # SOLO navegación (Expo Router)
│   ├── (auth)/                        # flujo de autenticación
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   │
│   ├── (tabs)/                        # navegación principal
│   │   ├── chats/
│   │   │   ├── index.tsx              # lista de chats
│   │   │   └── _layout.tsx            # stack interno (opcional)
│   │   │
│   │   ├── contacts/
│   │   │   └── index.tsx
│   │   │
│   │   ├── settings/
│   │   │   └── index.tsx
│   │   │
│   │   └── _layout.tsx                # Tab navigator
│   │
│   ├── chat/                          # flujo completo de conversación
│   │   ├── [chatId]/
│   │   │   ├── index.tsx              # conversación (chat screen)
│   │   │   ├── profile.tsx            # perfil del usuario
│   │   │   ├── media.tsx              # fotos, videos, archivos
│   │   │   ├── search.tsx             # buscar mensajes
│   │   │   ├── pinned.tsx             # mensajes fijados
│   │   │   └── _layout.tsx            # stack del chat (SIN tabs)
│   │
│   ├── modal/                         # modales globales
│   │   ├── new-chat.tsx
│   │   └── forward-message.tsx
│   │
│   ├── _layout.tsx                    # root (providers globales)
│   └── +not-found.tsx
│
├── src/                               # lógica de negocio real
│   ├── features/                      # arquitectura por features
│   │   ├── auth/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── hooks.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── chats/                     # lista de conversaciones
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── hooks.ts
│   │   │   ├── components/
│   │   │   │   ├── ChatItem.tsx
│   │   │   │   └── ChatList.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── messages/                  # mensajes dentro del chat
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── hooks.ts
│   │   │   ├── components/
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   └── MessageList.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── contacts/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── hooks.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── media/                     # archivos compartidos
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   │
│   │   └── presence/                  # online, typing...
│   │       ├── socket.ts
│   │       └── store.ts
│   │
│   ├── shared/                        # reutilizable global
│   │   ├── components/
│   │   │   ├── ui/                    # Button, Input, Avatar
│   │   │   └── layout/                # Screen, Header
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   │
│   ├── services/                      # infraestructura
│   │   ├── api-client.ts
│   │   ├── socket.ts
│   │   └── storage.ts
│   │
│   ├── database/                      # offline-first (opcional)
│   │   ├── schema.ts
│   │   ├── queries/
│   │   └── sync.ts
│   │
│   └── config/
│       └── index.ts
│
├── assets/
├── package.json
└── tsconfig.json
