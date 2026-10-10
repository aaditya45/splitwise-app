import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { AppIcon, AppText, Avatar, IconButton, LoadingView, Notice, PageHeader, PrimaryButton, ScreenFrame } from '@/components/ui';
import { groupsScreenStyles as styles } from '@/theme/styles/screens';
import { Palette } from '@/theme';
import { useApp } from '@/providers/app-provider';

export default function GroupsScreen() {
  const { groups, groupsError, groupsLoading, session } = useApp();

  return (
    <ScreenFrame>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Your groups"
          subtitle="Pick a group to see its activity."
          right={(
            <View style={styles.headerActions}>
              <IconButton name="add" accessibilityLabel="Create a group" onPress={() => router.push('/new-group')} />
              <Pressable accessibilityRole="button" accessibilityLabel="Open your profile" onPress={() => router.push('/account')} style={({ pressed }) => [pressed && styles.pressed]}>
                <Avatar name={session?.user.name} />
              </Pressable>
            </View>
          )}
        />

        {groupsError ? <Notice message={groupsError} /> : null}

        {groupsLoading ? <LoadingView label="Loading your groups" /> : groups.length ? (
          <View style={styles.list}>
            {groups.map((group) => (
              <Pressable key={group.groupId} accessibilityRole="button" onPress={() => router.push({ pathname: '/group/[groupId]', params: { groupId: String(group.groupId) } })} style={({ pressed }) => [styles.groupRow, pressed && styles.pressed]}>
                <Avatar name={group.name} size={46} />
                <View style={styles.groupDetails}>
                  <AppText variant="body" style={styles.groupName}>{group.name}</AppText>
                  <AppText variant="caption" color={Palette.muted}>{group.members?.length ?? 0} members</AppText>
                  {group.description ? <AppText variant="caption" color={Palette.muted} numberOfLines={1}>{group.description}</AppText> : null}
                </View>
                <AppIcon name="chevron" color={Palette.muted} size={18} />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><AppIcon name="groups" color={Palette.orangeDark} size={24} /></View>
            <AppText variant="section">No groups yet</AppText>
            <AppText variant="small" color={Palette.muted} style={styles.emptyCopy}>Create your first group to start tracking shared expenses.</AppText>
            <PrimaryButton title="Create a group" icon="add" onPress={() => router.push('/new-group')} />
          </View>
        )}
      </ScrollView>
    </ScreenFrame>
  );
}

