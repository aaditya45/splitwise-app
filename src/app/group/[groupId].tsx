import { useLocalSearchParams } from 'expo-router';

import { ProtectedScreen } from '@/features/auth/components/protected-screen';
import { GroupDetailsScreen as GroupDetailsContent } from '@/features/groups/components/group-details-screen';

export default function GroupDetailsScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  return <ProtectedScreen><GroupDetailsContent groupId={groupId} /></ProtectedScreen>;
}
