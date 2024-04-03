

import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getAuth } from "firebase/auth";
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set, query, limitToLast, push, onChildAdded, orderByChild, equalTo } from "firebase/database";
import dayjs from 'dayjs';
const db = getDatabase();


const Item = ({value, date}) => (
  <View style={styles.item}>
    <Text style={styles.date}>{dayjs(date).format('MM/DD/YYYY hh:mm:ss A')}</Text>
    <Text style={styles.title}>{value}</Text>
  </View>
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sugarLevel, setSugarLevel] = useState(null);
  const [list, setList] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  
  useEffect(() => {
    try{
      
      const starCountRef = ref(db, 'current-device-reading');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot?.val();
        setSugarLevel(data)
        setIsLoading(false)

        setTimeout(() => {
          setSugarLevel(null)
          setIsLoading(true)
        }, 5000)
      });
    }catch(e){
      console.log(e)

    }
  }, [])

  useEffect(() => {
    if(sugarLevel){

      const timestamp = dayjs().valueOf()
      const listRef =  ref(db, `sugar-readings/${timestamp}`)
      
      set(listRef, {
        value: sugarLevel,
        uid: user?.uid,
        timestamp
      });

    }
  }, [sugarLevel])

  useEffect(() => {
    const listRef = ref(db, 'sugar-readings');
    const q = query(listRef, orderByChild('uid'), equalTo(user?.uid));
    onValue(q, (snapshot) => {
      setList(snapshot?.val())
    })
      
  },[])

  
  return (
    <View style={styles.container}>
      {isLoading ?
      <ActivityIndicator size="large" /> : null}
      {isLoading ? 
        <Text>Waiting for device result...</Text> : null}
      {sugarLevel ?
      <Text style={styles.textResult}>{sugarLevel}</Text> : null}
      {sugarLevel ?
      <Text>Current Sugar Reading</Text> : null}
      <Text>{user?.providerData?.[0]?.email}</Text>
      
      <SafeAreaView style={styles.list}>
        <FlatList
          data={Object.values(list || {})}
          renderItem={({item}) => <Item date={item?.timestamp} value={item.value} />}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </View>
  )
}

export default Dashboard


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textResult: {
    fontSize: 100,
    fontWeight: 'bold',
    color: 'blue',
  },
  item: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    padding: 5,
  },
  list: {
    height: '50%',
    width: '100%',
    padding: 10,
    margin: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  
});

