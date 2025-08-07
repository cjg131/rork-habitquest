import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
// expo-stripe is not installed, using mock payment flow
// import { StripeProvider, useStripe } from 'expo-stripe';
import { Stack } from 'expo-router';
import { useSubscriptionStore } from '@/hooks/use-subscription-store';
import { trpc } from '@/lib/trpc';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key_here';

export default function PaymentScreen() {
  // const { initPaymentSheet, presentPaymentSheet } = useStripe();
  // setSubscription is not in the store, using mock update
// const { setSubscription } = useSubscriptionStore();
  const [loading, setLoading] = useState(false);

  const createPaymentIntent = trpc.stripe.createPaymentIntent.useMutation();

  const initializePaymentSheet = async () => {
    setLoading(true);
    try {
      // Mock payment flow since expo-stripe is not installed
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing delay
      Alert.alert('Success', 'Payment processed successfully (mocked)');
      // Simulate successful payment for demo
      // setSubscription({
      //   isSubscribed: true,
      //   plan: 'premium',
      //   expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      //   lastPayment: new Date().toISOString(),
      //   paymentMethod: 'stripe',
      // });
    } catch (error) {
      console.error('Payment initialization error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /* const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your payment was confirmed!');
      setSubscription({
        isSubscribed: true,
        plan: 'premium',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastPayment: new Date().toISOString(),
        paymentMethod: 'stripe',
      });
    }
  }; */

  return (
    /* <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.yourapp" // Required for Apple Pay
    > */
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Payment' }} />
        <View style={styles.content}>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.price}>$9.99 / year</Text>
          <Text style={styles.description}>
            Unlock all premium features including advanced analytics, unlimited tasks and habits, and ad-free experience.
          </Text>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={initializePaymentSheet}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Processing...' : 'Pay Now'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.terms}>
            By confirming your payment, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>
    /* </StripeProvider> */
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  terms: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
