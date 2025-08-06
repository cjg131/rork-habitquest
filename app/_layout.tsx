import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth-store";
import { OnboardingProvider } from "@/hooks/use-onboarding-store";
import { AppSettingsProvider } from "@/hooks/use-app-settings";
import { TasksProvider } from "@/hooks/use-tasks-store";
import { HabitsProvider } from "@/hooks/use-habits-store";
import { PomodoroProvider } from "@/hooks/use-pomodoro-store";
import { GamificationProvider } from "@/hooks/use-gamification-store";
import { trpc, trpcClient } from "@/lib/trpc";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colors } = useTheme();
  
  return (
    <Stack 
      screenOptions={{ 
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text.primary,
        },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: 'modal',
          headerShown: true,
          title: 'Modal'
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthProvider>
            <AppSettingsProvider>
              <OnboardingProvider>
                <TasksProvider>
                  <HabitsProvider>
                    <PomodoroProvider>
                      <GamificationProvider>
                        <RootLayoutNav />
                      </GamificationProvider>
                    </PomodoroProvider>
                  </HabitsProvider>
                </TasksProvider>
              </OnboardingProvider>
            </AppSettingsProvider>
          </AuthProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}