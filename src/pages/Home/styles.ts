import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #36393f;
`;

export const ButtonPost = styled.TouchableOpacity`
  position: absolute;
  z-index: 99;
  bottom: 5%;
  right: 6%;
  width: 60px;
  height: 60px;
  background-color: #202225;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
`;

export const ListPosts = styled.FlatList`
  flex: 1;
  background-color: #f1f1f1;
`