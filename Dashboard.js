

import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { getAuth } from "firebase/auth";
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set, query, limitToLast, push, onChildAdded, orderByChild, equalTo, off  } from "firebase/database";
import dayjs from 'dayjs';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";


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
  const [isStartReading, setIsStartReading] = useState(false)
  
  useEffect(() => {
    const starCountRef = ref(db, 'current-device-reading');
    if(!!isStartReading){
      try{
        
        onValue(starCountRef, (snapshot) => {
          const data = snapshot?.val();
          if(data){
            setSugarLevel(data)
            setIsLoading(false)
          }
          
          setTimeout(() => {
            setSugarLevel(null)
            setIsLoading(true)
          }, 5000)
        });
      }catch(e){
        console.log(e)
      }
    }

    if(!isStartReading){
      off(starCountRef)
    }
    
  }, [isStartReading])

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
    const q = query(listRef, orderByChild('uid'), equalTo(user?.uid), limitToLast(10));
    onValue(q, (snapshot) => {
      setList(snapshot?.val())
    })
      
  },[])

  const onHandleSend = () => {
    setIsStartReading(prev => {
      
      if(!!prev){
        const currentDeviceReading =  ref(db, `current-device-reading`)
        set(currentDeviceReading, null);
        setIsLoading(true)
      }

      return !prev
    })
  }

  
  return (
    <View style={styles.container}>
      {isStartReading && isLoading ?
      <ActivityIndicator size="large" /> : null}
      {isStartReading &&  isLoading ? 
        <Text>Waiting for device result...</Text> : null}
      {isStartReading && sugarLevel ?
      <Text style={styles.textResult}>{sugarLevel}</Text> : null}
      {isStartReading && sugarLevel ?
      <Text>Current Sugar Reading</Text> : null}
      <View style={{ margin: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'blue' }}>{user?.providerData?.[0]?.email}</Text>
      </View>
      <Pressable style={!isStartReading ? styles.startButton : styles.stopButton} onPress={onHandleSend}>
        <Text style={{ color: 'white'}}>{!isStartReading ? 'START' : 'STOP'}</Text>
      </Pressable>
      {Object.keys(list || [])?.length > 0 ?
      <View>
        <LineChart
            data={{
              labels: Object.keys(list || []).map((x) => dayjs(x).format('HH:mm')),
              datasets: [
                {
                  data: Object.values(list || []).map(x => parseFloat(x?.value))
                }
              ]
            }}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
      </View> : null}
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
  }
  
});

