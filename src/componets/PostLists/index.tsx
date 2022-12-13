import React, {useState} from 'react';
import {
  Container,
  Name,
  Header,
  Avatar,
  ContentView,
  Content,
  Actions,
  LikeButton,
  Like,
  TimePost,
} from './styles';

import {formatDistance} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import firestore from '@react-native-firebase/firestore';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
interface props {
  data: {
    content: string;
    created: {
      seconds: number;
      nanoseconds: number;
    };
    avatarUrl: null | string;
    autor: string;
    likes: number;
    userId: string;
    id: string;
  };
}
function PostsList(data: props, userId: string) {
  const [likePost, setLikePost] = useState(data.data.likes);

  async function handlerLiskePost(id: string, likes: number) {
    const docid = `${userId}_${id}`;

    const doc = await firestore().collection('likes').doc(docid).get();

    if (doc.exists) {
      await firestore()
        .collection('posts')
        .doc(id)
        .update({
          likes: likes - 1,
        });

      await firestore()
        .collection('likes')
        .doc(docid)
        .delete()
        .then(() => {
          setLikePost(likes - 1);
        });
      return;
    }
    await firestore().collection('likes').doc(docid).set({
      postId: id,
      userId: userId,
    });

    await firestore()
      .collection('posts')
      .doc(id)
      .update({
        likes: likes + 1,
      })
      .then(() => {
        setLikePost(likes + 1);
      });
  }
  function formatTimePost() {
    const datePost = new Date(data.data.created.seconds * 1000);
    return formatDistance(new Date(), datePost, {
      locale: ptBR,
    });
  }

  return (
    <Container>
      <Header>
        {data.data.avatarUrl ? (
          <Avatar source={{uri: data.data.avatarUrl}} />
        ) : (
          <Avatar source={require('../../assets/avatar.png')} />
        )}
        <Name numberOfLines={1}>{data.data.autor}</Name>
      </Header>

      <ContentView>
        <Content>{data.data.content}</Content>
      </ContentView>

      <Actions>
        <LikeButton
          onPress={() => handlerLiskePost(data.data.id, likePost)}>
          <Like>{likePost}</Like>
          <MaterialCommunityIcons
            name={likePost === 0 ? 'heart-plus-outline' : 'cards-heart'}
            size={20}
            color="#E52246"
          />
        </LikeButton>

        <TimePost>{formatTimePost()}</TimePost>
      </Actions>
    </Container>
  );
}

export default PostsList;
