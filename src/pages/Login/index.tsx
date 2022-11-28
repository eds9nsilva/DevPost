import React, {useContext, useState} from 'react';
import {ActivityIndicator, Alert, Text} from 'react-native';
import {AuthContext} from '../../contexts/auth';
import {
  ButtonText,
  Container,
  Input,
  Title,
  Button,
  SignUpButton,
  SignUpText,
} from './styles';

function Login() {
  const [login, setLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {signUp, singIn, loadingAuth} = useContext(AuthContext);

  async function handlerSingIn() {
    if (email === '' || password == '') {
      Alert.alert('Preencha todos os campos');
      return;
    }
    await singIn(email, password);
  }

  async function handlerSignUp() {
    if (email === '' || password == '' || name === '') {
      Alert.alert('Preencha todos os campos');
      return;
    }
    await signUp(email, password, name);
  }

  if (login) {
    return (
      <Container>
        <Title>
          Dev <Text style={{color: '#e52246'}}>Post</Text>
        </Title>
        <Input
          placeholder="SeuEmail@email.com"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Input
          placeholder="******"
          value={password}
          onChangeText={password => setPassword(password)}
          secureTextEntry
        />
        <Button onPress={() => handlerSingIn()}>
          {loadingAuth ? (
            <ActivityIndicator size={20} color="#fff" />
          ) : (
            <ButtonText>Acessar</ButtonText>
          )}
        </Button>
        <SignUpButton
          onPress={() => {
            setLogin(false);
            setEmail('');
            setPassword('');
          }}>
          <SignUpText>Criar uma conta</SignUpText>
        </SignUpButton>
      </Container>
    );
  }
  return (
    <Container>
      <Title>
        Dev <Text style={{color: '#e52246'}}>Post</Text>
      </Title>
      <Input
        placeholder="Seu nome"
        value={name}
        onChangeText={name => setName(name)}
      />
      <Input
        placeholder="SeuEmail@email.com"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <Input
        placeholder="******"
        value={password}
        onChangeText={password => setPassword(password)}
        secureTextEntry
      />
      <Button onPress={() => handlerSignUp()}>
        {loadingAuth ? (
          <ActivityIndicator size={20} color="#fff" />
        ) : (
          <ButtonText>Cadastrar</ButtonText>
        )}
      </Button>
      <SignUpButton
        onPress={() => {
          setLogin(true);
          setEmail('');
          setName('');
          setPassword('');
        }}>
        <SignUpText>Já possuo uma conta</SignUpText>
      </SignUpButton>
    </Container>
  );
}

export default Login;
