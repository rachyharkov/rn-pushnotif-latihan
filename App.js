import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
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

  useEffect(() => {
    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync()
      let finalStatus = status

      if(finalStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if(finalStatus !== 'granted') {
        alert(
          'Tidak dapat mengakses notifikasi',
          'Push notifications need the appropriate permissions to be granted',
          [{text: 'Okay'}]
        )
        return
      }

      // buwat get pushToken 
      const pushTokenData = await Notifications.getExpoPushTokenAsync()
      console.log(pushTokenData)
    }

    if(Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C'
      })
    }

    configurePushNotifications()
  },[])

  useEffect(() => {
    
    const subscription1 = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification Received')
      console.log(notification)
      const userName = notification.request.content.data.username
      console.log('Test ambil data: ' + userName)
    })

    // Kalau mau mengambil response user dari notifikasinya
    const subscription2 = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification Response Received')
      console.log(response)
      const userName = response.notification.request.content.data.username
      console.log('Yang respon adalah: ' + userName)
    })

    return () => {
      subscription1.remove()
      subscription2.remove()
    }


  },[])

  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Notifikasi Lokal Pertama Aq',
        body: 'Ini adalah notifikasi lokal pertama aq',
        data: {
          username: 'Aq'
        },
      },
      trigger: {
        seconds: 2
      }

    })
  }

  function sendPushNotificationHandler() {
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify({
        to: 'ExponentPushToken[xxxxxxxxxxxxxxxx]',
        title: 'Makan Tomat Sambil duduk di Bangku',
        data: { extraData: 'Ini adalah data tambahan' },
        body: 'Ini adalah notifikasi push pertama AQ!!!'
      })
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button title='Schedule Notification' onPress={scheduleNotificationHandler}/>
      <Button title='Send Push Notification' onPress={sendPushNotificationHandler}/>
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
