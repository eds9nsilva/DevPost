import React, {useContext} from 'react';
import {View, Text, Button} from 'react-native';

import {AuthContext} from '../../contexts/auth';

function Profile() {
  const {signOut} = useContext(AuthContext);

  async function handlerSignOut() {
    await signOut();
  }
  return (
    <View>
      <Text>TELA PERFIL</Text>
      <Button title="Sair" onPress={() => handlerSignOut()} />
    </View>
  );
}

export default Profile;
