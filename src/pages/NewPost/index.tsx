import React, {useState, useLayoutEffect} from 'react';
import {Button, ButtonText, Container, Input} from './styles';
import {useNavigation} from '@react-navigation/native';
function NewPost() {
  const navigation = useNavigation()
  const [post, setPost] = useState('');

  useLayoutEffect(() => {
    const options = navigation.setOptions({
      headerRight: () => (
        <Button>
          <ButtonText>Compartilhar</ButtonText>
        </Button>
      )
    })
  }, []);

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
