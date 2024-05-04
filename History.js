

import {  StyleSheet, Text, View, Dimensions, Pressable, SafeAreaView, FlatList } from 'react-native';
import { getAuth } from "firebase/auth";
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, query, limitToLast,  orderByChild, equalTo  } from "firebase/database";
import dayjs from 'dayjs';
import {
  LineChart
} from "react-native-chart-kit";


const db = getDatabase();


const Item = ({ value, date, fontSize, fontColor }) => (
  <View style={styles.item}>
    <Text style={[styles.date, { fontSize, color: fontColor }]}>
      {dayjs(date).format('MM/DD/YYYY hh:mm:ss A')}
    </Text>
    <Text style={[styles.title, { fontSize, color: fontColor }]}>{value}</Text>
  </View>
);
const History = ({ navigation }) => {
  
  const [list, setList] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  
  useEffect(() => {
    const listRef = ref(db, 'sugar-readings');
    const q = query(listRef, orderByChild('uid'), equalTo(user?.uid), limitToLast(10));
    onValue(q, (snapshot) => {
      setList(snapshot?.val())
    })
      
  },[])

  const onHandleBackToReader = () => {
    navigation.navigate('Dashboard')
  }

  

  const newList = Object.values(list || {}).length > 0 ? Object.values(list).sort((a, b) => a.timestamp - b.timestamp) : []
  return (
    <View style={styles.container}>
      <View style={{ margin: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>{user?.providerData?.[0]?.email}</Text>
      </View>
      {newList?.length > 0 ?
      <View>
        <LineChart
            data={{
              labels: newList.map((x) => dayjs(x?.timestamp).format('HH:mm')),
              datasets: [
                {
                  data: newList.map(x => parseFloat(x?.value))
                }
              ]
            }}
            width={Dimensions.get("window").width} // from react-native
            height={180}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#AED3D4",
              backgroundGradientTo: "#3F9092",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "black"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 0
            }}
          />
      </View> : null}
      {newList?.length > 0 ? 
      <SafeAreaView style={styles.list}>
        <FlatList
          data={newList}
          renderItem={({item}) => <Item date={item?.timestamp} value={item.value} />}
          keyExtractor={item => item.id}
        />
      </SafeAreaView> : null}
      <Pressable style={styles.historyButton} onPress={onHandleBackToReader}>
        <Text style={{ color: 'black'}}>Sugar Reader</Text>
      </Pressable>    
      {/* <SafeAreaView style={styles.list}>
        <FlatList
          data={Object.values(list || {})}
          renderItem={({item}) => <Item date={item?.timestamp} value={item.value} />}
          keyExtractor={item => item.id}
        />
      </SafeAreaView> */}
    </View>
  )
}

export default History


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AED3D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textResult: {
    fontSize: 100,
    fontWeight: 'bold',
    color: 'blue',
  },
  item: {
    width: Dimensions.get("window").width-100,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    padding: 5,
    borderColor: 'black',
  },
  list: {
    height: '50%',
    width: '100%',
    padding: 10,
    margin: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    
  },
  startButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20
  },
  stopButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20
  },
  historyButton: {
    backgroundColor: 'white',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20
  }
  
});


