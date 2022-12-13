import React, {useState, useContext, useEffect, useCallback} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {Container, ButtonPost, ListPosts} from './styles';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Header from '../../componets/Header';
import {AuthContext} from '../../contexts/auth';
import firestore from '@react-native-firebase/firestore';
import PostLists from '../../componets/PostLists';
function Home() {
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [lastItem, setLastItem] = useState<any>('');
  const [emptyList, setEmptyList] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      function fetchPosts() {
        firestore()
          .collection('posts')
          .orderBy('created', 'desc')
          .limit(5)
          .get()
          .then(snapshot => {
            if (isActive) {
              setPost([]);
              const postList = [];
              snapshot.docs.map(u => {
                postList.push({
                  ...u.data(),
                  id: u.id,
                });
              });
              setEmptyList(!!snapshot.empty);
              setPost(postList);
              setLastItem(snapshot.docs[snapshot.docs.length - 1]);
              setLoading(false);
            }
          });
      }
      fetchPosts();
      return () => {
        isActive = false;
      };
    }, []),
  );

  async function handlerRefreshPost() {
    setLoadingRefresh(true);
    firestore()
      .collection('posts')
      .orderBy('created', 'desc')
      .limit(5)
      .get()
      .then(snapshot => {
        setPost([]);
        const postList = [];
        snapshot.docs.map(u => {
          postList.push({
            ...u.data(),
            id: u.id,
          });
        });
        setEmptyList(false);
        setPost(postList);
        setLastItem(snapshot.docs[snapshot.docs.length - 1]);
        setLoading(false);
        setLoadingRefresh(false);
      });
  }

  async function getListPosts() {
    if (emptyList) {
      setLoading(false);
      return null;
    }

    if (loading) return;

    firestore()
      .collection('posts')
      .orderBy('created', 'desc')
      .limit(5)
      .startAfter(lastItem)
      .get()
      .then(snapshot => {
        const postList = [];

        snapshot.docs.map(u => {
          postList.push({
            ...u.data(),
            id: u.id,
          });
        });
        setEmptyList(!!snapshot.empty);
        setLastItem(snapshot.docs[snapshot.docs.length - 1]);
        setPost(oldsPosts => [...oldsPosts, ...postList]);
        setLoading(false);
      });
  }
  return (
    <Container>
      <Header />

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={50} color="#e52246" />
        </View>
      ) : (
        <ListPosts
          data={post}
          renderItem={item => <PostLists data={item.item} userId={user?.uid} />}
          refreshing={loadingRefresh}
          onRefresh={handlerRefreshPost}
          onEndReached={() => getListPosts()}
          onEndReachedThreshold={0.1}
        />
      )}
      <ButtonPost
        onPress={() => navigation.navigate('NewPost')}
        activeOpacity={0.8}>
        <Feather name="edit-2" color="#fff" size={25} />
      </ButtonPost>
    </Container>
  );
}

export default Home;
