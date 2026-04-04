// Auth
export { registerUser, loginUser } from './auth';

// Profile
export { getProfile, setDisplayName, uploadAvatar, setAvatar } from './profile';

// Users
export { searchUsers } from './users';

// Rooms
export {
  createDirectChat,
  getJoinedRooms,
  getInvitedRooms,
  getRoomDetails,
  getRoomMembers,
  getRoomName,
  isRoomDirect,
  leaveRoom,
  joinRoom,
  rejectInvite,
} from './rooms';

// Sync (long polling)
export {
  matrixSync,
  processSyncResponse,
} from './sync';

// Timeline
export {
  processTimelineEvent
} from './timeline'

// Messages
export {
  sendRoomMessage,
  redactMessage,
  getRoomMessages
} from './messages'
