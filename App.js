import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true
    }
  }
})

export default function App() {

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Notifikasi Lokal Pertama Aq',
        body: 'Ini adalah notifikasi lokal pertama aq',
        data: {
          username: 'Aq'
        }
      },
      trigger: {
        seconds: 2
      }

    })
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button title='Schedule Notification' onPress={scheduleNotificationHandler}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
