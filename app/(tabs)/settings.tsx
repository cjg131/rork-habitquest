import React from 'react';
import { StyleSheet, View, Text, ScrollView, Switch as RNSwitch, TouchableOpacity, Share as RNShare, Alert, Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/use-auth-store';
import { useAppSettings } from '@/hooks/use-app-settings';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useOfflineSync } from '@/hooks/use-offline-sync';
import OfflineBanner from '@/components/offline/OfflineBanner';
import IntegrationManager from '@/components/integrations/IntegrationManager';
import { 
  Bell, 
  Clock, 
  HelpCircle, 
  ListTodo,
  LogOut, 
  Settings as SettingsIcon, 
  Share, 
  Shield, 
  User 
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { settings, updateSettings } = useAppSettings();
  const { unsyncedChangesCount } = useOfflineSync();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)');
  };

  const handleShareApp = async () => {
    try {
      const result = await RNShare.share({
        message: 'Check out this amazing habit and task tracker app! It helps you stay productive and build better habits. Download it now!',
        title: 'Habit & Task Tracker',
        url: Platform.OS === 'ios' ? 'https://apps.apple.com/app/habit-tracker' : 'https://play.google.com/store/apps/details?id=com.habittracker',
      });
      
      if (result.action === RNShare.sharedAction) {
        console.log('App shared successfully');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Share Failed', 'Unable to share the app at this time. Please try again later.');
    }
  };

  const toggleNotifications = () => {
    updateSettings({
      notificationsEnabled: !settings.notificationsEnabled,
    });
  };

  const SettingItem = ({ icon, title, description, action, isSwitch, value }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    action: () => void;
    isSwitch: boolean;
    value?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={isSwitch ? undefined : action}
      disabled={isSwitch}
      activeOpacity={isSwitch ? 1 : 0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
        {icon}
      </View>
      
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
            {description}
          </Text>
        )}
      </View>
      
      {isSwitch ? (
        <RNSwitch
          value={value}
          onValueChange={action}
          trackColor={{ false: '#E5E5EA', true: colors.primary }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E5E5EA"
        />
      ) : (
        <SettingsIcon size={20} color={colors.text.tertiary} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <OfflineBanner unsyncedCount={unsyncedChangesCount} />
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Avatar
            source={user?.avatar}
            name={user?.name}
            size="lg"
          />
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text.primary }]}>
              {user?.name}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.text.secondary }]}>
              {user?.email}
            </Text>
          </View>
        </View>
        
        <Button
          title="Edit Profile"
          variant="outline"
          size="sm"
          leftIcon={<User size={16} color={colors.primary} />}
          onPress={() => router.push('/modal?type=profile-edit')}
          style={styles.editProfileButton}
        />
      </Card>
      
      <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
        App Settings
      </Text>
      
      <Card style={styles.settingsCard}>
        <SettingItem
          icon={<Bell size={20} color={colors.primary} />}
          title="Notifications"
          description={settings.notificationsEnabled ? 'Enabled' : 'Disabled'}
          action={toggleNotifications}
          isSwitch={true}
          value={settings.notificationsEnabled}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <SettingItem
          icon={<ListTodo size={20} color={colors.primary} />}
          title="Completed Tasks"
          description={settings.completedItemsDisplay === 'crossedOut' ? 'Cross out and keep in list' : 'Move to completed tab'}
          action={() => {
            updateSettings({
              completedItemsDisplay: settings.completedItemsDisplay === 'crossedOut' ? 'moveToCompleted' : 'crossedOut'
            });
          }}
          isSwitch={true}
          value={settings.completedItemsDisplay === 'crossedOut'}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <SettingItem
          icon={<Clock size={20} color={colors.primary} />}
          title="Pomodoro Settings"
          description="Customize work and break durations"
          action={() => router.push('/modal?type=pomodoro-settings')}
          isSwitch={false}
          value={undefined}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <SettingItem
          icon={<Shield size={20} color={colors.primary} />}
          title="Privacy"
          description="Manage your data and privacy settings"
          action={() => router.push('/modal?type=privacy-settings')}
          isSwitch={false}
          value={undefined}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <SettingItem
          icon={<SettingsIcon size={20} color={colors.primary} />}
          title="Frictionless Mode"
          description="Minimize animations for quicker interactions"
          action={() => {
            updateSettings({
              frictionlessMode: !settings.frictionlessMode
            });
          }}
          isSwitch={true}
          value={settings.frictionlessMode}
        />
      </Card>
      
      <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
        Other
      </Text>
      
      <Card style={styles.settingsCard}>
        <SettingItem
          icon={<Share size={20} color={colors.primary} />}
          title="Share App"
          description="Tell your friends about this app"
          action={handleShareApp}
          isSwitch={false}
          value={undefined}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <SettingItem
          icon={<HelpCircle size={20} color={colors.primary} />}
          title="Help & Support"
          description="FAQs, contact support, report a bug"
          action={() => router.push('/modal?type=help-support')}
          isSwitch={false}
          value={undefined}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <SettingItem
          icon={<SettingsIcon size={20} color={colors.primary} />}
          title="Integrations"
          description="Connect with Apple Health and Zapier (Premium)"
          action={() => router.push('/modal?type=integrations')}
          isSwitch={false}
          value={undefined}
        />
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <SettingItem
          icon={<SettingsIcon size={20} color={colors.primary} />}
          title="Delete Account"
          description="Schedule account deletion with grace period"
          action={() => router.push('/account-deletion')}
          isSwitch={false}
          value={undefined}
        />
      </Card>
      
      <Button
        title="Sign Out"
        variant="outline"
        leftIcon={<LogOut size={20} color={colors.error} />}
        onPress={handleSignOut}
        style={[styles.signOutButton, { borderColor: colors.error }]}
        textStyle={{ color: colors.error }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsCard: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  signOutButton: {
    marginTop: 8,
  },
});