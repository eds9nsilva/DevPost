import React, {useState, useLayoutEffect, useContext} from 'react';
import {Button, ButtonText, Container, Input} from './styles';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {AuthContext, User} from '../../contexts/auth';
import { Alert } from 'react-native';

function NewPost() {
  const navigation = useNavigation();
  const [post, setPost] = useState<string | undefined>(undefined);

  const {user} = useContext(AuthContext);

  useLayoutEffect(() => {
    const options = navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => handlerPots()}>
          <ButtonText>Compartilhar</ButtonText>
        </Button>
      ),
    });
  }, []);

  async function handlerPots() {
    console.log(post)
    if (!post) {
      Alert.alert('Error ao criar', 'Preencha todos os campos!')
      return;
    }

    let avatarUrl;
    try {
      let response = await storage()
        .ref('users')
        .child(user?.uid)
        .getDownloadURL();

      avatarUrl = response;
    } catch (error) {
      avatarUrl = null;
    }
    await firestore().collection('posts').add({
      created: new Date(),
      content: post,
      autor: user?.nome,
      userId: user?.uid,
      likes: 0,
      avatarUrl,
    }).then(() => {
      setPost(undefined)
      Alert.alert('Suecesso', 'Post criado com sucesso!')
    }).catch(erro => {
      console.log('Error ao criar post', erro)
    })
    navigation.goBack()
  }
  return (
    <Container>
      <Input
        placeholder="O que está acontecendo ?"
        value={post}
        onChangeText={text => setPost(text)}
        autoCorrect={false}
        multiline={true}
        placeholderTextColor="#DDD"
        maxLength={200}
      />
    </Container>
  );
}

export default NewPost;
