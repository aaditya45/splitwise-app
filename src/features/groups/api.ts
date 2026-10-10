import { isRecord, request } from '@/lib/api-client';
import type { AddMemberResponse, CreateGroupRequest, Group } from './types';

export async function createGroup(token: string, body: CreateGroupRequest): Promise<Group> {
  const group = await request<unknown>('/api/groups', { method: 'POST', token, body });
  if (!isRecord(group) || typeof group.groupId !== 'number') {
    throw new Error('Group creation returned successfully, but its response did not include a numeric groupId.');
  }
  return group as Group;
}

export async function getGroupsByUserId(token: string, userId: number): Promise<Group[]> {
  const result = await request<unknown>('/api/groups/user/groups', { token });
  const groups = Array.isArray(result)
    ? result
    : isRecord(result) && Array.isArray(result.groups)
      ? result.groups
      : null;
  if (!groups) throw new Error(`GET /api/groups/${userId} did not return a list of groups.`);
  return groups.filter(
    (group): group is Group =>
      isRecord(group) && typeof group.groupId === 'number' && typeof group.name === 'string',
  );
}

export async function addMember(token: string, groupId: number, userId: number): Promise<AddMemberResponse> {
  const result = await request<unknown>(`/api/groups/${groupId}/members/${userId}`, {
    method: 'POST',
    token,
  });
  if (!isRecord(result) || typeof result.success !== 'boolean') {
    throw new Error('The add-member endpoint did not return a valid success response.');
  }
  if (!result.success) {
    throw new Error(typeof result.message === 'string' ? result.message : 'Unable to add member.');
  }
  return result as AddMemberResponse;
}