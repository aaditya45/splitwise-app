export interface GroupMember {
  userId: number;
  name: string;
}

export interface Group {
  groupId: number;
  name: string;
  description?: string;
  groupImage?: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  members?: GroupMember[];
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  groupImage?: string;
}

export interface AddMemberResponse {
  message: string;
  statusCode: number;
  success: boolean;
}