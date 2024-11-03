export interface User {
  id: string;
  username: string;
  created_at: string;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  chat_id: string;
  created_at: string;
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}
